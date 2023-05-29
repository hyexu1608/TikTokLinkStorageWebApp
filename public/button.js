let button = document.getElementById("continue");
button.addEventListener("click",buttonPress);

let button_myvideos = document.getElementById("myvid");
button_myvideos.addEventListener("click",buttonPress_for_myvideo);

// given function that sends a post request
async function sendPostRequest(url,data) {
  params = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: data };
  console.log("about to send post request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    console.log("come back post is good");
    let data = await response.text();
    return data;
  } else {
    console.log("come back post is error");
    throw Error(response.status);
  }
}

async function sendGetListRequest(url) {
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


function buttonPress() { 
    sendGetListRequest("/getList")
    .then( function (response) {
      let videoObj = response;   //videoObj looks like [{x},{y},{z}....] in the console
      let numOfVideos = videoObj.length;
      if (numOfVideos >= 8) {
        alert("The database is full!");
      }
      else {  
        // Get all the user info.
        let username = document.getElementById("user").value;
        let URL = document.getElementById("URL").value;
        let nickname = document.getElementById("nickname").value;
      
        //let data = username+","+URL+","+nickname;
      
        /*4.Change your browser and server code so that the "/videodata" POST request we implemented last week sends the data to the server as JSON, rather than plain text.*/
        let dataJSON = JSON.stringify({"userid":username, 
                    "url":URL,
                    "nickname":nickname});
        
        sendPostRequest("/videoData", dataJSON)
        .then( function (response) {
          console.log("Response recieved", response);
          sessionStorage.setItem("nickname", nickname);
          window.location = "preview.html";
        })
        .catch( function(err) {
          console.log("POST request error",err);
        });
      }
    })
    .catch( function(err) {
      console.log("Error",err);
    });
}


// button action for my video button (trial 1)
// need work with sendPostRequest/JSON stuff

function buttonPress_for_myvideo() { 
    // Get all the user info.
/*  let username = document.getElementById("user").value;
  let URL = document.getElementById("URL").value;
  let nickname = document.getElementById("nickname").value;

  //let data = username+","+URL+","+nickname;

  4.Change your browser and server code so that the "/videodata" POST request we implemented last week sends the data to the server as JSON, rather than plain text.
  let dataJSON = JSON.stringify({"userid":username, 
              "url":URL,
              "nickname":nickname});
  
  sendPostRequest("/videoData", dataJSON)
  .then( function (response) {
    console.log("Response recieved", response);
    sessionStorage.setItem("nickname", nickname);*/
    window.location = "myvideos.html";
     console.log("this is myvideo page");
 /* })
  .catch( function(err) {
    console.log("POST request error",err);
  });*/

}