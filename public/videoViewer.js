let button = document.getElementById("continue");
button.addEventListener("click",buttonPress);


function buttonPress() { 
  window.location = "myvideos.html";
}


/*when that page comes up, it should send a "getMostRecent" GET request to the server to get the video URL of the most-recently-added video. Use console.log to the Chrome console to make sure you are getting the video URL of the most recently added video.*/
////////////////////////////////////////////////////////////////////////////////////
function isJsonObject(strData) {  //for testing
    try {
        JSON.parse(strData);
    } catch (e) {
        return false;
    }
    return true;
}

async function sendGetRequest(url) {
  params = {
    method: 'GET', 
    headers: {'Content-Type': 'application/json'}};
  
  console.log("about to send GET request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    //console.log("hello world ??this is the URL: ", response.body);
    //let testttt = JSON.parse(response.body);
    //console.log("hello world ??this is the URL: ", testttt);
    let data = await response.text();
    console.log("what is this1? ", data);
    let dataObj = JSON.parse(data);
    console.log("what is this2? ", dataObj);
    let urlInside = dataObj.url;
    console.log("what is this3? ", urlInside);
    return urlInside;
  } else {
    console.log("sendGet back fails.");
    throw Error(response.status);
  }
}



sendGetRequest("/getMostRecent")
  .then( function (response) {
    const example = response;
    
    let reloadButton = document.getElementById("rel"); 
    let divElmt = document.getElementById("tiktokDiv");
    
    // set up button
    reloadButton.addEventListener("click",reloadVideo);
    
    // add the blockquote element that TikTok wants to load the video into
    addVideo(example,divElmt);
    
    // on start-up, load the videos
    loadTheVideos();
    
    // Add the blockquote element that tiktok will load the video into
    async function addVideo(tiktokurl,divElmt) {
    
      let videoNumber = tiktokurl.split("video/")[1];
    
      let block = document.createElement('blockquote');
      block.className = "tiktok-embed";
      block.cite = tiktokurl;
      // have to be formal for attribute with dashes
      block.setAttribute("data-video-id",videoNumber);
      block.style = "width: 325px; height: 563px; margin:0px auto;"
    
      let section = document.createElement('section');
      block.appendChild(section);
      
      divElmt.appendChild(block);
    }
    
    // Ye olde JSONP trick; to run the script, attach it to the body
    function loadTheVideos() {
      body = document.body;
      script = newTikTokScript();
      body.appendChild(script);
    }
    
    // makes a script node which loads the TikTok embed script
    function newTikTokScript() {
      let script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js"
      script.id = "tiktokScript"
      return script;
    }
    
    // the reload button; takes out the blockquote and the scripts, and puts it all back in again.
    // the browser thinks it's a new video and reloads it
    function reloadVideo () {
      
      // get the two blockquotes
      let blockquotes 
     = document.getElementsByClassName("tiktok-embed");
    
      // and remove the indicated one
        block = blockquotes[0];
        console.log("block",block);
        let parent = block.parentNode;
        parent.removeChild(block);
    
      // remove both the script we put in and the
      // one tiktok adds in
      let script1 = document.getElementById("tiktokScript");
      let script2 = script.nextElementSibling;
    
      let body = document.body; 
      body.removeChild(script1);
      body.removeChild(script2);
    
      addVideo(example,divElmt);
      loadTheVideos();
    }
  })
  .catch( function(err) {
    console.log("Error",err);
  });


