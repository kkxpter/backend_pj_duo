var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : '202.28.34.197',
  user     : 'web66_65011212143',
  password : '65011212143@csmsu',
  database : 'web66_65011212143'
});
 
conn.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + conn.threadId);
});

module.exports = conn;