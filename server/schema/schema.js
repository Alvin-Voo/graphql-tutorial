const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull} = graphql;
const Book = require('../models/book');
const Author = require('../models/author');
// let books = [
//   {name:'Name of the Wind',genre:'Fantasy',id:'1',authorid:'1'},
//   {name:'The Final Empire',genre:'Fantasy',id:'2',authorid:'2'},
//   {name:'The Long Earth',genre:'Sci-Fi',id:'3',authorid:'3'},
//   {name:'The Hero of Ages',genre:'Fantasy',id:'4',authorid:'2'},
//   {name:'The Colour of Magic',genre:'Fantasy',id:'5',authorid:'3'},
//   {name:'The Light Fantastic',genre:'Fantasy',id:'6',authorid:'3'}
// ]
//
// let authors = [
//   {name: 'Patrick Rothfuss', age:44,id:'1'},
//   {name: 'Brandon Moore', age: 32,id:'2'},
//   {name: 'Terry Snouserfield', age: 66, id:'3'}
// ]

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({//its like a thunk, delay execution of the function due to two/multiple ways dependencies between different types,
    //here depends on AuthorType which is defined later. If not wrapped, it will be executed immediately upon initialization of BookType
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    genre: {type: GraphQLString},
    author: {
      type: AuthorType,
      resolve(parent, args){
        //parent here refers to the book, since the book is first found
        //console.log(parent);
        //return authors.find(author => author.id===parent.authorid);
        return Author.findById(parent.authorid);
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    books:{
      type:new GraphQLList(BookType),
      resolve(parent, args){
        //return books.filter(book=>book.authorid===parent.id)
        return Book.find({authorid:parent.id});
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name:'RootQueryType',
  fields:{
    book:{
      type: BookType,
      args:{id:{type:GraphQLID}},//<---argument for user to pass, i.e. book(id: "1"){ ...}
      resolve(parent,args){
        //code to get data from db/other source
        //return books.find(book => book.id === args.id);
        return  Book.findById(args.id);
      }
    },
    author:{
      type: AuthorType,
      args:{id:{type: GraphQLID}},
      resolve(parent,args){
        //return authors.find(author => author.id === args.id);
        return Author.findById(args.id);
      }
    },
    books:{
      type:new GraphQLList(BookType),
      resolve(parent,args){
        //return books
        return Book.find({});
      }
    },
    authors:{
      type:new GraphQLList(AuthorType),
      resolve(parent,args){
        //return authors//<--this is actually the array defined on top
        return Author.find({});
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name:'Mutation',
  fields:{
    addAuthor:{
      type:AuthorType,
      args:{
        name:{type: new GraphQLNonNull(GraphQLString)},
        age:{type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent,args){
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();//save in mongodb
      }
    },
    addBook:{
      type:BookType,
      args:{
        name: {type: new GraphQLNonNull(GraphQLString)},
        genre: {type: new GraphQLNonNull(GraphQLString)},
        authorid: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent,{name, genre, authorid}){
          let book = new Book({
            name,
            genre,
            authorid
          });
          return book.save();
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
