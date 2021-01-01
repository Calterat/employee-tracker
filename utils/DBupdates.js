const mysql = require('mysql2');
const cTable = require('console.table');

const sqlpass = 'password'

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'grader',
  password: sqlpass,
  database: 'company'
})

const roleId = (role) => {
  return new Promise((res, rej) => {
    connection.execute(`SELECT id FROM roles WHERE title = ?`, [role], (err, results, fields) => {
      if (err) console.log(err);
      let roleId = results.map(data => data.id);
      let resolve = roleId[0].toString();
      res(resolve);
      })
  })
}

const dbUpdateEmp = async (data) => {
  let name = data.employee;
  let nameArr = name.split(' ');
  let firstName = nameArr[0];
  let lastName = nameArr[1];
  let role = await roleId(data.role);
  return new Promise((res, rej) => {
    connection.execute(`
      UPDATE employee
      SET role_id = ?
      WHERE first_name = ? AND last_name = ?`,
      [role, firstName, lastName], (err, results, fields) => {
        if (err) console.log('Error: ' + err);
        res(results);
      }
    )
  })
}

module.exports = { dbUpdateEmp }