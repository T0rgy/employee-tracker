// required packages/files
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const showAll = require('./showAll');
const promptUser = require('../server');

// add a department
addDept = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDepartment',
            message: "What department would you like to add?",
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Please enter a department');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const sqlLang = `INSERT INTO department (department_name) VALUES (?)`;
        connection.promise().query(sqlLang, answer.addDepartment, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.addDepartment + ' to departments!');

            showAll.showDept();
        });
    });

};

addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: "What role would you like to add?",
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter a role');
                    return false;
                }
            }
        },
        {
            type: 'input',
            department_name: 'salary',
            message: "what is the salary of this role?",
            validate: salary => {
                if (isNaN(salary)) {
                    return true;
                } else {
                    console.log('Please enter a salary for this role');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const params = [answer.role, answer.salary];

        const roleDeptId = `SELECT department_name, id FROM department`;

        connection.query(roleDeptId, (err, data) => {
            if (err) throw err;

            const dept = data.map(({ department_name, id }) => ({ name: department_name, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'dept',
                    message: "What department is this role in?",
                    choices: dept
                }
            ])
            .then(departmentChoice => {
                const dept = departmentChoice.dept;
                params.push(dept);

                const sqlLang = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

                connection.query(sqlLang, params, (err, result) => {
                    if (err) throw err;
                    console.log('Added' + answer.role + ' to roles!');

                    showAll.showRoles();
                });
            });
        });
    });
};

addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input', 
            name: 'first_name',
            message: "What is the employee's first name?",
        },
        {
            type: 'input',
            name: 'last_name',
            message: "What is the employee's last name?",
        }
    ])
    .then(answer => {
        const params = [answer.first_name, answer.last_name];

        const roleDeptId = `SELECT role.id, role.title FROM role`;

        connection.query(roleDeptId, (err, data) => {
            if (err) throw err;

            const roles = data.map(({ id, title }) => ({ name: title, value: id }));

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: roles
                }
            ])
            .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);

                const managerIdTable = `SELECT * FROM employee`;

                connection.query(managerIdTable, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

                    inquirer.prompt([
                        {
                            type: 'list', 
                            name: 'manager',
                            message: "Who is the employee's manager?",
                            choices: managers
                        }
                    ])
                    .then(managerChoice => {
                        const manager = managerChoice.manager;
                        params.push(manager);

                        const sqlLang = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;

                        connection.query(sqlLang, params, (err, result) => {
                            if (err) throw err;
                            console.log('Employee has been added.');

                            showAll.showEmployees();
                        });
                    });
                });
            });
        });
    });
};

updateEmployee = () => {

    const employeeIdTable = `SELECT * FROM employee`;

    connection.query(employeeIdTable, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
        .then(employeeChoice => {
            const employee = employeeChoice.name;
            const params = [];
            params.push(employee);

            const managerIdTable = `SELECT * FROM employee`;

            connection.query(managerIdTable, (err, data) => {
                if (err) throw err;
                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
                
                inquirer.prompt([
                {
                    type: 'list',
                    name: 'manager',
                    message: "Who is the employee's manager?",
                    choices: managers
                }
                ])
                    .then(managerChoice => {
                    const manager = managerChoice.manager;
                    params.push(manager);

                    let employee = params[0];
                    params[0] = role;
                    params[1] = employee;

                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                    connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log('Employee has been updated.');

                        showAll.showEmployees();
                    });    
                });
            });
        });
    });
};

updateManager = () => {
    const employeeIdTable = `SELECT * FROM employee`;

    connection.query(employeeIdTable, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
        .then(employeeChoice => {
            const employee = employeeChoice.name;
            const params = [];
            params.push(employee);

            const managerIdTable = `SELECT * FROM employee`;

            connection.query(managerIdTable, (err, data) => {
                if (err) throw err;

                const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who is the employee's manager?",
                        choices: managers
                    }
                ])
                .then(managerChoice => {
                    const manager = managerChoice.manager;
                    params.push(manager);

                    const sqlLang = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;

                    connection.query(sqlLang, params, (err, result) => {
                        if (err) throw err;
                        console.log("Employee has been added.");

                        showAll.showEmployees();
                    })
                })
            })
        })
    })
}

module.exports = { addDept, addRole, addEmployee, updateEmployee, updateManager };