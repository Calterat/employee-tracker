const mysql = require('mysql2');
const cTable = require('console.table');

const sqlpass = 'password'

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'grader',
  password: sqlpass,
  database: 'company'
})

const employeeList = () => {
  return new Promise((res, rej) => {
    connection.query('SELECT * FROM employee', (err, results, fields) => {
      let empArr = [...results];
      let empChoices = empArr.map(data => `${data.first_name} ${data.last_name}`);
      res(empChoices);
    })
  })
}

const roleList = () => {
  return new Promise((res, rej) => {
    connection.query('SELECT * FROM roles', (err, results, fields) => {
      let roleArr = [...results];
      let roleChoices = roleArr.map(data => `${data.title}`);
      res(roleChoices);
    })
  })
}

module.exports = { employeeList, roleList };