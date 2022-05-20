// required packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const promptUser = require('../server');
const connection = require('../config/connection');


// shows all departments
showDept = () => {
    console.log('Showing all departments...\n');
    const sqlLang = `SELECT department.id AS id, department.name AS department FROM department`;

    connection.promise().query(sqlLang, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

// shows all roles
showRoles = () => {
    console.log('Showing all roles...\n');

    const sqlLang = `SELECT role.id, role.title, department.name AS department
    FROM role INNER JOIN department ON role.department_id = department.id`;

    connection.promise().query(sqlLang, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
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
    department.name AS department,
    role.salarty,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    `;

    connection.promise().query(sqlLang, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    })
}


module.exports = { showDept, showEmployees, showRoles};