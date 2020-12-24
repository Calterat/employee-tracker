CREATE TABLE department (
  id INTEGER(11) PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id INTEGER(11) PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER NOT NULL,
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id INTEGER(11) PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NULL,
  manager_id INTEGER NULL,
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL,
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

INSERT INTO department (name)
VALUES
  ('clothes'),
  ('perfume'),
  ('jewelry');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('csr', 10300, 3),
  ('csr', 10100, 2),
  ('csr', 10000, 1),
  ('manager', 20000, 3),
  ('manager', 22000, 2),
  ('manager', 21000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('')