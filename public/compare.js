let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");

for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
  heartButtons[i].classList.add("unloved");
  heartButtons[i].addEventListener("click", function() {pressingHeart(i)});
} // for loop

// hard-code videos for now
// You will need to get pairs of videos from the server to play the game.
// const urls = ["https://www.tiktok.com/@berdievgabinii/video/7040757252332047662",
// "https://www.tiktok.com/@catcatbiubiubiu/video/6990180291545468166"];

// for (let i=0; i<2; i++) {
//       addVideo(urls[i],videoElmts[i]);
//     }
//     // load the videos after the names are pasted in! 
//     loadTheVideos();


/* Step 3
Change the code in "compare.js" so that the two videos it shows are no longer hard-coded, but instead are provided by the Server using the new "getTwoVideos" request. Feel free to use the asynchronous functions in "ajax.js".
*/
async function sendGetRequest(url) {
  params = {
    method: 'GET', 
    headers: {'Content-Type': 'application/json'}};
  
  console.log("About to send GET request for two videos");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let dataObj = await response.json();
    return dataObj;
  } else {
    console.log("sendGet back fails.");
    throw Error(response.status);
  }
}

let arrayOfTwoVideos;

sendGetRequest("/getTwoVideos")
  .then( function (response) {
    arrayOfTwoVideos = response.twoVideos;
    let name1 = document.getElementById("name_store1")
    name1.textContent = arrayOfTwoVideos[0].nickname;
    let name2 = document.getElementById("name_store2")
    name2.textContent = arrayOfTwoVideos[1].nickname;
    // console.log(response);
    console.log(arrayOfTwoVideos);
    for (let i=0; i<2; i++) {
      addVideo(arrayOfTwoVideos[i].url,videoElmts[i]);
    }
    // load the videos after the names are pasted in! 
    loadTheVideos();
  })
  .catch( function(err) {
    console.log("Error",err);
  });




/*step 4
Make the heart buttons work. When the user clicks on a heart, the gray outline heart should be replaced by a solid magenta heart. Also, the heart for the other video should become the gray outline heart if it is not already. This indicates that the user prefers the video with the solid magenta heart. Notice "compare.css" already includes a class "unloved" that makes a heart gray.
*/
function pressingHeart(HeartButtonNum) {
  if (HeartButtonNum == 0) {
    heartButtons[0].classList.remove("unloved");
    heartButtons[0].firstElementChild.setAttribute("data-prefix","fas");
    heartButtons[1].classList.add("unloved");
    heartButtons[1].firstElementChild.setAttribute("data-prefix","far");
  }
  else {
    heartButtons[1].classList.remove("unloved");
    heartButtons[1].firstElementChild.setAttribute("data-prefix","fas");
    heartButtons[0].classList.add("unloved");
    heartButtons[0].firstElementChild.setAttribute("data-prefix","far");
  }
}


/*STEP 6
Now make the "next" button work. When the user clicks "next", two things should happen. First, send an "/insertPref" request to the Server, showing the user's choice. Second, when the response comes back, reload the page to get two new videos.
*/
let nextButton = document.getElementById("next");
nextButton.addEventListener("click",nextRound);

async function nextRound(){
  console.log("clicking");
  // console.log(arrayOfTwoVideos[0]);
  let prefObj = {}
  if (heartButtons[0].firstElementChild.getAttribute("data-prefix") == "fas") {
    prefObj.better = arrayOfTwoVideos[0].rowIdNum
    prefObj.worse = arrayOfTwoVideos[1].rowIdNum
  }
  else if (heartButtons[1].firstElementChild.getAttribute("data-prefix") == "fas"){
    prefObj.better = arrayOfTwoVideos[1].rowIdNum
    prefObj.worse = arrayOfTwoVideos[0].rowIdNum
  }
  else {
    alert("Please like a video.");
    return 0;
  }
  console.log(prefObj);
  let res = await sendPostRequest("/insertPref",prefObj);
  if (res == "\"continue\"") {
    console.log(res);
    window.location.reload();
  }
  //step 8
  else if (res == "\"pick winner\"") {
    console.log(res);
    window.location = "winner.html";
  }
}

async function sendPostRequest(url,data) {
  params = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data) };
  console.log("about to send post request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}