// required packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const path = require('path');

// .env file to hide password
require('dotenv').config()

// connects to database
const connection = require('./config/connection');

// function imports
const { addDept, addRole, addEmployee, updateEmployee, updateManager} = require('./lib/addUpdate');
const { deleteDept, deleteRole, deleteEmployee } = require('./lib/delete');
const { showDept, showEmployees, showRoles } = require('./lib/showAll');
const { viewBudget, employeeDept} = require('./lib/view');



// inquirer prompt starts here
const promptUser = () => {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'choices',
            message: 'How would you like to proceed?',
            choices: [
                'View departments', 
                'View roles', 
                'View employees', 
                'Add a department', 
                'Add a role', 
                'Add an employee', 
                'Update and employee role', 
                'Update an employees manager', 
                'View employees by department', 
                'View department budgets', 
                'Delete a department', 
                'Delete a role', 
                'Delete an employee',  
                'Exit']
        }
    ])
    .then((answers) => {
        const { choices } = answers;

        if (choices === 'View departments') {
            showDept();
        }
        if (choices === 'View roles') {
            showRoles();
        }
        if (choices === 'View employees') {
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
        if (choices === 'Update and employee role') {
            updateEmployee();
        }
        if (choices === 'Update an employees manager') {
            updateManager();
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

afterConnection = () => {
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    console.log("*________EMPLOYEE MANAGER_________*")
    console.log("*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*")
    promptUser();
};

module.exports = { promptUser };

