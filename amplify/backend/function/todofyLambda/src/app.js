/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

//TODO in the next version of the database:
// Change Theme to Themes

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

const mysqlConfig = {
  host: "todo-fy.cp420gwcchgi.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "todofy1234",
  port: "3306",
  database: "todo_fy",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

const connection = mysql.createPool(mysqlConfig);
/**********************
 * Example get method *
 **********************/

app.get("/TODO-fy/users", function (req, res) {
  connection.execute("SELECT * from Users", function (error, result, fields) {
    if (error) {
      res.json({ error: error });
    } else {
      res.json({ result: result, fields: fields });
    }
  });

  // connection.connect((error) => {
  //   if (error) {
  //     res.json({ errorMes: "connection failed" });
  //   } else {
  //     connection.query("SELECT * from Users", function (error, result, fields) {
  //       if (error) {
  //         res.json({ error: error });
  //       } else {
  //         res.json({ result: result, fields: fields });
  //       }
  //     });
  //   }
  // });
});

app.get("/TODO-fy/getFirstProjectID", function (req, res) {
  connection.execute(
    "SELECT PID from Projects WHERE owner = ? LIMIT 1;",
    [req.body.owner],
    function (error, result, fields) {
      if (error) {
        res.json({ error: error });
      } else {
        res.json({ result: result, fields: fields });
      }
    }
  );

  // connection.connect((error) => {
  //   if (error) {
  //     res.json({ error: error });
  //   } else {
  //     connection.query(
  //       "SELECT PID from Projects WHERE owner = ? LIMIT 1;",
  //       [req.body.owner],
  //       function (error, result, fields) {
  //         if (error) {
  //           res.json({ error: error });
  //         } else {
  //           res.json({ result: result, fields: fields });
  //         }
  //       }
  //     );
  //   }
  // });
});

app.post("/TODO-fy/addUser", function (req, res) {
  connection.execute(
    "INSERT INTO Users (username, email, displayName) VALUES(?, ?, ?)",
    [req.body.username, req.body.email, req.body.displayName],
    function (error, result, fields) {
      if (error) {
        res.json({ error: error });
      } else {
        res.json({ result: result, fields: fields });
      }
    }
  );

  // connection.connect((error) => {
  //   if (error) {
  //     res.json({ error: error });
  //   } else {
  //     connection.query(
  //       "INSERT INTO Users (username, email, displayName) VALUES(?, ?, ?)",
  //       [req.body.username, req.body.email, req.body.displayName],
  //       function (error, result, fields) {
  //         if (error) {
  //           res.json({ error: error });
  //         } else {
  //           res.json({ result: result, fields: fields });
  //         }
  //       }
  //     );
  //   }
  // });
});

app.post("/TODO-fy/addProject", function (req, res) {
  connection.execute(
    "INSERT INTO Projects (title, theme, owner) VALUES(?, ?, ?)",
    [req.body.title, req.body.theme, req.body.owner],
    function (error, result, fields) {
      if (error) {
        res.json({ error: error });
      } else {
        res.json({ result: result, fields: fields });
      }
    }
  );
  // const connection = mysql.createConnection(mysqlConfig);
  // connection.connect((error) => {
  //   if (error) {
  //     res.json({ error: error });
  //   } else {
  //     connection.query(
  //       "INSERT INTO Projects (title, theme, owner) VALUES(?, ?, ?)",
  //       [req.body.title, req.body.theme, req.body.owner],
  //       function (error, result, fields) {
  //         if (error) {
  //           res.json({ error: error });
  //         } else {
  //           res.json({ result: result, fields: fields });
  //         }
  //       }
  //     );
  //   }
  // });
});

// app.get("/users/*", function (req, res) {
//   // Add your code here
//   res.json({
//     success: "get call succeed!",
//     url: req.url,
//   });
// });

/****************************
 * Example post method *
 ****************************/

// app.post("/items/*", function (req, res) {
//   // Add your code here
//   res.json({ success: "post call succeed!", url: req.url, body: req.body });
// });

/****************************
 * Example put method *
 ****************************/

// app.put("/items", function (req, res) {
//   // Add your code here
//   res.json({ success: "put call succeed!", url: req.url, body: req.body });
// });

// app.put("/items/*", function (req, res) {
//   // Add your code here
//   res.json({ success: "put call succeed!", url: req.url, body: req.body });
// });

/****************************
 * Example delete method *
 ****************************/

// app.delete("/items", function (req, res) {
//   // Add your code here
//   res.json({ success: "delete call succeed!", url: req.url });
// });

// app.delete("/items/*", function (req, res) {
//   // Add your code here
//   res.json({ success: "delete call succeed!", url: req.url });
// });

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
