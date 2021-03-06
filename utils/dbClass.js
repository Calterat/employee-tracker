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
  constructor() {}

  viewDepartments() {
    return new Promise((res, rej) => {
      pool.query(`
        SELECT * FROM department
        ORDER BY id ASC;
        `, (err, results, _fields) => {
        if (err) rej(err);
        res(console.table(results))
      })
    })
  }

  viewRoles() {
    return new Promise((res, rej) => {
      pool.query(`
        SELECT roles.id, roles.title, roles.salary, roles.department_id, department.name AS dept_name
        FROM roles
        JOIN department ON roles.department_id=department.id
        ORDER BY id ASC;
        `, (err, results, _fields) => {
        if (err) rej(err);
        res(console.table(results))
      })
    })
  }

  deleteDept(id) {
    return new Promise((res, rej) => {
      pool.execute(`
        DELETE FROM department where id = ?
        `, [id], (err, results, fields) => {
        if (err) rej(err);
        res(console.log('Deleted!'))
      })
    })
  }

  deleteRole(id) {
    return new Promise((res, rej) => {
      pool.execute(`
        DELETE FROM roles where id = ?
        `, [id], (err, _results, _fields) => {
        if (err) rej(err);
        res(console.log('Deleted!'))
      })
    })
  }

  deleteEmployee(id) {
    return new Promise((res, rej) => {
      pool.execute(`
        DELETE FROM employee where id = ?
        `, [id], (err, _results, _fields) => {
        if (err) rej(err);
        res(console.log('Deleted!'))
      })
    })
  }

  viewEmployees() {
    return new Promise((res, rej) => {
      pool.query(`
        SELECT
          e1.id,
          e1.first_name,
          e1.last_name,
          roles.title,
          department.name AS department,
          roles.salary,
          CONCAT(e2.first_name, " ", e2.last_name) AS Reporting_Manager
        FROM employee e1
        JOIN roles ON e1.role_id = roles.id
        JOIN department ON roles.department_id = department.id
        LEFT JOIN employee e2 ON e1.manager_id = e2.id
        ORDER BY id ASC;
        `, (err, results, _fields) => {
        if (err) rej(err);
        res(console.table(results))
      })
    })
  }

  managersEmployees(id) {
    return new Promise((res, rej) => {
      pool.query(`
        SELECT
          e1.id,
          e1.first_name,
          e1.last_name,
          roles.title,
          department.name AS department,
          roles.salary
        FROM employee e1
        INNER JOIN roles ON e1.role_id = roles.id
        INNER JOIN department ON roles.department_id = department.id
        WHERE manager_id = ?
        ORDER BY e1.id ASC;
        `, [id], (err, results, _fields) => {
        if (err) rej(err);
        if (!results[0]) res(console.log('There are no employees under this manager'))
        console.log('Updated!');
        res(console.table(results))
      })
    })
  }

  departmentCosts(id) {
    return new Promise((res, rej) => {
      pool.query(`
        SELECT
          sum(salary) as 'Total for Department'
        FROM Roles
        WHERE department_id = ?;
      `, [id], (err, results, _fields) => {
        if (err) rej(err);
        res(console.table(results))
      })
    })
  }

  departmentsEmployees(id) {
    return new Promise((res, rej) => {
      pool.query(`
        SELECT
          e1.id,
          e1.first_name,
          e1.last_name,
          roles.title,
          roles.salary,
          CONCAT(e2.first_name, " ", e2.last_name) AS Reporting_Manager
        FROM employee e1
        INNER JOIN roles ON e1.role_id = roles.id
        LEFT JOIN employee e2 ON e1.manager_id = e2.id
        WHERE department_id = ?
        ORDER BY e1.id ASC;
        `, [id], (err, results, _fields) => {
        if (err) rej(err);
        if (!results[0]) res(console.log('There are no employees under this manager'))
        res(console.table(results))
      })
    })
  }

  insertDepartment(department) {
    return new Promise((res, rej) => {
      pool.execute(`
        INSERT INTO department (name) VALUES (?)
        `, [department], (err, results, _fields) => {
        if (err) rej(err);
        console.log('Inserted!')
        res(results);
      })
    })
  }

  insertRole(title, salary, department) {
    return new Promise((res, rej) => {
      pool.execute(
        `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`,
        [title, salary, department], (err, results, _fields) => {
          if (err) rej(err);
          res(results);
        })
    })
  }

  insertEmployee(firstName, lastName, role, manager) {
    if (manager === 'None') manager = null;
    return new Promise((res, rej) => {
      pool.execute(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)
        `, [firstName, lastName, role, manager], (err, results, _fields) => {
          if (err) rej(err);
          console.log('Inserted!');
          res(results);
        })
    })
  }

  roleId(role) {
    return new Promise((res, rej) => {
      pool.query(`
        SELECT id FROM roles WHERE title = ?
        `, [role], (err, results, _fields) => {
        if (err) rej(err);
        let roleId = results.map(data => data.id);
        let resolve = roleId[0];
        res(resolve);
      })
    })
  }

  empId(name) {
    if (name === 'None') return null;
    let fullName = name.split(' ');
    let FirstName = fullName[0];
    let LastName = fullName[1];
    return new Promise((res, rej) => {
      pool.query(`
        SELECT id FROM employee WHERE first_name = ? AND last_name = ?
        `, [FirstName, LastName], (err, results, _fields) => {
        if (err) rej(err);
        let idArr = results.map(data => data.id);
        let id = idArr[0];
        res(id);
      })
    })
  }

  departmentId(dept) {
    return new Promise((res, rej) => {
      pool.query(`
        SELECT id FROM department WHERE name = ?
        `, [dept], (err, results, _fields) => {
        if (err) rej(err);
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
        [role, firstName, lastName], (err, results, _fields) => {
          console.log('Completed!');
          if (err) rej(err);
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
    let manager = await this.empId(data.manager);
    return new Promise((res, rej) => {
      pool.execute(`
        UPDATE employee
        SET manager_id = ?
        WHERE first_name = ? AND last_name = ?`,
        [manager, firstName, lastName], (err, results, _fields) => {
          if (err) rej(err);
          res(results);
        }
      )
    })
  }

  employeeList() {
    return new Promise((res, rej) => {
      pool.query('SELECT * FROM employee', (err, results, _fields) => {
        if (err) rej(err);
        let empArr = [...results];
        let empChoices = empArr.map(data => `${data.first_name} ${data.last_name}`);
        res(empChoices);
      })
    })
  }

  roleList() {
    return new Promise((res, rej) => {
      pool.query('SELECT * FROM roles', (err, results, _fields) => {
        if (err) rej(err);
        let roleArr = [...results];
        let roleChoices = roleArr.map(data => `${data.title}`);
        res(roleChoices);
      })
    })
  }

  managerList() {
    let set = null;
    return new Promise((res, rej) => {
      pool.query('SELECT * FROM employee WHERE manager_id is ?', [set], (err, results, _fields) => {
        if (err) rej(err);
        let managerArr = [...results];
        let managerChoices = managerArr.map(data => `${data.first_name} ${data.last_name}`);
        managerChoices.push('None');
        res(managerChoices);
      })
    })
  }

  departmentList() {
    return new Promise((res, rej) => {
      pool.query('SELECT * FROM department', (err, results, _fields) => {
        if (err) rej(err);
        let deptArr = [...results];
        let deptChoices = deptArr.map(data => `${data.name}`);
        res(deptChoices);
      })
    })
  }
}

module.exports = db;