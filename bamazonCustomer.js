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
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    console.log(results);
    inquirer
      .prompt([
        {
          name: "product_id",
          type: "input",
          message: "Which product do you want to purchase?"
        },
        {
          name: "quantity",
          type: "input",
          message: "How many do you want to purchase?"
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
        console.log(chosenItemStock);
        if (chosenItemStock > parseInt(answer.quantity)) {
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: chosenItemStock - parseInt(answer.quantity)
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Successfully Purchased!");
              start();
            }
          );
        } else {
          console.log("Not enough stock quantity");
          //   start();
        }
      });
  });
}
