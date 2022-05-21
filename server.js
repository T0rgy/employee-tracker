// required packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// .env file to hide password
require('dotenv').config()

// connects to database
const connection = require('./config/connection');
connection.connect(err => {
    if (err) throw err;
    afterConnection();
})

// function imports
// const { addDept, addRole, addEmployee, updateEmployee, updateManager} = require('./lib/addUpdate');
// const { deleteDept, deleteRole, deleteEmployee } = require('./lib/delete');
// const { showDept, showEmployees, showRoles } = require('./lib/showAll');
// const { viewBudget, employeeDept} = require('./lib/view');

const afterConnection = () => {
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    console.log("*________EMPLOYEE MANAGER_________*")
    console.log("*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*")
    promptUser();
};

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


// shows all departments
const showDept = () => {
    console.log('Showing all departments...\n');
    const sqlLang = `SELECT department.id AS id, department.department_name AS department FROM department`;

    connection.query(sqlLang, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

// shows all roles
const showRoles = () => {
    console.log('Showing all roles...\n');

    const sqlLang = `SELECT role.id, role.title, department.department_name AS department
    FROM role INNER JOIN department ON role.department_id = department.id`;

    connection.query(sqlLang, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

// shows all employees
const showEmployees = () => {
    console.log('Showing all employees...\n');
    const sqlLang = `
    SELECT employee.id, 
    employee.first_name, 
    employee.last_name,
    role.title,
    department.department_name AS department,
    role.salary,
    CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    `;

    connection.query(sqlLang, (err, rows) => {
        if (err) throw err;
        console.table(rows)
        promptUser();
    });
};

const employeeDept = () => {
    console.log('Showing employee by department...\n');
    const sqlLang = `
    SELECT employee.first_name, 
    employee.last_name, 
    department.department_name AS department
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id
    ORDER BY department.department_name
    `;

    connection.query(sqlLang, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

const viewBudget = () => {
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

// add a department
const addDept = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
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
        const sqlLang = `INSERT INTO department (department_name)
        VALUES (?)`;
        connection.query(sqlLang, answer.addDept, (err, result) => {
            if (err) throw err;
            console.log('Added ' + answer.addDept + ' to departments!');

            showDept();
        });
    });

};

const addRole = () => {
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
            type: 'number',
            name: 'salary',
            message: "what is the salary of this role?",
            validate: salary => {
                if (salary) {
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
                    console.log('Added' + answer.role + " to roles!");

                    showRoles();
                });
            });
        });
    });
};

const addEmployee = () => {
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

                            showEmployees();
                        });
                    });
                });
            });
        });
    });
};

const updateEmployee = () => {

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
                    params[0] = manager;
                    params[1] = employee;

                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                    connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log('Employee has been updated.');

                        showEmployees();
                    });    
                });
            });
        });
    });
};

const updateManager = () => {
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
                    params[0] = manager;
                    params[1] = employee;

                    const sqlLang = `UPDATE employee SET manager_id = ? WHERE id = ?`;

                    connection.query(sqlLang, params, (err, result) => {
                        if (err) throw err;
                        console.log("Employee has been updated.");

                        showEmployees();
                    });
                });
            });
        });
    });
};

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

                showDept();
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

                showRoles();
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

                showEmployees();
            } );
        });
    });
};





