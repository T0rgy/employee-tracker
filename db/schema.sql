DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER,
    INDEX dept_index (department_id),
    CONSTRAINT department_fk FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    INDEX role_index (role_id),
    CONSTRAINT role_fk FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    manager_id INTEGER,
    INDEX manager_index (manager_id),
    CONSTRAINT manager_fk FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);