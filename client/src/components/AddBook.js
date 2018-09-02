import React, { Component } from 'react';
import {graphql, compose} from 'react-apollo';

import {getAuthorsQuery,addBookMutation,getBooksQuery} from '../queries/queries';

class AddBook extends Component{
  state={
    name: "",
    genre: "",
    authorid: ""
  }
  displayAuthors(){
    const data = this.props.getAuthorsQuery;
    if(data.loading){
      return (<option disabled>Loading Authors...</option>);
    }else if(data.authors){
      return data.authors.map(author=>{
        return (<option key={author.id} value={author.id}>{author.name}</option>)
      })
    }
  }
  submitForm =(e)=>{
    e.preventDefault();//prevent from refreshing the page
    const {name,genre,authorid} = this.state;
    this.props.addBookMutation({
      variables:{
        name,
        genre,
        authorid
      },
      refetchQueries:[{query: getBooksQuery}]
    })

  }
  render(){
    return(
      <form id="add-book" onSubmit={this.submitForm}>
        <div className="field">
          <label>Book name:</label>
          <input type="text" onChange={e=>this.setState({name: e.target.value})} value={this.state.name}/>
        </div>
        <div className="field">
          <label>Genre:</label>
          <input type="text" onChange={e=>this.setState({genre: e.target.value})} value={this.state.genre}/>
        </div>
        <div className="field">
          <label>Author:</label>
          <select onChange={e=>this.setState({authorid: e.target.value})} value={this.state.authorid}>
            <option>Select author</option>
            {this.displayAuthors()}
          </select>
        </div>
        <button>+</button>
      </form>
    )
  }
}

export default compose(
  graphql(getAuthorsQuery,{name:'getAuthorsQuery'}),
  graphql(addBookMutation,{name:'addBookMutation'})
)(AddBook);
