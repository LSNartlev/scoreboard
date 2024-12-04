var teamAname = "";
var teamBname = "";
var teamAcolor = "";
var teamBcolor = "";
var teamAfouls = 0;
var teamBfouls = 0;
var teamAtimeouts = 0;
var teamBtimeouts = 0;
var ballPossession = 0;

function setTeamColors() {
  
}

function changeTeamAColor() {
	teamAcolor = document.getElementById("teamAcolor").value;
	let scoreboardSide = document.getElementById("sbTeamAside");
	scoreboardSide.style.backgroundColor = teamAcolor;
}

function changeTeamBColor() {
	teamBcolor = document.getElementById("teamBcolor").value;
	let scoreboardSide = document.getElementById("sbTeamBside");
	scoreboardSide.style.backgroundColor = teamBcolor;
}