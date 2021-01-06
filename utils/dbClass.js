const mysql = require('mysql2');
const cTable = require('console.table');

const sqlpass = 'password'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'grader',
  password: sqlpass,
  database: 'company'
})

class db {
  constructor() {

  }

  viewDepartments() {
    return new Promise ((res, rej) => {
      pool.query(`
        SELECT * FROM department
        ORDER BY id ASC;
        `, (err, results, fields) => res(console.table(results)))
    })
  }

  viewRoles() {
    return new Promise ((res, rej) => {
      pool.query(`
        SELECT roles.id, roles.title, roles.salary, roles.department_id, department.name AS dept_name
        FROM roles
        JOIN department ON roles.department_id=department.id
        ORDER BY id ASC;
        `, (err, results, fields) => res(console.table(results)))
    })
  }

  viewEmployees() {
    return new Promise ((res, rej) => {
      pool.execute(`
        SELECT
          e1.id,
          e1.first_name,
          e1.last_name,
          roles.title,
          department.name AS department,
          roles.salary,
          CONCAT(e2.first_name, " ", e2.last_name) AS Reporting_Manager
        FROM employee e1
        INNER JOIN roles ON e1.role_id = roles.id
        INNER JOIN department ON roles.department_id = department.id
        LEFT JOIN employee e2 ON e1.manager_id = e2.id
        ORDER BY id ASC;
        `, (err, results, fields) => {
          if (err) console.log(err);
          res(console.table(results))
        })
    })
  }

  managersEmployees(id) {
    return new Promise ((res, rej) => {
      pool.execute(`
        SELECT
          employee.id,
          first_name,
          last_name,
          roles.title,
          department.name AS department,
          roles.salary
        FROM employee
        INNER JOIN roles ON employee.role_id = roles.id
        INNER JOIN department ON roles.department_id = department.id
        WHERE manager_id = ?
        ORDER BY employee.id ASC;
        `, [id], (err, results, fields) => {
          if (err) console.log(err);
          if (!results[0]) res(console.log('There are no employees under this manager'))
          res(console.table(results))
        })
    })
  }

  insertDepartment(department){
    return new Promise ((res, rej) => {
      pool.execute(`INSERT INTO department (name) VALUES (?)`, [department], (err, results, fields) => {
        res(results);
      })
    })
  }

  insertRole(title, salary, department){
    return new Promise ((res, rej) => {
      pool.execute(
        `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`,
        [title, salary, department], (err, results, fields) => {
          if (err) console.log(err);
          res(results);
        })
    })
  }

  insertEmployee(firstName, lastName, role, manager) {
    if (manager === 'No manager to report to.') manager = null;
    return new Promise ((res, rej) => {
      pool.execute(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
        [firstName, lastName, role, manager], (err, results, fields) => {
          if (err) console.log(err);
          res(results);
        })
    })
  }

  roleId(role) {
    return new Promise((res, rej) => {
      pool.execute(`SELECT id FROM roles WHERE title = ?`, [role], (err, results, fields) => {
        if (err) console.log(err);
        let roleId = results.map(data => data.id);
        let resolve = roleId[0];
        res(resolve);
        })
    })
  }

  managerId(manager) {
    if (manager === 'No manager to report to.') return null;
    let managerName = manager.split(' ');
    let managerFirstName = managerName[0];
    let managerLastName = managerName[1];
    return new Promise((res, rej) => {
      pool.execute(`SELECT id FROM employee WHERE first_name = ? AND last_name = ?`, [managerFirstName, managerLastName], (err, results, fields) => {
        if (err) console.log(err);
        let managerId = results.map(data => data.id);
        let resolve = managerId[0];
        res(resolve);
        })
    })
  }


  departmentId(dept) {
    return new Promise((res, rej) => {
      pool.execute(`SELECT id FROM department WHERE name = ?`, [dept], (err, results, fields) => {
        if (err) console.log(err);
        let departmentId = results.map(data => data.id);
        let resolve = departmentId[0];
        res(resolve);
        })
    })
  }


  async updateEmployeeRole(data) {
    let name = data.employee;
    let nameArr = name.split(' ');
    let firstName = nameArr[0];
    let lastName = nameArr[1];
    let role = await this.roleId(data.role);
    return new Promise((res, rej) => {
      pool.execute(`
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

  async updateEmployeeManager(data) {
    let name = data.employee;
    let nameArr = name.split(' ');
    let firstName = nameArr[0];
    let lastName = nameArr[1];
    let manager = await this.managerId(data.manager);
    return new Promise((res, rej) => {
      pool.execute(`
        UPDATE employee
        SET manager_id = ?
        WHERE first_name = ? AND last_name = ?`,
        [manager, firstName, lastName], (err, results, fields) => {
          if (err) console.log('Error: ' + err);
          res(results);
        }
      )
    })
  }


  employeeList() {
    return new Promise((res, rej) => {
      pool.query('SELECT * FROM employee', (err, results, fields) => {
        let empArr = [...results];
        let empChoices = empArr.map(data => `${data.first_name} ${data.last_name}`);
        res(empChoices);
      })
    })
  }

  roleList() {
    return new Promise((res, rej) => {
      pool.query('SELECT * FROM roles', (err, results, fields) => {
        let roleArr = [...results];
        let roleChoices = roleArr.map(data => `${data.title}`);
        res(roleChoices);
      })
    })
  }

  managerList() {
    let set = null;
    return new Promise((res, rej) => {
      pool.query('SELECT * FROM employee WHERE manager_id is ?', [set], (err, results, fields) => {
        let managerArr = [...results];
        let managerChoices = managerArr.map(data => `${data.first_name} ${data.last_name}`);
        managerChoices.push('No manager to report to.');
        res(managerChoices);
      })
    })
  }


  departmentList() {
    return new Promise((res, rej) => {
      pool.query('SELECT * FROM department', (err, results, fields) => {
        let deptArr = [...results];
        let deptChoices = deptArr.map(data => `${data.name}`);
        res(deptChoices);
      })
    })
  }
}

module.exports = db;