INSERT INTO department (name)
VALUES
  ('clothes'),
  ('perfume'),
  ('jewelry'),
  ('shoes');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('clothes employee', 10300, 1),
  ('perfume employee', 10300, 2),
  ('jewelry employee', 10300, 3),
  ('shoes employee', 10300, 4),
  ('clothes manager', 21000, 1),
  ('perfume manager', 21000, 2),
  ('jewelry manager', 21000, 3),
  ('shoes manager', 21000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Jim', 'Boss', 5, NULL),
  ('Joe', 'Boss', 6, NULL),
  ('Kels', 'Boss', 7, NULL),
  ('Kim', 'Boss', 8, NULL),
  ('Jim', 'Bob', 1, 1),
  ('Joe', 'Schmo', 2, 2),
  ('Kels', 'Kills', 3, 3),
  ('Kim', 'Kard', 4, 4);
  