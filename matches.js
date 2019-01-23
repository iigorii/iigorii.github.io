"use strict";

var data = JSON.parse(matches);

console.log(data); //Printing data to help manipultating it
/*
TODO: 	

-simplify listMatches- function
		
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
		let teams = document.createTextNode(data[i].AwayTeam.Name + " - " + data[i].HomeTeam.Name);
		pageLink.appendChild(teams);
		let tdTeams = document.createElement("TD");
		tdTeams.appendChild(pageLink);
		tablerow.appendChild(tdTeams);
		
		
		
		let result = document.createTextNode(data[i].AwayGoals + " — " + data[i].HomeGoals);
		let tdResult = document.createElement("TD");
		tdResult.appendChild(result);
		tablerow.appendChild(tdResult);
        
        pageLink.addEventListener("click", function(){
            
            localStorage.setItem("awayTeamName", data[i].AwayTeam.Name);
            localStorage.setItem("homeTeamName", data[i].HomeTeam.Name);
            localStorage.setItem("awayGoals", data[i].AwayGoals);
            localStorage.setItem("homeGoals", data[i].HomeGoals);
            
                
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
* IN PROGRESS: changes year if user tries to select the first or the last day of the year to both datepickers
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
* Filtering match list on the website according to users date filtering
*/
function filterByDate(e){
	e.preventDefault(); 
	
	
	
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
	table.removeChild(table.lastChild);
	listMatches(filteredMatches);
	
	if (filteredMatches.length <= 0) {
		var tbody = document.createElement("tbody");
		table.appendChild(tbody);
		let tablerow = document.createElement("TR");
		tbody.appendChild(tablerow);
		
		//appends extra tbody?
		let error = document.createTextNode("Ei pelattuja otteluita tällä aikavälillä");
		let tdError = document.createElement("TD");
		tdError.appendChild(error);
		tablerow.appendChild(tdError);
	}
}

