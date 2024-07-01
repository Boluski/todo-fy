/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

// TODO in the next version of the database:
// Change Theme to Themes

const express = require("express");
const mysql = require("mysql2/promise");
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
  // waitForConnections: true,
  // connectionLimit: 10,
  // maxIdle: 10,
  // idleTimeout: 60000,
  // queueLimit: 0,
  // enableKeepAlive: true,
  // keepAliveInitialDelay: 0,
};

function generateID() {
  const min = 1;
  const max = 2147483647;
  return Math.floor(Math.random() * (max - min) + min);
}

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// const connection = await mysql.createConnection(mysqlConfig);
/**********************
 * Example get method *
 **********************/

app.get("/TODO-fy/users", async function (req, res) {
  const connection = await mysql.createConnection(mysqlConfig);
  try {
    const [result, fields] = await connection.execute("SELECT * from Users");
    res.json({ result: result, fields: fields });
  } catch (error) {
    res.json({ error: error });
  }
});

app.get("/TODO-fy/getProject", async function (req, res) {
  const connection = await mysql.createConnection(mysqlConfig);
  try {
    const [result, fields] = await connection.execute(
      `SELECT Projects.PID, Projects.title, Theme.main, Theme.secondary, Projects.owner
      FROM todo_fy.Projects
      Inner join Theme on Projects.theme = Theme.TID
      where PID =?`,
      [Number(req.query.PID)]
    );
    res.json({
      isError: false,
      errorMes: "",
      result: result,
      fields: fields,
    });
  } catch (error) {
    res.json({ isError: true, errorMes: error.message });
  }
});

app.get("/TODO-fy/getProjectResource", async function (req, res) {
  const connection = await mysql.createConnection(mysqlConfig);
  let boardSchema = [];
  let boardCards = [];

  try {
    const [result, fields] = await connection.execute(
      "select * from todo_fy.Cards where PID = ? order by position",
      [Number(req.query.PID)]
    );
    boardCards = result;
  } catch (error) {
    res.json({ isError: true, errorMes: error.message });
  }

  try {
    const [result, fields] = await connection.execute(
      "select * from todo_fy.Lists where PID = ? order by position",
      [Number(req.query.PID)]
    );

    for (let i = 0; i < result.length; i++) {
      let listCards = boardCards.filter((Card) => Card.LID == result[i].LID);

      let currentList = {};

      if (listCards.length == 0) {
        currentList = {
          // boardCards: boardCards,

          listID: `L${result[i].LID}`,
          listTitle: result[i].listName,
          isEmpty: true,
          cards: [
            {
              cardID: `C${generateID()}`,
              cardTitle: "",
              cardDescription: "",
              cardLabel: "#ffffff",
              cardSubtasks: [],
              alpha: 0,
            },
          ],
        };
      } else {
        currentList = {
          // boardCards: boardCards,
          listID: `L${result[i].LID}`,
          listTitle: result[i].listName,
          isEmpty: false,

          cards: listCards.map((card) => {
            return {
              listCards: listCards.length,
              cardID: `C${card.CID}`,
              cardTitle: card.cardName,
              cardDescription: card.description,
              cardLabel: "#ffffff",
              cardSubtasks: [],
              alpha: 1,
            };
          }),
        };
      }

      boardSchema.push(currentList);
    }

    res.json({
      isError: false,
      errorMes: "",
      result: boardSchema,
      fields: fields,
    });
  } catch (error) {
    res.json({ isError: true, errorMes: error.message });
  }
});

app.post("/TODO-fy/addUser", async function (req, res) {
  const connection = await mysql.createConnection(mysqlConfig);
  try {
    const [result, fields] = await connection.execute(
      "INSERT INTO Users (username, email, displayName) VALUES(?, ?, ?)",
      [req.body.username, req.body.email, req.body.displayName]
    );
    res.json({ result: result, fields: fields });
  } catch (error) {
    res.json({ isError: true, errorMes: error.message });
  }
});

app.post("/TODO-fy/addProject", async function (req, res) {
  const connection = await mysql.createConnection(mysqlConfig);
  try {
    const [result, fields] = await connection.execute(
      "INSERT INTO Projects (title, theme, owner) VALUES(?, ?, ?)",
      [req.body.title, req.body.theme, req.body.owner]
    );
    res.json({ result: result, fields: fields });
  } catch (error) {
    res.json({ isError: true, errorMes: error.message });
  }
});

app.post("/TODO-fy/updateProject", async function (req, res) {
  const connection = await mysql.createConnection(mysqlConfig);
  let created = 0;
  let updated = 0;
  let deleted = 0;

  const projectID = req.body.projectID;
  const board = req.body.board;
  const changeLog = req.body.changeLog;

  console.log("Project ID", projectID);
  console.log("board", board);
  console.log("change Log", changeLog);

  for (let i = 0; i < board.length; i++) {
    const currentList = board[i];
    console.log("Current List:", currentList);

    const listID = currentList.listID.replace("L", "");
    console.log("list ID", listID);
    const position = i + 1;

    let search = changeLog.lists.created.filter((list) => list == listID);
    console.log("Search", search);

    // return res.json({ search: search });
    if (search.length == 1) {
      console.log("Inserted");

      try {
        const [result, fields] = await connection.execute(
          "insert into todo_fy.Lists(LID, listName, position, PID) values(?, ?, ?, ?)",
          [Number(listID), currentList.listTitle, position, Number(projectID)]
        );
        created++;

        if (!currentList.isEmpty) {
          for (let j = 0; j < currentList.cards.length; j++) {
            const currentCard = currentList.cards[j];
            console.log(currentCard);
            const cardPosition = j + 1;
            const cardID = currentCard.cardID.replace("C", "");
            let cardSearch = changeLog.cards.created.filter(
              (card) => card == cardID
            );
            console.log("card Search:", cardSearch);
            if (cardSearch.length == 1) {
              console.log("Create card");

              try {
                const [result, fields] = await connection.execute(
                  `
                  insert into todo_fy.Cards(CID, cardName, description, position, LID, PID)
                  values(?, ?, ?, ?, ?, ?)`,
                  [
                    Number(cardID),
                    currentCard.cardTitle,
                    currentCard.cardDescription,
                    cardPosition,
                    listID,
                    projectID,
                  ]
                );
                created++;
              } catch (error) {
                console.log("Error:", error);
                res.json({ isError: true, errorMes: error.message });
              }
            } else {
              let cardSearch = changeLog.cards.deleted.filter(
                (card) => card == cardID
              );

              if (cardSearch.length == 1) {
                // Delete card
              } else {
                console.log("Update card");

                try {
                  const [result, fields] = await connection.execute(
                    `
                      update todo_fy.Cards
                      set Cards.cardName = ?, Cards.description= ?, Cards.position = ?, Cards.LID = ?, Cards.PID= ?
                      where Cards.CID = ?`,
                    [
                      currentCard.cardTitle,
                      currentCard.cardDescription,
                      cardPosition,
                      listID,
                      projectID,
                      cardID,
                    ]
                  );
                  updated++;
                } catch (error) {
                  console.log("Error:", error);
                  res.json({ isError: true, errorMes: error.message });
                }
              }
            }
          }
        }
      } catch (error) {
        console.log("Error:", error);
        res.json({ isError: true, errorMes: error.message });
      }
    } else {
      search = changeLog.lists.deleted.filter((list) => list == listID);

      if (search.length == 1) {
        // Add Delete Statement
        console.log("Deleted");
      } else {
        console.log("Updated");

        try {
          const [result, fields] = await connection.execute(
            `update todo_fy.Lists 
          set Lists.listName = ?, Lists.position = ?
          where Lists.LID = ?`,
            [currentList.listTitle, position, Number(listID)]
          );

          updated++;

          if (!currentList.isEmpty) {
            for (let j = 0; j < currentList.cards.length; j++) {
              const currentCard = currentList.cards[j];
              console.log(currentCard);
              const cardPosition = j + 1;
              const cardID = currentCard.cardID.replace("C", "");
              let cardSearch = changeLog.cards.created.filter(
                (card) => card == cardID
              );
              console.log("card Search:", cardSearch);
              if (cardSearch.length == 1) {
                console.log("Create card");

                try {
                  const [result, fields] = await connection.execute(
                    `
                    insert into todo_fy.Cards(CID, cardName, description, position, LID, PID)
                    values(?, ?, ?, ?, ?, ?)`,
                    [
                      Number(cardID),
                      currentCard.cardTitle,
                      currentCard.cardDescription,
                      cardPosition,
                      listID,
                      projectID,
                    ]
                  );
                  created++;
                } catch (error) {
                  console.log("Error:", error);
                  res.json({ isError: true, errorMes: error.message });
                }
              } else {
                let cardSearch = changeLog.cards.deleted.filter(
                  (card) => card == cardID
                );

                if (cardSearch.length == 1) {
                  // Delete card
                } else {
                  console.log("Update card");

                  try {
                    const [result, fields] = await connection.execute(
                      `
                        update todo_fy.Cards
                        set Cards.cardName = ?, Cards.description= ?, Cards.position = ?, Cards.LID = ?, Cards.PID= ?
                        where Cards.CID = ?`,
                      [
                        currentCard.cardTitle,
                        currentCard.cardDescription,
                        cardPosition,
                        listID,
                        projectID,
                        cardID,
                      ]
                    );
                    updated++;
                  } catch (error) {
                    console.log("Error:", error);
                    res.json({ isError: true, errorMes: error.message });
                  }
                }
              }
            }
          }
        } catch (error) {
          console.log("Error:", error);
          res.json({ isError: true, errorMes: error.message });
        }
      }
    }
  }

  res.json({ created: created, updated: updated, deleted: deleted });
});

//-------------------------------------------

// /aws/lambda/todofyLambda-dev

// aws lambda invoke --function-name my-lambda-function --cli-binary-format raw-in-base64-out --payload '{"foo":"bar"}' output.json --log-type Tail --query 'LogResult' --output text | base64 -d

// aws logs get-log-events --log-group-name /aws/lambda/todofyLambda-dev --log-stream-name 2024/06/29/[\$LATEST]2cc22da771a1436dbfcf452a03b301e9

// aws logs get-log-events --log-group-name '/aws/lambda/todofyLambda-dev' --log-stream-name '2024/06/29/[$LATEST]2cc22da771a1436dbfcf452a03b301e9'

// awslogs get /aws/lambda/todofyLambda-dev

// aws logs describe-log-groups --query logGroups[*].logGroupName
// [
//     "/aws/lambda/MyFunction"
// ]

// app.get("/users/*", function (req, res) {
//   // Add your code here
//   res.json({
//     success: "get call succeed!",
//     url: req.url,
//   });
// });

// {
//   "httpMethod": "POST",
//   "path": "/TODO-fy/getProjectResource",
//   "queryStringParameters": {
//     "limit": "10"
//   },
//   "headers": {
//     "Content-Type": "application/json"
//   },
//   "body": "{\"msg\":\"Hello from the event.json body\"}"
// }

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
