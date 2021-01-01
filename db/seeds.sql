INSERT INTO department (name)
VALUES
  ('clothes'),
  ('perfume'),
  ('jewelry');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('csr', 10300, 3),
  ('manager', 21000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Jim', 'Boss', 2, NULL),
  ('Joe', 'Boss', 2, NULL),
  ('Kels', 'Boss', 2, NULL),
  ('Jim', 'Bob', 1, NULL),
  ('Joe', 'Schmo', 1, NULL),
  ('Kels', 'Kills', 1, NULL);
  