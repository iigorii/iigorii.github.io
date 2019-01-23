"use strict"

var data = JSON.parse(matches);

console.log(data); //Printing data to help manipultating it

window.onload = function() {
    showResults();
}

function showResults() {
        
    $(".away").text(localStorage.getItem("awayTeamName"));
    $(".result").text(localStorage.getItem("awayGoals") + " - " + localStorage.getItem("homeGoals"));
    $(".home").text(localStorage.getItem("homeTeamName"));
    
    localStorage.clear();
}