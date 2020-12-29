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
  ('Jim', 'Bob', 1, 1),
  ('Joe', 'Schmo', 2, 2),
  ('Kels', 'Kills', 3, 3),
  ('Jim', 'Boss', 4, NULL),
  ('Joe', 'Boss', 5, NULL),
  ('Kels', 'Boss', 6, NULL);