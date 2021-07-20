
var User = document.querySelectorAll("div.lang-chooser > div > a");
var allProblems = document.querySelectorAll("table.problems>tbody>tr");
User[2].classList.add("myClass");

var allSolvedByFriend = [];

/*on getting handles as input from popup.js */
chrome.runtime.onMessage.addListener((message)=>{
    var curr = message.message ;
    let allFriends = curr.split(" ");
    allFriends.forEach((currFriend)=>{
        if(currFriend.length > 0){
          let handle = currFriend;
          cahangeColour(handle);
         
        }
    })
})

/* loops over all problems in the given page*/
function cahangeColour(handle){
allProblems.forEach((currProblem)=>{
    var now = currProblem.querySelectorAll("td");
    if(now.length > 0){
    if(!(currProblem.classList.contains('accepted-problem')))
    { 
    let contestId = getContestId(now[0]);
    let newUrl = makeUrl(handle , contestId);
    now = now[2];
    getSubmissions(newUrl ,now)

    }}
})
}



/* making an API call to codeforces.com*/
 function getSubmissions(url){
try{
 fetch(url ,{ headers : { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
   }}).then((result , err)=>{ 
      result.json().then((ress , status)=>{
        console.log(ress);
          let submissions = ress.result ;
         if(ress.status === "OK" && submissions.length > 0){
          submissions.forEach((currSubmission)=>{
           if(currSubmission.verdict === "OK"){
             let currProblem = currSubmission.problem;
             let contestIndex = currProblem.contestId;
                contestIndex = contestIndex.toString();
             let problemIndex = currProblem.index;
             let now = contestIndex + problemIndex;
             changeClass(now);
           }
          })}
          })
          //.catch((err)=>{
        //     console.log("An error occured" +'\n');
        //  })
    })
    //.catch((err)=>{
    //    console.log("An error occured" +'\n');
    //})
}
catch (err){
     console.log('some error occured' +'\n');
}
}



/* generating the url for API call */

function makeUrl(handle , contestId){
    let baseUrl = 'https://codeforces.com/api/contest.status?';
    let startIndex = 1 , lastIndex = 50;
    let newUrl = baseUrl + `contestId=${contestId}&handle=${handle}&from=${startIndex}&count<=${lastIndex}`;
    return newUrl
}




/* Getting contestId from problemset */
function getContestId(currProblem){
let url = currProblem.querySelectorAll('a');
url = url[0];
let problemId = url.innerText;
var x = 0 ;  
let curValue = "";
for(var x = 0 ; x < problemId.length ;x++){
   if(problemId.charCodeAt(x) > 64)break;
   curValue += problemId[x];
}
var val = parseInt(curValue);
return val;
}

/*Change the color of problem solved by either of the friends*/
function changeClass(currValue){
    allProblems.forEach((currProblem)=>{
        if(!(currProblem.classList.contains('accepted-problem'))){ 
    var now = currProblem.querySelectorAll("td");
    if(now.length > 0){
    let problemIndex = getProblemIndex(now[0]);
    problemIndex = problemIndex.toString();
    if(problemIndex == currValue){
          now = now[2];
          now.classList.add("solvedByFriend");
    }
  }}
})        
}

/* getting name of problem ex ; 1532B , 1334C */
function getProblemIndex(currProblem){
    let url = currProblem.querySelectorAll('a');
    url = url[0];
    let problemId = url.innerText;
    return problemId;
}