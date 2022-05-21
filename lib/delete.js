// required packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('../config/connection');
const showAll = require('./showAll');


// delete a department
deleteDept = () => {
    const deptTableId = `SELECT * FROM department`;

    connection.query(deptTableId, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ department_name, id }) => ({ name: department_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'dept',
                message: "What department do you want to delete?",
                choices: dept
            }
        ])
        .then((deptChoice => {
            const dept = deptChoice.dept;
            const sqlLang = `DELETE FROM department WHERE id = ?`;

            connection.query(sqlLang, dept, (err, result) => {
                if (err) throw err;
                console.log("Department deleted successfully.");

                showAll.showDept();
            });
        }));
    });
};

deleteRole = () => {
    const roleDeptId = `SELECT * FROM role`;

    connection.query(roleDeptId, (err, data) => {
        if (err) throw err;

        const role = data.map(({ title, id }) => ({ name: title, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: "What role do you want to delete",
                choices: role
            }
        ])
        .then(roleChoice => {
            const role = roleChoice.role;
            const sqlLang = `DELETE FROM role WHERE id = ?`;

            connection.query(sqlLang, role, (err, result) => {
                if (err) throw err;
                console.log("Role deleted successfully.");

                showAll.showRoles();
            });
        });
    });
};

deleteEmployee = () => {
    const employeeIdTable = `SELECT * FROM employee`;

    connection.query(employeeIdTable, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would yo like to delete?",
                choices: employees
            }
        ])
        .then(employeeChoice => {
            const employee = employeeChoice.name;

            const sqlLang = `DELETE FROM employee WHERE id = ?`;

            connection.query(sqlLang, employee, (err, result) => {
                if (err) throw err;
                console.log("Employee deleted successfully.");

                showAll.showEmployees();
            } );
        });
    });
};


module.exports = { deleteDept, deleteRole, deleteEmployee };