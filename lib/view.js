// required packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('../config/connection');
const promptUser = require('../server')

employeeDept = () => {
    console.log('Showing employee by department...\n');
    const sqlLang = `
    SELECT EMPLOYEE.first_name,
    employee.last_name,
    department.department_name AS department
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    `;

    connection.promise().query(sqlLang, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

viewBudget = () => {
    console.log('Showing Budget by department...\n');

    const sqlLang = `
    SELECT department_id AS id, 
    department.department_name AS department,
    SUM(salary) AS budget
    FROM role
    JOIN department ON role.department_id = department.id GROUP By department_id
    `;

    connection.query(sqlLang, (err, rows) => {
        if (err) throw err;
        console.table(rows);

        promptUser();
    });
};




module.exports = { employeeDept, viewBudget };