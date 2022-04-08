var named = '';
var encoded = null;
var encodeImg = null;
var decodeStr = '';
var fileExt = null;
var today = dateCalc();
var time = timeCalc();
var amzDate = today + "T" + time + "Z";

//Speech Recognition-->
window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();
//-->

function dateCalc() {
  const today = new Date(Date.now());
  month = today.getMonth() + 1;
  year = today.getFullYear();
  day = today.getDate();
  if (month < 10)
    month = "0" + month;
  if (day < 10)
    day = "0" + day;
  todayStr = year + "" + month + "" + day;
  return todayStr;
}
function timeCalc() {
  const today = new Date(Date.now());
   second = today.getSeconds();
   minute = today.getMinutes();
   hour = today.getHours();
  if (second < 10)
    second = "0" + second;
  if (minute < 10)
    minute = "0" + minute;
  if (hour < 10)
    hour = "0" + hour;
  return hour + "" + minute + "" + second
}

function previewFile(input) {
  var reader = new FileReader();
  console.log(input);
  named = input.files[0].name;
  fileExt = named.split(".").pop();
  var onlyname = named.replace(/\.[^/.]+$/, "");
  console.log(onlyname);
  var finalName = onlyname + "_" + Date.now() + "." + fileExt;
  named = finalName;
  console.log(named);
  reader.onload = function (e) {
    var src = e.target.result;
    encodeImg = src.split(",").pop();
    var newImage = document.createElement("img");
    newImage.src = src;
    encoded = newImage.outerHTML;
  }
  reader.readAsDataURL(input.files[0]);
}

function upload() {
  var myHeaders = new Headers();
  myHeaders.append("X-Amz-Date", amzDate);
  myHeaders.append("Authorization", "AWS4-HMAC-SHA256 Credential=" + ACCESS_KEY + "/" + today + "/us-east-1/execute-api/aws4_request, SignedHeaders=content-type;host;method;x-amz-date, Signature=" + SIGNATURE);
  myHeaders.append("Content-Type", "image/jpeg");
  var file = encodeImg;
  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: file,
    redirect: 'follow'
  };
  var url = "https://okpnqem4rl.execute-api.us-east-1.amazonaws.com/alpha/photos-assgn2/" + named;
  console.log(url);
  fetch(url, requestOptions)
    .then(response => response.text())
    .then(result => { console.log(result); alert("Upload Successful!!") })
    .catch(error => console.log('error', error));
}

function search() {
  var myHeaders = new Headers();
  myHeaders.append("X-Amz-Date", amzDate);
  myHeaders.append("Authorization", "AWS4-HMAC-SHA256 Credential=" + ACCESS_KEY + "/" + today + "/us-east-1/execute-api/aws4_request, SignedHeaders=content-type;host;method;x-amz-date, Signature=" + SIGNATURE);
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  var query = document.getElementById("searchPhotos").value;
  console.log(query)
  fetch("https://okpnqem4rl.execute-api.us-east-1.amazonaws.com/alpha/search?q=" + query, requestOptions)
    .then(response => response.json())
    .then(result => result)
    .then((result) => {
      //results = result;
      console.log(result);
      rsu = result['body'].split("[").pop();
      rsu = rsu.slice(0, rsu.length - 2);
      rsu = rsu.replaceAll("\"", "");
      console.log(rsu)
      showImages(rsu.split(","))
    })
    .catch(error => console.log('error', error));

}

function showImages(res) {
  var newDiv = document.getElementById("images-d");
  newDiv.innerHTML = res;
  if (typeof (newDiv) != 'undefined' && newDiv != null) {
    while (newDiv.firstChild) {
      newDiv.removeChild(newDiv.firstChild);
    }
  }
  console.log(res)
  if (res.length == 0) {
    var newContent = document.createTextNode("No image to display");
    newDiv.appendChild(newContent);
    var currentDiv = document.getElementById("div1");
    document.body.insertBefore(newDiv, currentDiv);
  }
  else {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i]);
      var newDiv = document.getElementById("images-d");
      newDiv.style.display = 'inline'
      var newContent = document.createElement("img");
      newContent.src = res[i];
      newContent.style.padding = "20px";
      newContent.style.height = "200px";
      newContent.style.width = "200px";
      newDiv.appendChild(newContent);
      var currentDiv = document.getElementById("div1");
      document.body.insertBefore(newDiv, currentDiv);
    }
  }
}

function voiceSearch() {
  recognition.start();
  recognition.onresult = (event) => {

    const speechToText = event.results[0][0].transcript;
    console.log(speechToText);
    document.getElementById('searchPhotos').value = speechToText;
    search();
  }

}
