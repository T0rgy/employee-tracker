INSERT INTO department (department_name)
VALUES 
('Marketing'),
('Accounting'),
('Sales'),
('IT'),
('Operations');

INSERT INTO role (title, salary, department_id)
VALUES
('Marketing Coordindator', 80000, 1), 
('Accountant', 50000, 2), 
('Finanical Analyst', 150000, 2),
('Sales Lead', 70000, 3),
('Full Stack Developer', 100000, 4),
('Software Engineer', 140000, 4),
('Project Manager', 100000, 5),
('Operations Manager', 110000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Jacob', 'Brown', 1, null),
('Lori', 'Evens', 2, 1),
('Micheal', 'Depp', 3, 1),
('Ryne', 'Breek', 4, 2),
('Demmy', 'Billings', 5, 1),
('Andrea', 'Filp', 6, 2),
('Greg', 'Donte', 7, null),
('Anton', 'Burger', 8, 1);