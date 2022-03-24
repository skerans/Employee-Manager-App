const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');


const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'root',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);



const mainMenu = () => {
  inquirer.prompt({
    name: 'menu',
    message: 'What would you like to do?',
    type: 'list',
    choices: [
      'View all employees',
      'Add Employee',
      'Update Employee Role',
      'View All Roles',
      'Add Role',
      'View All Departments',
      'Add Department',
      'Quit'
    ],
  })
    .then((answer) => {
      switch (answer.menu) {
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Update Employee Role':
          updateEmployee();
          break;
        case 'View All Roles':
          viewRoles();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'View All Departments':
          viewDepartments();
          break;
        case 'Add Department':
          addDepartment();
          break;
        default:
          db.end();
          break;
      }
    })
};


function viewEmployees() {
  const employeeQuery = `SELECT employee.id AS id,
  employee.first_name AS first_name,
  employee.last_name AS lasst_name,
  employee.role_id AS role_id,
  employee.manager_id AS manager_id FROM employee`
  db.query(employeeQuery, (err, result) => {
    console.table(result)
    mainMenu();
  });
};


function addEmployee() {
  db.query(`SELECT * FROM role`, (err, result) => {
    const roles = result.map((roles) => {
      return {
        name: roles.title,
        value: roles.id
      }
    });

    db.query(`SELECT CONCAT (first_name, ' ', last_name) AS 'name',
    id FROM employee WHERE id in (SELECT manager_id FROM employee)`, (err, results) => {
      const managers = results.map((manager) => {
        return {
          name: manager.name,
          value: manager.id
        }
      })
      inquirer.prompt([
        {
          name: 'first',
          type: 'input',
          message: `What is the employee's first name?`
        },
        {
          name: 'last',
          type: 'input',
          message: `What is the employee's last name?`
        },
        {
          name: 'role',
          type: 'list',
          message: `What is the employee's role?`,
          choices: roles
        },
        {
          name: 'manager',
          type: 'list',
          message: `Who is this employee's manager?`,
          choices: managers
        }
      ])
        .then((answers) => {
          const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.first}', '${answers.last}', '${answers.role}', '${answers.manager}')`;
          db.query(sql, (err, result) => {

            mainMenu();
          })
        })
    }
    )
  });
}

function updateEmployee() {
  const updateSql = `SELECT CONCAT (first_name, ' ', last_name) AS 'name',
  id FROM employee`;

  db.query(updateSql, (err, result) => {

    const employees = result.map((employees) => {
      return {
        value: employees.id,
        name: employees.name
      }
    });

    db.query(`SELECT * FROM role`, (err, data) => {
      const roles = data.map((roles) => {
        return {
          name: roles.title,
          value: roles.id
        }
      })
      inquirer.prompt([
        {
          name: 'employee',
          type: 'list',
          message: `Which employee do you want to update?`,
          choices: employees
        },
        {
          name: 'role',
          type: 'list',
          message: `Which role is the new employee being updated to?`,
          choices: roles
        }
      ])
      .then((answer) => {
        db.query(`UPDATE employee SET role_id=${answer.role} WHERE id=${answer.employee}`, (err, result));
        mainMenu();
      })
    });
  });
};

function viewRoles() {
  const roleQuery = `SELECT role.id AS id,
  role.title AS title,
  role.salary AS salary,
  role.department_id AS department_id FROM role`;
  db.query(roleQuery, (err, result) => {
    console.table(result);
    mainMenu();
  })
};

function addRole() {

  db.query('SELECT * FROM department', (err, result) => {
    const allDept = result.map((allDept) => {
      return {
        value: allDept.id,
        name: allDept.name
      }
    })
    inquirer.prompt([
      {
        name: 'roleTitle',
        type: 'input',
        message: `What is the name of the role to add?`,
      },
      {
        name: 'roleSalary',
        type: 'input',
        message: `What is the salary of the role to add?`,
      },
      {
        name: 'roleDepartment',
        type: 'list',
        message: `What department does this role belong to?`,
        choices: allDept
      }
    ])
      .then((data) => {
        const sql = `INSERT INTO role (title, salary, department_id) VALUES ('${data.roleTitle}', '${data.roleSalary}', '${data.roleDepartment}')`;
        db.query(sql, (err) => {
          if (err) throw err;
          mainMenu();
        })
      })
  })

};

function viewDepartments() {
  const departmentQuery = `SELECT * FROM department`;
  db.query(departmentQuery, (err, result) => {
    console.table(result);
    mainMenu();
  });
};

function addDepartment() {
  inquirer.prompt([
    {
      name: 'addDepartment',
      type: 'input',
      message: `What is the name of the department to add?`,
    }
  ])
    .then(result => {
      const sql = `INSERT INTO department (department_name) VALUES ('${result.addDepartment}')`;
      db.query(sql, (err, results) => {
        console.log(`added ${result.addDepartment} to departments`);
        mainMenu();
      })
    });
};

app.listen(PORT, () => {
  console.log(`Server running on port localhost:${PORT}`);
});

mainMenu();

