"use strict"

var data = JSON.parse(matches);

console.log(data); //Printing data to help manipultating it

window.onload = function() {
    showSomething();
}

function showSomething() {
    let body = document.getElementById("body");
    console.log(localStorage);
    
    console.log(localStorage.getItem("awayGoals"));
    localStorage.clear();
}