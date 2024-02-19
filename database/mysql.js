
var mysql      = require('mysql');
// Local DB
// var connection = mysql.createConnection({
//   host     : '127.0.0.1',
//   user     : 'root',
//   password : '',
//   database: 'box',
// });

// Online DB

  var connection = mysql.createConnection({
    host: 'sql8.freesqldatabase.com',
    user: 'sql8684846',
    password: 'wjYT2GGLw6',
    database: 'sql8684846'
  });

module.exports = connection;
