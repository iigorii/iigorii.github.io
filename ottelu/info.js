"use strict"

var data = JSON.parse(matches);

console.log(data); 

window.onload = function() {
    showResults();
}

function showResults() {
        
    let homeLogoUrl = localStorage.getItem("homeLogo");
    var homeLogoImg = $('<img />').attr({'src': homeLogoUrl}).appendTo('.home');
    
    let awayLogoUrl = localStorage.getItem("awayLogo");
    var awayLogoImg = $('<img />').attr({'src': awayLogoUrl}).appendTo('.away');
    
    
    $(".home").append(localStorage.getItem("homeTeamName"));
    $(".result").text(localStorage.getItem("homeGoals") + " - " + localStorage.getItem("awayGoals"));
    $(".away").append(localStorage.getItem("awayTeamName"));
    
 
    console.log(localStorage);
    localStorage.clear();
}