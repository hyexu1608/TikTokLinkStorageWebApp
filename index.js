// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");
const fetch = require("cross-fetch");
// get Promise-based interface to sqlite3

const db = require('./sqlWrap');
const win = require("./pickWinner");

// this also sets up the database

// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');

/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  // console.log(n);
  return n;
}

// create object to interface with express
const app = express();


// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

app.use(express.text());
app.use(bodyParser.json());
// make all the files in 'public' available 

app.use(function(req, res, next) {
  console.log("body contains", req.body);
  next();
});

app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/myvideos.html");
});


app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
    // winner should contain the rowId of the winning video.
    let winner = await win.computeWinner(8, false);
    let sql = `select * from VideoTable where rowIdNum = ${winner}`;
    let winnerObj = await db.get(sql);
    console.log("the winner Obj is", winnerObj)
    res.json(winnerObj);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/getTwoVideos", async function(req, res) {
  console.log("getting two random videos from database");
  try {
    const tableContents = await dumpVideoTable();
    let numOfVideos = tableContents.length;
    let randInt1 = getRandomInt(numOfVideos);
    let randInt2 = getRandomInt(numOfVideos);
    while (randInt2 == randInt1) {
      console.log("duplicate");
      randInt2 = getRandomInt(numOfVideos);
    }

    let result = { twoVideos: [tableContents[randInt1], tableContents[randInt2]] };
    res.json(result);

  } catch (err) {
    res.status(500).send(err);
  }
});

async function dumpVideoTable() {
  const sql = "select * from VideoTable"
  let result = await db.all(sql)
  return result;
}

app.post("/insertPref", async function(req, res) {
  try {
    let prefObj = req.body;
    console.log(prefObj);
    let rowID_better = prefObj.better;
    let rowID_worse = prefObj.worse;
    //console.log("the row ID of the better video is", rowID_better);
    //console.log("the row ID of the worse video is", rowID_worse);

    const sql = "insert into PrefTable (better, worse) values (?,?)";
    await db.run(sql, [rowID_better, rowID_worse]);

    //step 7
    const PrefContents = await dumpPrefTable();
    console.log(PrefContents);
    let numOfPicks = PrefContents.length;
    if (numOfPicks < 15) {
      console.log("this is the current num of pref:", numOfPicks);
      res.json("continue");
    }
    else {
      res.json("pick winner");
    }

  } catch (err) {
    res.status(500).send(err);
  }
});

async function dumpPrefTable() {
  const sql = "select * from PrefTable"
  let result = await db.all(sql)
  return result;
}
/*
STEP 5: When the server recieves the "/videodata" POST request containing a new video, we want to add the video to the database (if it will fit). First, check the number of videos in the database. If it is eight or greater, send back a response saying "database full". Otherwise, find the current item in the database with the "True" flag, and change it to "False". Then, insert the new item into the database, with it's flag set to "True" (since now it is most-recently-added).

*/
////////////////////////////////////////////////////////////////////////////////////
/*
async function dumpTable_WillReturnLength() {
  try{
    let cmd = 'select * from VideoTable';
    let result = await db.all(cmd);
    let numOfVideos = Object.keys(result).length;
    return numOfVideos;
  } catch (err) { console.log("SQL error is this length???",err); }
}

async function insertVideo(v) {
  try{
    const sqlCmd = "insert into VideoTable(url,nickname,userid,flag) values (?,?,?,True)";
    await db.run(sqlCmd,[v.url, v.nickname, v.userid]); 
  } catch (err) { console.log("SQL error",err); }
}
*/


async function updateFlag() {
  try {
    const sqlCmd = "UPDATE VideoTable SET flag = 'False' WHERE flag = 'True'";
    await db.run(sqlCmd);
  } catch (err) { console.log("SQL error UF", err); }
}


async function dumpTable() {
  const sql = "select * from VideoTable"
  let result = await db.all(sql)
  return result;
}

async function insertVideo(v) {
  let boolV = 'True';
  const sql = "insert into VideoTable (url,nickname,userid,flag) values (?,?,?,?)";
  await db.run(sql, [v.url, v.nickname, v.userid, boolV]);
}

async function checkAndInsert(v) {
  try {
    const tableContents = await dumpTable();
    console.log("this is dumpTable function done.");
    let numOfVideos = tableContents.length;
    console.log("this is the length", numOfVideos);
    if (numOfVideos >= 8) {
      return false;
    }
    //find the current item in the database with the "True" flag
    //and change it to "False"
    await updateFlag();
    console.log("this is updateFlag function done.");

    await insertVideo(v);
    console.log("this is insertVideo function done.");
    return true;
  } catch (err) { console.log("SQL error CaI", err); }
}


app.post("/videoData", (req, res) => {
  let dataInReq = req.body;
  checkAndInsert(dataInReq)
    .then(function(data) {
      if (data == false) {
        console.log("insert failssssssssssssssss");
        return res.json('database full');
      }
      else {
        console.log("insert workssssssssssssssss");
        return res.json('insert is successful');
      }
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
});




/*
STEP 6: On the server side, add code to handle a new GET request, with url "/getMostRecent". It should select the most-recently-added video from the database, and send it, as JSON, to the browser.

*/
async function getMostRecentVideo() {
  try {
    let sqlCmd = "select url from VideoTable where flag = 'True'";
    let result = await db.get(sqlCmd);
    console.log(result);
    return result;
  } catch (err) { console.log("SQL error MR", err); }
}

app.get("/getMostRecent", (req, res) => {
  getMostRecentVideo()
    .then(function(data) {
      console.log(data);
      return res.json(data);
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
});

//step 9
app.get("/getList", (req, res) => {
  dumpTable()
    .then(function(data) {
      console.log("step 9 server sending back list of videos");
      return res.json(data);
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
});


//step 10
app.post("/getName", (req, res) => {
  console.log("first line in step 10");
  let nameObj = req.body;
  console.log(nameObj);
  let name = nameObj.deleteName;
  console.log("wa", nameObj.deleteName)
  console.log("receive delete request", name);
  deleteInDB(name)
    .then(function(data) {
      console.log("deletee is done, going back to browser");
      return res.json('Delete Done.');
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
});

async function deleteInDB(name) {
  try {
    const tableContents = await dumpTable();
    let numOfVideos = tableContents.length;
    console.log("num of videos is", numOfVideos, ", ready to delete");
    let sqlCmd = `DELETE FROM VideoTable WHERE nickname = "${name}"`; //mayneed '' for num
    await db.run(sqlCmd);
    /*
    let sqlCmd = "select url from VideoTable where flag = 'True'";
    let result = await db.get(sqlCmd);
    console.log("hello workd");
    console.log(result); //undefined
    console.log("what");
    return result;*/
  } catch (err) { console.log("SQL error hahahah", err); }
}


// Need to add response if page not found!
app.use(function(req, res) {
  res.status(404); res.type('txt');
  res.send('404 - File ' + req.url + ' not found');
});

// end of pipeline specification



// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function() {
  console.log("The static server is listening on port " + listener.address().port);
});