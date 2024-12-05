var teamAname = "";
var teamBname = "";
var teamAscore = 0;
var teamBscore = 0;
var teamAfouls = 0;
var teamBfouls = 0;
var teamAtimeouts = 0;
var teamBtimeouts = 0;
var ballPossession = 0;

function setDefaults() {
	setTeamColors("A", "#10cc69");
	setTeamColors("B", "#cc1042");
	setScoreboardBG();
}

function setTeamColors(team, color) {
	// Background Colors of Input Color, Score Control Buttons
	document.getElementById("team"+team+"color").value = 
	document.getElementById("score"+team+"minus1").style.backgroundColor = 
	document.getElementById("score"+team+"plus1").style.backgroundColor = 
	document.getElementById("score"+team+"plus2").style.backgroundColor = 
	document.getElementById("score"+team+"plus3").style.backgroundColor = color;
	
	// Text Colors of Score Control Buttons
	document.getElementById("score"+team+"minus1").style.color = 
	document.getElementById("score"+team+"plus1").style.color = 
	document.getElementById("score"+team+"plus2").style.color = 
	document.getElementById("score"+team+"plus3").style.color = getTextColor(color);
	
	// 
}

function setScoreboardBG() {
	let colorA = document.getElementById("teamAcolor").value;
	let colorB = document.getElementById("teamBcolor").value;
	document.getElementById("scoreboard").style.background = "linear-gradient(to right, " + colorA + " 0 50%, " + colorB + " 50% 100%)";
}

function getTextColor(bgColor) {
	return getColorLightness(bgColor) >= 0.5? "#000000" : "#ffffff";
}

function getColorLightness(bgColor) {
	let r = parseInt(bgColor.substr(1, 2), 16) / 255; // red %
	let g = parseInt(bgColor.substr(3, 2), 16) / 255; // green %
	let b = parseInt(bgColor.substr(5, 2), 16) / 255; // blue %
	return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
}

function changeTeamAColor() {
	setTeamColors("A", document.getElementById("teamAcolor").value);
	setScoreboardBG();
}

function changeTeamBColor() {
	setTeamColors("B", document.getElementById("teamBcolor").value);
	setScoreboardBG();
}