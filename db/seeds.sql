INSERT INTO department (department_name)
VALUES("Sales"),
      ("HR"),
      ("Accounting"),
      ("Design"),
      ("R & D");

INSERT INTO role (title, salary, department_id)
VALUES("Sales Manager", 100000, 1),
      ("Junior Salesperson", 70000, 1),
      ("Coordinator", 85000, 2),
      ("Lead Accountant", 120000, 3),
      ("Junior Accountant", 70000, 3),
      ("Senior Graphic Designer", 90000, 4),
      ("Researcher", 140000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Peter", "Parker", 2, 1),
      ("Bruce", "Banner", 7, null),
      ("Diana", "Prince", 1, null),
      ("Billy", "Batson", 2, 2),
      ("Dic", "Grayson", 5, 3),
      ("Bruce", "Wayne", 3, null),
      ("Barbara", "Gordon", 4, 3),
      ("Matt", "Murdock", 6, 2);

