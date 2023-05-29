/*let button = document.getElementById("continue");
button.addEventListener("click",buttonPress);
//id needs to be changed later***  */

let button = document.getElementById("addNewButton");
button.addEventListener("click",addNewButtonPress);

let playgameButtom = document.getElementById("play_game");
playgameButtom.style.backgroundColor = "rgba(238,29,82,0.5)"


function addNewButtonPress() { 
  window.location = "tiktokpets.html";
}

let delete1 = document.getElementById("x1");
let delete2 = document.getElementById("x2");
let delete3 = document.getElementById("x3");
let delete4 = document.getElementById("x4");
let delete5 = document.getElementById("x5");
let delete6 = document.getElementById("x6");
let delete7 = document.getElementById("x7");
let delete8 = document.getElementById("x8");
let deleteList = [delete1,delete2,delete3,delete4,delete5,delete6,delete7,delete8]

let border1 = document.getElementById("DB1");
let border2 = document.getElementById("DB2");
let border3 = document.getElementById("DB3");
let border4 = document.getElementById("DB4");
let border5 = document.getElementById("DB5");
let border6 = document.getElementById("DB6");
let border7 = document.getElementById("DB7");
let border8 = document.getElementById("DB8");




for (i=0; i<8; i++) {
  addAction(i); }

function addAction(c) {
  deleteList[c].addEventListener("click",function() {deleteButtonPress(c + 1); });
}

/*
Step:9
Next, you should be able to figure out how to add the "My Videos" page. It should show the content manager the list of videos in the database. The browser will need to add a new GET request, say with url "/getList", to get the server to send that list, in JSON, to the browser.
*/

async function sendGetRequest(url) {
  params = {
    method: 'GET', 
    headers: {'Content-Type': 'application/json'}};
  
  console.log("about to send GET request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    console.log("Getthing back the list of videos in the database.");
    let data = await response.text();  //data is JSON
    let dataObj = JSON.parse(data);    
    return dataObj;
  } else {
    throw Error(response.status);
  }
}


sendGetRequest("/getList")
  .then( function (response) {
    let videoObj = response;   //videoObj looks like [{x},{y},{z}....] in the console
    videoObj.reverse();    //need to reverse because the most recent is the last object in the list
    let numOfVideos = videoObj.length;
    if (numOfVideos == 8){
      playgameButtom.style.backgroundColor = "rgba(238,29,82,0.9)"
      button.style.backgroundColor = "rgba(238,29,82,0.5)"
      button.disabled = true;
    }

    for (i = 1; i <= numOfVideos; i++) {
      let idIterator = "DB" + i;
      console.log(idIterator);
      const originalContent = document.getElementById(idIterator)
      // console.log(videoObj[i-1].nickname);
      // let msg = originalContent.textContent;
      // console.log(msg);
      // msg = msg.replace("----",videoObj[i-1].nickname);
      originalContent.textContent = videoObj[i-1].nickname;
    }

    if (border1.textContent == "")
      border1.style.border = "dashed 	rgb(169,169,169) 2.35px"
    if (border2.textContent == "")
      border2.style.border = "dashed 	rgb(169,169,169) 2.35px"
    if (border3.textContent == "")
      border3.style.border = "dashed 	rgb(169,169,169) 2.35px"
    if (border4.textContent == "")
      border4.style.border = "dashed 	rgb(169,169,169) 2.35px"
    if (border5.textContent == "")
      border5.style.border = "dashed 	rgb(169,169,169) 2.35px"
    if (border6.textContent == "")
      border6.style.border = "dashed 	rgb(169,169,169) 2.35px"
    if (border7.textContent == "")
      border7.style.border = "dashed 	rgb(169,169,169) 2.35px"
    if (border8.textContent == "")
      border8.style.border = "dashed 	rgb(169,169,169) 2.35px"
    console.log(videoObj);
  })
  .catch( function(err) {
    console.log("Error",err);
  });





/*STEP 10:
Finally, when the user clicks on an "x", you will need to delete the corresponding video from the database. The browser should send a POST request to the server, asking for the video to be deleted.*/

async function sendDeleteRequest(url,data) {
  params = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: data };
  console.log("about to send post request to delete");
  
  let response = await fetch(url,params);
  if (response.ok) {
    console.log("come back delete is good");
    let data = await response.text();
    return data;
  } else {
    console.log("come back delete is error");
    throw Error(response.status);
  }
}


function deleteButtonPress(num) {
  sendGetRequest("/getList")
  .then( function (response) {
    let videoObj = response; 
    videoObj.reverse();    
    let nicknameToDelete = videoObj[num - 1].nickname;
    console.log("thing to delete is",nicknameToDelete)
    let dataJSON = JSON.stringify({"deleteName":nicknameToDelete});
          sendDeleteRequest("/getName", dataJSON)
          .then( function (res) {
            console.log("button",num,"status",res.status); 
            window.location.reload();
          } )
            
          .catch( function (err) { 
            console.log(err); } );

  })
  .catch( function(err) {
    console.log("Error",err);
  });
} 



