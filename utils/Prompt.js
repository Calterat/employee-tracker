const inquirer = require('inquirer');
const db = require('./dbClass')

const database = new db;



const initialize = _ => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: ['View all Departments', 'View all Roles', 
      'View all Employees', 'View Employees by Manager',
      'View Employees by Department', 'Add a Department',
      'Add a Role', 'Add an Employee', 'Update an Employee Role',
      `Update an Employee's Manager`, 'Delete a department',
      'Delete a role', 'Delete an employee',
      'View combined salary of department', 'Exit']
    }
  ])
  .then(data => promptChoice(data.choice))
}

const promptChoice = choice => {
  switch (choice) {
    case 'View all Departments':
      console.log('');
      database.viewDepartments()
        .then(initialize);
      break;
    case 'View all Roles':
      console.log('');
      database.viewRoles()
        .then(initialize);
      break;
    case 'View all Employees':
      console.log('');
      database.viewEmployees()
        .then(initialize);
      break;
    case 'View Employees by Manager':
      console.log('');
      viewEmpByManager()
        .then(data => database.empId(data.manager))
        .then(data => database.managersEmployees(data))
        .then(initialize);
      break;
    case 'View Employees by Department':
      console.log('');
      viewEmpByDept()
        .then(data => database.departmentId(data.department))
        .then(data => database.departmentsEmployees(data))
        .then(initialize);
      break;  
    case 'Add a Department':
      addDepartment();
      break;
    case 'Add a Role':
      addRole();
      break;
    case 'Add an Employee':
      addEmployee();
      break;
    case 'Update an Employee Role':
      updateEmployeeRole()
        .then(data => database.updateEmployeeRole(data))
        .then(initialize);
      break;
    case 'Delete a department':
      askDepartment()
        .then(data => database.departmentId(data.department))
        .then(data => database.deleteDept(data))
        .then(initialize);
      break;
    case 'Delete a role':
      askRole()
        .then(data => database.roleId(data.role))
        .then(data => database.deleteRole(data))
        .then(initialize);
      break;  
    case 'Delete an employee':
      askEmployee()
        .then(data => database.empId(data.employee))
        .then(data => database.deleteEmployee(data))
        .then(initialize);
      break;  
    case `Update an Employee's Manager`:
      updateEmployeeManager()
        .then(data => database.updateEmployeeManager(data))
        .then(initialize);
      break;  
    case 'View combined salary of department':
      askDepartment()
        .then(data => database.departmentId(data.department))
        .then(data => database.departmentCosts(data))
        .then(initialize);
      break;  
    case 'Exit':
      console.log('Good Bye!');
      process.exit();
    default: console.log('Error, Please CTRL-C to terminate!');
      break;
  }
}

const askDepartment = async () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'department',
      message: `Which department would you like to delete?`,
      choices: await database.departmentList()
    }
  ])
}

const askRole = async () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'role',
      message: `Which role would you like to delete?`,
      choices: await database.roleList()
    }
  ])
}

const askEmployee = async () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'employee',
      message: `Which employee would you like to delete?`,
      choices: await database.employeeList()
    }
  ])
}


const viewEmpByManager = async () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'manager',
      message: `Which Manager's employees would you like to see?`,
      choices: await database.managerList()
    }
  ])
}

const viewEmpByDept = async () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'department',
      message: `Which department's employees would you like to see?`,
      choices: await database.departmentList()
    }
  ])
}


const updateEmployeeRole = async () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'employee',
      message: `Which employee's role needs to change?`,
      choices: await database.employeeList()
    },
    {
      type: 'list',
      name: 'role',
      message: 'Which role is employee moving to?',
      choices: await database.roleList()
    }
  ])
}

const updateEmployeeManager = async () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'employee',
      message: `Which employee's manager needs to change?`,
      choices: await database.employeeList()
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Which manager will this employee report to?',
      choices: await database.managerList()
    }
  ])
}


const addDepartment = _ => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'department',
      message: 'What is the name of the department?'
    }
  ])
  .then(data => database.insertDepartment(data.department))
  .then(initialize);
}

const addRole = async () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of the role?'
    },
    {
      type: 'number',
      name: 'salary',
      message: 'What is the salary of this role?'
    },
    {
      type: 'list',
      name: 'department',
      message: 'What department is this role in?',
      choices: await database.departmentList()
    }
  ])
  .then(async data => database.insertRole(data.title, data.salary, await database.departmentId(data.department)))
  .then(initialize);
}

const addEmployee = async () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'What is the first name of the employee?'
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'What is the last name of the employee?'
    },
    {
      type: 'list',
      name: 'role',
      message: 'What role will this employee have?',
      choices: await database.roleList()
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Who will be the manager?',
      choices: await database.managerList()
    }
  ])
  .then(async data => database.insertEmployee(data.first_name, data.last_name, await database.roleId(data.role), await database.empId(data.manager)))
  .then(initialize);
}

module.exports = { initialize };