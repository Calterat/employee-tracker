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
    connection.query(`
      SELECT * FROM department;
      `, (err, results, fields) => res(console.table(results)))
  })
}

const viewRoles = () => {
  return new Promise ((res, rej) => {
    connection.query(`
      SELECT roles.id, roles.title, roles.salary, roles.department_id, department.name AS dept_name
      FROM roles
      JOIN department ON roles.department_id=department.id;
      `, (err, results, fields) => res(console.table(results)))
  })
}

const viewEmployees = () => {
  return new Promise ((res, rej) => {
    connection.query(`
      SELECT employee.id, employee.first_name, employee.last_name,
             employee.manager_id, roles.title
      FROM employee
      JOIN roles ON employee.role_id = roles.id;
      `, (err, results, fields) => res(console.table(results)))
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
    connection.execute(
      `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`,
      [title, salary, department], (err, results, fields) => {
        if (err) console.log(err);
        res(results);
      })
  })
}

const insertEmployee = (firstName, lastName, role, manager) => {
  if (manager === 'No manager to report to.') manager = null;
  return new Promise ((res, rej) => {
    connection.execute(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
      [firstName, lastName, role, manager], (err, results, fields) => {
        if (err) console.log(err);
        res(results);
      })
  })
}

const roleId = (role) => {
  return new Promise((res, rej) => {
    connection.execute(`SELECT id FROM roles WHERE title = ?`, [role], (err, results, fields) => {
      if (err) console.log(err);
      let roleId = results.map(data => data.id);
      let resolve = roleId[0];
      res(resolve);
      })
  })
}

const managerId = (manager) => {
  if (manager === 'No manager to report to.') return null;
  let managerName = manager.split(' ');
  let managerFirstName = managerName[0];
  let managerLastName = managerName[1];
  return new Promise((res, rej) => {
    connection.execute(`SELECT id FROM employee WHERE first_name = ? AND last_name = ?`, [managerFirstName, managerLastName], (err, results, fields) => {
      if (err) console.log(err);
      let managerId = results.map(data => data.id);
      let resolve = managerId[0];
      res(resolve);
      })
  })
}


const departmentId = (dept) => {
  return new Promise((res, rej) => {
    connection.execute(`SELECT id FROM department WHERE name = ?`, [dept], (err, results, fields) => {
      if (err) console.log(err);
      let departmentId = results.map(data => data.id);
      let resolve = departmentId[0];
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

const managerList = () => {
  let set = null;
  return new Promise((res, rej) => {
    connection.query('SELECT * FROM employee WHERE manager_id is ?', [set], (err, results, fields) => {
      let managerArr = [...results];
      let managerChoices = managerArr.map(data => `${data.first_name} ${data.last_name}`);
      managerChoices.push('No manager to report to.');
      res(managerChoices);
    })
  })
}


const departmentList = () => {
  return new Promise((res, rej) => {
    connection.query('SELECT * FROM department', (err, results, fields) => {
      let deptArr = [...results];
      let deptChoices = deptArr.map(data => `${data.name}`);
      res(deptChoices);
    })
  })
}

module.exports = { 
  viewDepartments, viewRoles, viewEmployees,
  insertDepartment, insertRole, insertEmployee,
  dbUpdateEmp, departmentId, roleId, managerId,
  employeeList, roleList, departmentList, managerList
 }