var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "moon",
  password: "1234",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  start();
});

function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "Would you like to manage?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "EXIT"
      ]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.action === "View Products for Sale") {
        viewProducts();
      } else if (answer.action === "View Low Inventory") {
        viewLowInv();
      } else if (answer.action === "Add to Inventory") {
        addInv();
      } else if (answer.action === "Add New Product") {
        addNew();
      } else {
        connection.end();
      }
    });
}
function viewProducts() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    console.log(results);
    start();
  });
}

function viewLowInv() {
  connection.query(
    "SELECT * FROM products WHERE stock_quantity < ?",
    5,
    function(err, results) {
      if (err) throw err;
      console.log(results);
      start();
    }
  );
}
function addInv() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    console.log(results);
    inquirer
      .prompt([
        {
          name: "product_id",
          type: "input",
          message: "Which product do you want to restock?"
        },
        {
          name: "quantity",
          type: "input",
          message: "How many do you want to restock?"
        }
      ])
      .then(function(answer) {
        console.log(answer);
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].id === parseInt(answer.product_id)) {
            chosenItem = results[i];
          }
        }
        var chosenItemStock = chosenItem.stock_quantity;

        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: chosenItemStock + parseInt(answer.quantity)
            },
            {
              id: chosenItem.id
            }
          ],
          function(error) {
            if (error) throw err;
            console.log(chosenItemStock);
            console.log("Successfully Added!");
            start();
          }
        );
      });
  });
}
function addNew() {
  inquirer
    .prompt([
      {
        name: "product",
        type: "input",
        message: "What is the item you would like to submit?"
      },
      {
        name: "department",
        type: "input",
        message: "What department would you like to place your product in?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the price of the item?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many quantity for this item?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.product,
          department_name: answer.department,
          price: answer.price || 0,
          stock_quantity: answer.quantity || 0
        },
        function(err) {
          if (err) throw err;
          console.log("Your product is added successfully!");
          start();
        }
      );
    });
}
