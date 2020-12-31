const mysql = require('mysql2');
const cTable = require('console.table');

const sqlpass = 'password'

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'grader',
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
      console.log(results);
      res(console.table(results));
    })
  })
}

const insertDepartment = department => {
  return new Promise ((res, rej) => {
    connection.execute(`INSERT INTO department (name) VALUES (?)`, [department], (err, results, fields) => {
      res(results);
    })
  })
}

const insertRole = (title, salary, department) => {
  return new Promise ((res, rej) => {
    let department_id = parseInt(department[10]);
    connection.execute(
      `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`,
      [title, salary, department_id], (err, results, fields) => {
        if (err) console.log(err);
        res(results);
      })
  })
}

const insertEmployee = (firstName, lastName, role, manager) => {
  return new Promise ((res, rej) => {
    let role_id = parseInt(role[4]);
    let manager_id = parseInt(manager[7]);
    connection.execute(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
      [firstName, lastName, role_id, manager_id], (err, results, fields) => {
        if (err) console.log(err);
        res(results);
      })
  })
}

module.exports = { 
  viewDepartments, viewRoles, viewEmployees, insertDepartment, insertRole, insertEmployee
 }