// required packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// .env file to hide password
require('dotenv').config()

// connects to database
const connection = require('./config/connection');

// function imports
const add = require('./lib/addUpdate');
const deletE = require('./lib/delete');
const showAll = require('./lib/showAll');
const view = require('./lib/view');


afterConnection = () => {
    console.log("***********************************")
    console.log("*                                 *")
    console.log("*________EMPLOYEE MANAGER_________*")
    promptUser();
};

// inquirer prompt starts here
const promptUser = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'choices',
            message: 'How would you like to proceed?',
            choices: [' View departments', 'View roles', 'View employees', 'Add a department', 'Add a role', 'Add an employee', 'Update and employee role', 'Update an employees manager', 'View employees by department', 'View department budgets', 'Delete a department', 'Delete a role', 'Delete an employee',  'exit']
        }
    ])
    .then((answers) => {
        const { choices } = answers;

        if (choices === 'View departments') {
            showDepartments();
        }
        if (choices === 'View all roles') {
            showRoles();
        }
        if (choices === 'View all employees') {
            showEmployees();
        }
        if (choices === 'Add a department') {
            addDept();
        }
        if (choices === 'Add a role') {
            addRole();
        }
        if (choices === 'Add an employee') {
            addEmployee();
        }
        if (choices === 'Update and employees manager') {
            addManager();
        }
        if (choices === 'View employees by department') {
            employeeDept();
        }
        if (choices === 'View department budgets') {
            viewBudget();
        }            
        if (choices === 'Delete a department') {
            deleteDept();
        }
        if (choices === 'Delete a role') {
            deleteRole();
        }
        if (choices === 'Delete an employee') {
            deleteEmployee();
        }
        if (choices === 'Exit') {
            connection.end();
        };
    });
};

