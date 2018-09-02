import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';//can also do import ApolloClient from 'apollo-client';
import {ApolloProvider} from 'react-apollo';

import BookList from './components/BookList.js';
import AddBook from './components/AddBook.js';

//apollo client setup
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div id="main">
          <h1>Alvin&apos;s Reading List</h1>
          <BookList/>
          <AddBook/>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
