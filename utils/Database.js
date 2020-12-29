const mysql = require('mysql2');
const cTable = require('console.table');

const sqlpass = 'bpz92odK$'

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: sqlpass,
  database: 'company'
})

const viewDepartments = () => {
  return new Promise ((res, rej) => {
    connection.query('SELECT * FROM department', (err, results, fields) => {
      res(console.table(results));
    })
  })
}

const viewRoles = () => {
  return new Promise ((res, rej) => {
    connection.query('SELECT * FROM roles', (err, results, fields) => {
      res(console.table(results));
    })
  })
}

const viewEmployees = () => {
  return new Promise ((res, rej) => {
    connection.query('SELECT * FROM employee', (err, results, fields) => {
      res(console.table(results));
    })
  })
}


module.exports = { viewDepartments, viewRoles, viewEmployees }