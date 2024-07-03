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

const cardLabel = [
  "#2f9e44",
  "#1971c2",
  "#e03131",
  "#6741d9",
  "#e8590c",
  "#0C85A3",
  "#09926E",
  "#66a80f",
  "#ffffff",
];

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

app.get("/TODO-fy/getUser", async function (req, res) {
  const connection = await mysql.createConnection(mysqlConfig);
  try {
    const [result, fields] = await connection.execute(
      "SELECT * from todo_fy.Users where username = ?",
      [req.query.username]
    );
    res.json({ result: result });
  } catch (error) {
    res.json({ isError: true, errorMes: error.message });
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

app.get("/TODO-fy/getUserProjects", async function (req, res) {
  const connection = await mysql.createConnection(mysqlConfig);
  try {
    const [result, fields] = await connection.execute(
      `SELECT Projects.PID, Projects.title, Theme.main
      FROM todo_fy.Projects 
      Inner join Theme on Projects.theme = Theme.TID 
      where owner =?`,
      [req.query.username]
    );
    res.json({
      isError: false,
      errorMes: "",
      result: result,
    });
  } catch (error) {
    res.json({ isError: true, errorMes: error.message });
  }
});

app.get("/TODO-fy/getProjectResource", async function (req, res) {
  const connection = await mysql.createConnection(mysqlConfig);
  let boardSchema = [];
  let boardCards = [];
  let boardSubtasks = [];

  try {
    const [result, fields] = await connection.execute(
      "select * from todo_fy.Subtasks_2 where PID = ?",
      [Number(req.query.PID)]
    );
    boardSubtasks = result;
    console.log("board Subtask:", boardSubtasks);
  } catch (error) {
    res.json({ isError: true, errorMes: error.message });
  }

  try {
    const [result, fields] = await connection.execute(
      "select * from todo_fy.Cards_2 where PID = ? order by position",
      [Number(req.query.PID)]
    );

    let currentCard = {};

    for (let i = 0; i < result.length; i++) {
      const cardSubtasks = boardSubtasks.filter(
        (Subtask) => Subtask.CID == result[i].CID
      );

      currentCard = {
        LID: result[i].LID,
        cardID: `C${result[i].CID}`,
        cardTitle: result[i].cardName,
        cardDescription: result[i].description,
        cardLabel: cardLabel[Number(result[i].label) - 1],
        cardSubtasks: cardSubtasks.map((subtask) => {
          return {
            subtaskID: `S${subtask.STID}`,
            title: subtask.subtaskName,
            checked: subtask.completed,
          };
        }),
        alpha: 1,
      };
      boardCards.push(currentCard);
    }
    console.log("board Cards:", boardCards);
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
      console.log("list cards:", listCards);
      let currentList = {};

      if (listCards.length == 0) {
        currentList = {
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
          listID: `L${result[i].LID}`,
          listTitle: result[i].listName,
          isEmpty: false,
          cards: listCards,
        };
      }

      boardSchema.push(currentList);
    }

    console.log("Board:", boardSchema);
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
                  insert into todo_fy.Cards_2(CID, cardName, description, position, label, LID, PID)
                  values(?, ?, ?, ?, ?, ?, ?)`,
                  [
                    Number(cardID),
                    currentCard.cardTitle,
                    currentCard.cardDescription,
                    cardPosition,
                    Number(cardLabel.indexOf(currentCard.cardLabel) + 1),
                    listID,
                    projectID,
                  ]
                );
                created++;
                if (currentCard.cardSubtasks.length != 0) {
                  for (let f = 0; f < currentCard.cardSubtasks.length; f++) {
                    const currentSubtask = currentCard.cardSubtasks[f];
                    console.log(currentSubtask);

                    const subtaskID = currentSubtask.subtaskID.replace("S", "");
                    let subtaskSearch = changeLog.subtasks.created.filter(
                      (subtask) => subtask == subtaskID
                    );
                    console.log("subtask Search:", cardSearch);

                    if (subtaskSearch.length == 1) {
                      console.log("Create Subtasks");
                      try {
                        const [result, fields] = await connection.execute(
                          `
                          insert into todo_fy.Subtasks_2(STID, subtaskName, completed, CID, PID)
                          values (?, ?, ?, ?, ?)`,
                          [
                            Number(subtaskID),
                            currentSubtask.title,
                            currentSubtask.checked,
                            cardID,
                            projectID,
                          ]
                        );
                        created++;
                      } catch (error) {
                        res.json({ isError: true, errorMes: error.message });
                      }
                    } else {
                      let subtaskSearch = changeLog.subtasks.deleted.filter(
                        (subtask) => subtask == subtaskID
                      );

                      if (subtaskSearch.length == 1) {
                        // handle delete
                      } else {
                        try {
                          const [result, fields] = await connection.execute(
                            `
                            update todo_fy.Subtasks_2
                            set Subtasks_2.subtaskName = ?, Subtasks_2.completed = ?
                            where Subtasks_2.STID = ?
                           `,
                            [
                              currentSubtask.title,
                              currentSubtask.checked,
                              Number(subtaskID),
                            ]
                          );
                          updated++;
                        } catch (error) {
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
                      update todo_fy.Cards_2
                      set Cards_2.cardName = ?, Cards_2.description= ?, Cards_2.position = ?,  Cards_2.label = ?, Cards_2.LID = ?, Cards_2.PID= ?
                      where Cards_2.CID = ?`,
                    [
                      currentCard.cardTitle,
                      currentCard.cardDescription,
                      cardPosition,
                      Number(cardLabel.indexOf(currentCard.cardLabel) + 1),
                      listID,
                      projectID,
                      cardID,
                    ]
                  );
                  updated++;
                  if (currentCard.cardSubtasks.length != 0) {
                    for (let f = 0; f < currentCard.cardSubtasks.length; f++) {
                      const currentSubtask = currentCard.cardSubtasks[f];
                      console.log(currentSubtask);

                      const subtaskID = currentSubtask.subtaskID.replace(
                        "S",
                        ""
                      );
                      let subtaskSearch = changeLog.subtasks.created.filter(
                        (subtask) => subtask == subtaskID
                      );
                      console.log("subtask Search:", cardSearch);

                      if (subtaskSearch.length == 1) {
                        console.log("Create Subtasks");
                        try {
                          const [result, fields] = await connection.execute(
                            `
                            insert into todo_fy.Subtasks_2(STID, subtaskName, completed, CID, PID)
                            values (?, ?, ?, ?, ?)`,
                            [
                              Number(subtaskID),
                              currentSubtask.title,
                              currentSubtask.checked,
                              cardID,
                              projectID,
                            ]
                          );
                          created++;
                        } catch (error) {
                          res.json({ isError: true, errorMes: error.message });
                        }
                      } else {
                        let subtaskSearch = changeLog.subtasks.deleted.filter(
                          (subtask) => subtask == subtaskID
                        );

                        if (subtaskSearch.length == 1) {
                          // handle delete
                        } else {
                          try {
                            const [result, fields] = await connection.execute(
                              `
                              update todo_fy.Subtasks_2
                              set Subtasks_2.subtaskName = ?, Subtasks_2.completed = ?
                              where Subtasks_2.STID = ?
                             `,
                              [
                                currentSubtask.title,
                                currentSubtask.checked,
                                Number(subtaskID),
                              ]
                            );
                            updated++;
                          } catch (error) {
                            res.json({
                              isError: true,
                              errorMes: error.message,
                            });
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
                    insert into todo_fy.Cards_2(CID, cardName, description, position, label, LID, PID)
                    values(?, ?, ?, ?, ?, ?, ?)`,
                    [
                      Number(cardID),
                      currentCard.cardTitle,
                      currentCard.cardDescription,
                      cardPosition,
                      Number(cardLabel.indexOf(currentCard.cardLabel) + 1),
                      listID,
                      projectID,
                    ]
                  );
                  created++;
                  if (currentCard.cardSubtasks.length != 0) {
                    for (let f = 0; f < currentCard.cardSubtasks.length; f++) {
                      const currentSubtask = currentCard.cardSubtasks[f];
                      console.log(currentSubtask);

                      const subtaskID = currentSubtask.subtaskID.replace(
                        "S",
                        ""
                      );
                      let subtaskSearch = changeLog.subtasks.created.filter(
                        (subtask) => subtask == subtaskID
                      );
                      console.log("subtask Search:", cardSearch);

                      if (subtaskSearch.length == 1) {
                        console.log("Create Subtasks");
                        try {
                          const [result, fields] = await connection.execute(
                            `
                            insert into todo_fy.Subtasks_2(STID, subtaskName, completed, CID, PID)
                            values (?, ?, ?, ?, ?)`,
                            [
                              Number(subtaskID),
                              currentSubtask.title,
                              currentSubtask.checked,
                              cardID,
                              projectID,
                            ]
                          );
                          created++;
                        } catch (error) {
                          res.json({ isError: true, errorMes: error.message });
                        }
                      } else {
                        let subtaskSearch = changeLog.subtasks.deleted.filter(
                          (subtask) => subtask == subtaskID
                        );

                        if (subtaskSearch.length == 1) {
                          // handle delete
                        } else {
                          try {
                            const [result, fields] = await connection.execute(
                              `
                              update todo_fy.Subtasks_2
                              set Subtasks_2.subtaskName = ?, Subtasks_2.completed = ?
                              where Subtasks_2.STID = ?
                             `,
                              [
                                currentSubtask.title,
                                currentSubtask.checked,
                                Number(subtaskID),
                              ]
                            );
                            updated++;
                          } catch (error) {
                            res.json({
                              isError: true,
                              errorMes: error.message,
                            });
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
                        update todo_fy.Cards_2
                        set Cards_2.cardName = ?, Cards_2.description= ?, Cards_2.position = ?,  Cards_2.label = ?, Cards_2.LID = ?, Cards_2.PID= ?
                        where Cards_2.CID = ?`,
                      [
                        currentCard.cardTitle,
                        currentCard.cardDescription,
                        cardPosition,
                        Number(cardLabel.indexOf(currentCard.cardLabel) + 1),
                        listID,
                        projectID,
                        cardID,
                      ]
                    );
                    updated++;
                    if (currentCard.cardSubtasks.length != 0) {
                      for (
                        let f = 0;
                        f < currentCard.cardSubtasks.length;
                        f++
                      ) {
                        const currentSubtask = currentCard.cardSubtasks[f];
                        console.log(currentSubtask);

                        const subtaskID = currentSubtask.subtaskID.replace(
                          "S",
                          ""
                        );
                        let subtaskSearch = changeLog.subtasks.created.filter(
                          (subtask) => subtask == subtaskID
                        );
                        console.log("subtask Search:", cardSearch);

                        if (subtaskSearch.length == 1) {
                          console.log("Create Subtasks");
                          try {
                            const [result, fields] = await connection.execute(
                              `
                              insert into todo_fy.Subtasks_2(STID, subtaskName, completed, CID, PID)
                              values (?, ?, ?, ?, ?)`,
                              [
                                Number(subtaskID),
                                currentSubtask.title,
                                currentSubtask.checked,
                                cardID,
                                projectID,
                              ]
                            );
                            created++;
                          } catch (error) {
                            res.json({
                              isError: true,
                              errorMes: error.message,
                            });
                          }
                        } else {
                          let subtaskSearch = changeLog.subtasks.deleted.filter(
                            (subtask) => subtask == subtaskID
                          );

                          if (subtaskSearch.length == 1) {
                            // handle delete
                          } else {
                            try {
                              const [result, fields] = await connection.execute(
                                `
                                update todo_fy.Subtasks_2
                                set Subtasks_2.subtaskName = ?, Subtasks_2.completed = ?
                                where Subtasks_2.STID = ?
                               `,
                                [
                                  currentSubtask.title,
                                  currentSubtask.checked,
                                  Number(subtaskID),
                                ]
                              );
                              updated++;
                            } catch (error) {
                              res.json({
                                isError: true,
                                errorMes: error.message,
                              });
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
