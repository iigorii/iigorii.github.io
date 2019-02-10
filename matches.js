"use strict";

var data = JSON.parse(matches);

console.log(data); 
/*
TODO: 	


		
*/
var selectedTeamMatches = [];

window.onload = function() {
	listMatches(data);
	filter();
    teamFilter();
}

/**
* A function for listing matches to the site
*/
function listMatches(data){
	let table = document.getElementById("games");
	
	let tbody = document.createElement("tbody");
	table.appendChild(tbody);
	
	for (let i=0; i<data.length; i++){
		let tablerow = document.createElement("TR");
		tbody.appendChild(tablerow);
		
		var d = new Date(data[i].MatchDate);
		var month = d.getUTCMonth()+1;
		let dateText = document.createTextNode(d.getDate() + '.' + month + '.' + d.getUTCFullYear());
		let tdDate = document.createElement("TD");
		if (i >= 1) { //if there are same dates in a row, the date is presented only once
			if ( data[i].MatchDate == data[i - 1].MatchDate) {
				let dateText = document.createTextNode("");
				let tdDate = document.createElement("TD");
				tdDate.appendChild(dateText);
				tablerow.appendChild(tdDate);
			}
			else {
				tdDate.appendChild(dateText);
				tablerow.appendChild(tdDate);
			}
		}
		else {
				tdDate.appendChild(dateText);
				tablerow.appendChild(tdDate);
		}
		
		let time = document.createTextNode(d.getUTCHours() + ':' + addZero(d.getUTCMinutes()));
		let tdTime = document.createElement("TD");
		tdTime.appendChild(time);
		tablerow.appendChild(tdTime);
		
       
		let pageLink = document.createElement("A");
		pageLink.setAttribute("href", "ottelu/index.html" /*"javascript:makeDocument(matchInfo)"*/);
		let teams = document.createTextNode(data[i].HomeTeam.Name + " - " + data[i].AwayTeam.Name);
		pageLink.appendChild(teams);
		let tdTeams = document.createElement("TD");
		tdTeams.appendChild(pageLink);
		tablerow.appendChild(tdTeams);
		
		
		
		let result = document.createTextNode(data[i].HomeGoals + " — " + data[i].AwayGoals);
		let tdResult = document.createElement("TD");
		tdResult.appendChild(result);
		tablerow.appendChild(tdResult);
        
        pageLink.addEventListener("click", function(){ //inserts data to localStorage so that it is available on the opening page
            
            localStorage.setItem("awayTeamName", data[i].AwayTeam.Name);
            localStorage.setItem("homeTeamName", data[i].HomeTeam.Name);
            localStorage.setItem("awayGoals", data[i].AwayGoals);
            localStorage.setItem("homeGoals", data[i].HomeGoals);
            localStorage.setItem("homeLogo", data[i].HomeTeam.LogoUrl);
            localStorage.setItem("awayLogo", data[i].AwayTeam.LogoUrl);
                
        });
	}

}   



/**
* A function for adding zero to time if time unit is less than ten
*/
function addZero(min){
	if (min < 10){
		min = "0" + min;
	}
	return min;
}


/**
* Adding event listeners for date filtering form
*/
function filter() {
	
	var startDate = document.getElementById("start");
	startDate.addEventListener("change", setEndDateValues);
	
	var endDate = document.getElementById("end");
	endDate.addEventListener("change", setStartDateValues);
	
	
	var filterButton = document.getElementById("submit");
	filterButton.addEventListener("click", filterByDate);
}


/**
* Changes end date values according to users selection of start date
* 
*/
function setEndDateValues(e){
	e.preventDefault(); 
	
	var startDate = document.getElementById("start").value;
	var end = document.getElementById("end");
	var endDate = end.value;
	let datepicker = e.target;
	
	var newEndMin = new Date(startDate);
	var newEndMinDate = newEndMin.getDate() + 1;

	newEndMin.setDate(newEndMinDate);
	
	var formatedMin = formatDate(newEndMin)
	end.min = formatedMin;
	if (Date.parse(startDate) >= Date.parse(endDate)) end.value = formatedMin;
}


/**
* Changes start date values according to users selection of end date
*/
function setStartDateValues(e){
	e.preventDefault(); 
	var start = document.getElementById("start");
	var startDate = start.value;
	var end = document.getElementById("end");
	var endDate = end.value;
	
	let datepicker = e.target;
	
	var newStartMax = new Date(endDate);
	var newStartMaxDate = newStartMax.getDate() - 1;
	newStartMax.setDate(newStartMaxDate);
	
	var formatedMax = formatDate(newStartMax)
	start.max = formatedMax;

	if (Date.parse(startDate) >= Date.parse(endDate)) start.value = formatedMax;
}


/**
* Formates JavaScript date to yyyy-mm-dd format
*/
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}




/**
* Filtering match list on the website according to users date filtering and team choise
*/
function filterByDate(e){
	e.preventDefault(); 
	
	var slct = document.getElementById("team");
	var start = document.getElementById("start");
	var end = document.getElementById("end");
	var isoStartDate = new Date(start.value).toISOString();
	var isoEndDate = new Date(end.value).toISOString();
	
	var filteredMatches = [];
	
	if (slct.options[slct.selectedIndex].value != ""){ // if user has chosen a team from dropdown
		for (let i = 0; i < selectedTeamMatches.length; i++){
			if (isoStartDate <= selectedTeamMatches[i].MatchDate && selectedTeamMatches[i].MatchDate <= isoEndDate) {
				filteredMatches.push(selectedTeamMatches[i]);
			}
		}
	}
	else { // if user has not chosen a team
		for (let i = 0; i < data.length; i++){
			if (isoStartDate <= data[i].MatchDate && data[i].MatchDate <= isoEndDate) {
				filteredMatches.push(data[i]);
			}
		}
	}
	
	var table = document.getElementById("games");
	var tbody = document.getElementById("tbody");
	table.removeChild(table.lastChild);
	listMatches(filteredMatches);
	
	if (filteredMatches.length <= 0) {
		var tbody = document.createElement("tbody");
		table.appendChild(tbody);
		let tablerow = document.createElement("TR");
		tbody.appendChild(tablerow);
		
		let error = document.createTextNode("Ei pelattuja otteluita tällä aikavälillä");
		let tdError = document.createElement("TD");
		tdError.appendChild(error);
		tablerow.appendChild(tdError);
	}
}

/**
* Adds team names to drop down selection on the page
*/
function teamFilter() {
    
	var teams = getTeamIdsAndNames();
	console.log(teams);
    
    var slct = document.getElementById("team");
	slct.addEventListener("click", handleSelect)
    
    for (let i = 0; i < teams.length; i++){
        let optn = document.createElement("option");
		let teamText = document.createTextNode(teams[i][1]);
        optn.appendChild(teamText);
		optn.setAttribute("value", teams[i][0]);
        slct.appendChild(optn);
        
    }
}


/**
*	Lists matches based on users team selection on the site 
*/
function handleSelect(e) {
    e.preventDefault();
	
    selectedTeamMatches = [];
    
    for (let i of data) {
        if (e.target.value == i.AwayTeam.Id || e.target.value == i.HomeTeam.Id) {
            selectedTeamMatches.push(i);
        }
    }
    
    if (e.target.value == "") {
        var table = document.getElementById("games");
        var tbody = document.getElementById("tbody");
        table.removeChild(table.lastChild);
       listMatches(data);
    } 
    else {
       
		var table = document.getElementById("games");
		var tbody = document.getElementById("tbody");
		table.removeChild(table.lastChild);
		listMatches(selectedTeamMatches);
		console.log(selectedTeamMatches);
    }
}


/**
* returns an array with team names and ids
*/
function getTeamIdsAndNames(){
    var teams = []; 
    
	for (let i = 0; i < data.length; i++) {
		let match = data[i];
		if (ifExists(teams, match.AwayTeam.Id)) continue;
		teams.push([match.AwayTeam.Id, match.AwayTeam.FullName]);	
		}
       
    return teams;
}


/**
* Checks if team array includes specific id
*/
function ifExists(array, search) {
    return array.some(row => row.includes(search));
}