// required packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('../config/connection');
const promptUser = require('../server');



// shows all departments
showDept = () => {
    console.log('Showing all departments...\n');
    const sqlLang = `SELECT department.id AS id, department.department_name AS department FROM department`;

    connection.query(sqlLang, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser.promptUser;
    });
};

// shows all roles
showRoles = () => {
    console.log('Showing all roles...\n');

    const sqlLang = `SELECT role.id, role.title, department.department_name AS department
    FROM role INNER JOIN department ON role.department_id = department.id`;

    connection.query(sqlLang, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser.promptUser;
    });
};

// shows all employees
showEmployees = () => {
    console.log('Showing all employees...\n');
    const sqlLang = `
    SLECT employee.id, 
    employee.first_name, 
    employee.last_name,
    role.title,
    department.department_name AS department,
    role.salarty,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    `;

    connection.query(sqlLang, (err, rows) => {
        if (err) throw err;
        console.table(rows)
        promptUser.promptUser;
    })
}


module.exports = { showDept, showEmployees, showRoles};