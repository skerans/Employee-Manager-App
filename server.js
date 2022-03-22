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
      switch (answer) {
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
        name: roles.name,
        value: roles.title
      }
    })

    db.query(`SELECT `)

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
      type: 'input',
      message: `What is the employee's role?`,
      choices: roles
    },
    {
      name: 'first',
      type: 'input',
      message: `Who is the employee's manager?`,
      choices: ''
    }
  ])
}
)};

function updateEmployee(){
  
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
  
};

function viewDepartments() {
  const departmentQuery = `SELECT * FROM departments`;
  db.query(departmentQuery, (err, result) => {
    console.table(result);
    mainMenu();
});
};

function addDepartment() {
  
};

app.listen(PORT, () => {
  console.log(`Server running on port localhost:${PORT}`);
});
