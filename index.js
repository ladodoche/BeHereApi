const express = require('express');
const ModelIndex = require('./models');
const RouteManager = require('./configs/Routes');

ModelIndex
.openDatabase()
.then(_startServer)
.catch((err) => {
  console.error(err);
});

// INTERNAL

function _startServer() {

  const app = express();
  RouteManager.attach(app);

  // API-DOC generation
  // apidoc -e "(node_modules|public)" -o apiDoc / apidoc
  // public/index.html

  //app.use(express.static('apiDoc'));

  app.listen(8081, function() {
    console.log('Server started on 8081...');
  });
}
