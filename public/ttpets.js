
const submitButton = document.getElementById("try1");
submitButton.addEventListener("click",buttonAction);

async function sendPostRequest(url,data) {
  console.log("ready to send post request", data);
  let response = await fetch(url, {
    method: 'POST', 
    headers: {'Content-Type': 'text/plain'},
    body: data });
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}


function buttonAction() {
  let username = document.getElementById("input1").value;
  let inputUrl = document.getElementById("input2").value;

  if (!validateTikTokLink(inputUrl))
  {
    alert("Not a valid Tiktok video link.");
  }

  
  let nickname = document.getElementById("input3").value;
  let  dataToSent = username + " " + inputUrl + " " + nickname;

  console.log("heeeeeeeeyyyyy");
  sendPostRequest('/videoData',dataToSent)
    .then(function(data) {
      console.log(data)
      console.log("Waaw")
      sessionStorage.setItem("resultString", nickname);
      window.location = "/acknowledge.html";
    })
    .catch(function(error) {
      console.log("Error occurred:", error)
    });
}


function validateTikTokLink(input) {
  // Regular expression pattern to match TikTok links
  var tikTokRegex = /^(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@([a-zA-Z0-9._-]+)\/video\/(\d+)\?/;

  // Check if the input matches the TikTok link pattern
  var match = input.match(tikTokRegex);

  // Return true if the input is a valid TikTok link, false otherwise
  return match !== null;
}
