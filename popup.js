
$(document).ready(()=>{
  
  $("#friendUser").click(()=>{
   var val = document.getElementsByTagName("input")[0];
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        
      chrome.tabs.executeScript(tabs[0].id , {
        file :"codeforces.js"
      } ,()=>{
        chrome.tabs.sendMessage(tabs[0].id , {message : val.value});
      });
    })
  })


})
