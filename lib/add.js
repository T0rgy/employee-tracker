// required packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const promptUser = require('../server');
const connection = require('../config/connection');
const showDept = require('./showAll');


// add a department
addDept = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: "What department would you like to add?",
            validate: addDepartment => {
                if (addDepartment) {
                    return true;
                } else {
                    console.log('Please enter a department');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const sqlLang = `INSERT INTO department (name) VALUES (?)`;
        connection.query(sqlLang, answer.addDepartment, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.addDepartment + ' to departments!');

            show
        })
    })
}

module.exports = add;