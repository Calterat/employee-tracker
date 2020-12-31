const inquirer = require('inquirer');
const { viewDepartments, viewRoles, viewEmployees, insertDepartment, insertRole, insertEmployee }= require('./Database');

const initialize = _ => {
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
      console.log('updateEmployee');
      initialize();
      break;
    case 'Exit':
      console.log('Good Bye!');
      process.exit();
    default: console.log('Error');
      break;
  }
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

const addRole = _ => {
  return inquirer.prompt([
          {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role?'
          },
          {
            type: 'input',
            name: 'salary',
            message: 'What is the salaray of this role?'
          },
          {
            type: 'list',
            name: 'department_id',
            message: 'What department is this role in?',
            choices: ['Department1', 'Department2', 'Department3']
          }
  ])
  .then(data => insertRole(data.title, data.salary, data.department_id))
  .then(initialize);
}

const addEmployee = _ => {
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
            name: 'role_id',
            message: 'What role will this employee have?',
            choices: ['Role1', 'Role2', 'Role3']
          },
          {
            type: 'list',
            name: 'manager_id',
            message: 'Who will be the manager?',
            choices: ['Manager1', 'Manager2', 'Manager3']
          }
  ])
  .then(data => insertEmployee(data.first_name, data.last_name, data.role_id, data.manager_id))
  .then(initialize);
}

module.exports = { initialize };