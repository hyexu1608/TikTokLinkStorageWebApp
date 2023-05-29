// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});



// always shows the same hard-coded video.  You'll need to get the server to 
// compute the winner, by sending a 
// GET request to /getWinner,
// and send the result back in the HTTP response.


//step9
async function sendGetRequest(url) {
  params = {
    method: 'GET', 
    headers: {'Content-Type': 'application/json'}};
  
  console.log("About to send GET request for winner video");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let dataObj = await response.json();
    let name = document.getElementById("name_store")
    name.textContent = dataObj.nickname;
    return dataObj.url;
  } else {
    console.log("Get Winner back fails.");
    throw Error(response.status);
  }
}

sendGetRequest("/getWinner")
  .then( function (response) {
    let winningUrl = response;
    addVideo(winningUrl, divElmt);
    loadTheVideos();
  })
  .catch( function(err) {
    console.log("Error",err);
  });




// showWinningVideo()

// function showWinningVideo() {
  
//   let winningUrl = "https://www.tiktok.com/@catcatbiubiubiu/video/6990180291545468166";
//   addVideo(winningUrl, divElmt);
//   loadTheVideos();
// }
