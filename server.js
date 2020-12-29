// CLI prompt for 'view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', and 'update an employee role'

const inquirer = require('inquirer');


console.log('EMPLOYEE MANAGER');

inquirer.prompt([
  {
    type: 'list',
    name: 'choice',
    message: 'What would you like to do?',
    choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role']

  }
])