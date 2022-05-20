// required packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const promptUser = require('../server');
const connection = require('../config/connection');
const showAll = require('./showAll');


// delete a department
deleteDept = () => {
    const deptTableId = `SELECT * FROM department`;

    connection.promise().query(deptTableId, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

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
}



module.exports = { deleteDept, deleteRole, deleteEmployee };