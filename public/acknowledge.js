const report = document.getElementById("report");

let stringToDisplay = sessionStorage.getItem("resultString");

let msg = report.textContent;
msg = msg.replace("NICKNAME", stringToDisplay);
report.textContent = msg;