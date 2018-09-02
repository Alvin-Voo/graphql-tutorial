import React, { Component } from 'react';
import {graphql} from 'react-apollo';

import {getBookQuery} from '../queries/queries';

class BookDetails extends Component{
  displayBookDetails(){
    const {book} = this.props.data;
    if(book){
      const {name, genre, author} = book;
      return(
        <div>
          <h2>{name}</h2>
          <p>{genre}</p>
          <p>{author.name}</p>
          <p>All books by this author.</p>
          <ul className="other-books">
            {author.books.map(book=>{
              return <li key={book.id}>{book.name}</li>
            })}
          </ul>
        </div>
      )
    }else{
      return <div>No book selected...</div>
    }
  };

  render(){
    return (
      <div id="book-details">
        {this.displayBookDetails()}
      </div>
    );
  }
}

export default graphql(getBookQuery,{
  options:(props)=>{
    return{
      variables:{
        id: props.bookId
      }
    }
  }
})(BookDetails);
