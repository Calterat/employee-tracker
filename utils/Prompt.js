const inquirer = require('inquirer');
const { 
  viewDepartments, viewRoles, viewEmployees,
  insertDepartment, insertRole, insertEmployee,
  employeeList, roleList, departmentList, managerList,
  dbUpdateEmp, departmentId, roleId, managerId
  }= require('./DBFunctions');



const initialize = _ => {
  console.log('');
  return inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Exit']
    }
  ])
  .then(data => promptChoice(data.choice))
}

const promptChoice = choice => {
  switch (choice) {
    case 'View all Departments':
      viewDepartments()
        .then(initialize);
      break;
    case 'View all Roles':
      viewRoles()
        .then(initialize);
      break;
    case 'View all Employees':
      viewEmployees()
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
      updateEmployeeRole().then(data => dbUpdateEmp(data)).then(initialize);
      break;
    case 'Exit':
      console.log('Good Bye!');
      process.exit();
    default: console.log('Error, Please CTRL-C to terminate!');
      break;
  }
}

const updateEmployeeRole = async () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'employee',
      message: `Which employee's role needs to change?`,
      choices: await employeeList()
    },
    {
      type: 'list',
      name: 'role',
      message: 'Which role is employee moving to?',
      choices: await roleList()
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
  .then(data => insertDepartment(data.department))
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
      choices: await departmentList()
    }
  ])
  .then(async data => insertRole(data.title, data.salary, await departmentId(data.department)))
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
      choices: await roleList()
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Who will be the manager?',
      choices: await managerList()
    }
  ])
  .then(async data => insertEmployee(data.first_name, data.last_name, await roleId(data.role), await managerId(data.manager)))
  .then(initialize);
}

module.exports = { initialize };