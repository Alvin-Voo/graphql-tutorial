const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb://localhost:27017/learn-gphql", { useNewUrlParser: true });
mongoose.connection.once('open',()=>{
  console.log('connected to db');
});

// app.use('/graphql', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//   if (req.method === 'OPTIONS') {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// });

app.use('/graphql',
  function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if (req.method === 'OPTIONS') {//handles the preflight http header of CORS
      res.sendStatus(200);
    } else {
      next();
    }
  },
  graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(4000,()=>{
  console.log('now listening for requests on port 4000');
})
