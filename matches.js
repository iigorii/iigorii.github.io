"use strict";

var data = JSON.parse(matches);

console.log(data); //Printing data to help manipultating it
/*
TODO: 	

-adding customValidation to dates 
-show only one date in Pvm column if the date is same for multiple matches
		
*/

window.onload = function() {
	listMatches(data);
	//filterByDate();
	filter();
}

/**
* A function for listing matches from data to the site
*/
function listMatches(data){
	let table = document.getElementById("games");
	console.log(table);
	
	let tbody = document.createElement("tbody");
	table.appendChild(tbody);
	
	for (let i=0; i<data.length; i++){
		let tablerow = document.createElement("TR");
		tbody.appendChild(tablerow);
		
		var d = new Date(data[i].MatchDate);
		var month = d.getUTCMonth()+1;
		let dateText = document.createTextNode(d.getDate() + '.' + month + '.' + d.getUTCFullYear());
		let tdDate = document.createElement("TD");
		tdDate.appendChild(dateText);
		tablerow.appendChild(tdDate);
		
		let time = document.createTextNode(d.getUTCHours() + ':' + addZero(d.getUTCMinutes()));
		let tdTime = document.createElement("TD");
		tdTime.appendChild(time);
		tablerow.appendChild(tdTime);
		
		let teams = document.createTextNode(data[i].AwayTeam.Name + " - " + data[i].HomeTeam.Name);
		let tdTeams = document.createElement("TD");
		tdTeams.appendChild(teams);
		tablerow.appendChild(tdTeams);
		
		let result = document.createTextNode(data[i].AwayGoals + " — " + data[i].HomeGoals);
		let tdResult = document.createElement("TD");
		tdResult.appendChild(result);
		tablerow.appendChild(tdResult);
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
	startDate.addEventListener("change", validateDates);
	
	var endDate = document.getElementById("end");
	endDate.addEventListener("change", validateDates);
	
	var filterButton = document.getElementById("submit");
	filterButton.addEventListener("click", filterByDate);
}


/**
* IN PROGRESS: Adding custom validations to datepickers
*/
function validateDates(e){
	e.preventDefault(); 
	
	var startDate = document.getElementById("start").value;
	var endDate = document.getElementById("end").value;
	
	if (Date.parse(startDate) >= Date.parse(endDate)) {
		console.log(e.target);
		e.target.setCustomValidity("Tarkista syöttämäsi päivämäärät");
	} else {
		e.target.setCustomValidity("");
	}
}


/**
* Filtering match list on the website according to users date filtering
*/
function filterByDate(e){
	event.preventDefault(); 
	var start = document.getElementById("start");
	var end = document.getElementById("end");
	var isoStartDate = new Date(start.value).toISOString();
	var isoEndDate = new Date(end.value).toISOString();
	
	var filteredMatches = [];
	
	for (let i = 0; i < data.length; i++){
		if (isoStartDate <= data[i].MatchDate && data[i].MatchDate <= isoEndDate) {
			filteredMatches.push(data[i]);
		}
	}
	
	var table = document.getElementById("games");
	var tbody = document.getElementById("tbody");
	console.log(table.childNodes);
	table.removeChild(table.lastChild);
	console.log(filteredMatches);
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

