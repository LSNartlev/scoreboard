var matchTitle = "Basketball";
var teamAname = "BLUE TEAM", teamBname = "RED TEAM";
var teamAcolor = "#6dbcf5", teamBcolor = "#f56d66";
var teamAscore = 0, teamBscore = 0;
var teamAfouls = 0, teamBfouls = 0;
var teamAtimeouts = 0, teamBtimeouts = 0;
var isBasketball = true, ballPossession = 0;
var enableTimer = true, enableShotClock = true;
var isTimerRunning = false, isShotClockRunning = false;
var timer = [10, 0, 0], shotClock = 24, isTimeout = false;
var defaultTimer = [10, 0, 0], defaultShotClocks = [24, 14, 60];

function setDefaults() {
	setMatchTitle(matchTitle);
	setTeamColors("A", teamAcolor);
	setTeamInfo("A");
	setTeamColors("B", teamBcolor);
	setTeamInfo("B");
	setScoreboardElements();
	resetCounters("A");
	resetCounters("B");
}

function setMatchTitle(matchTitle) {
	document.getElementById("sbMatchTitle").innerHTML = matchTitle;
}

function setTeamColors(team, color) {
	// Background Colors of Input Color, Score Control Buttons
	document.getElementById("team"+team+"color").value = 
	document.getElementById("score"+team+"funcA").style.backgroundColor = 
	document.getElementById("score"+team+"funcB").style.backgroundColor = 
	document.getElementById("score"+team+"funcC").style.backgroundColor = 
	document.getElementById("score"+team+"funcD").style.backgroundColor = color;
	
	// Text Colors of Score Control Buttons and Ball Possession indicator
	document.getElementById("score"+team+"funcA").style.color = 
	document.getElementById("score"+team+"funcB").style.color = 
	document.getElementById("score"+team+"funcC").style.color = 
	document.getElementById("score"+team+"funcD").style.color = getTextColor(color);
	
	// Colors of Timeout/Sets Won Control Buttons
	document.getElementById("timeout"+team+"zero").style.backgroundColor = getShadedColor(color, 0.7, true);
	document.getElementById("timeout"+team+"zero").style.color = getTextColor(getShadedColor(color, 0.7, true));
	document.getElementById("timeout"+team+"minus1").style.backgroundColor =
	document.getElementById("timeout"+team+"plus1").style.backgroundColor = getShadedColor(color, 0.7, false);
	document.getElementById("timeout"+team+"minus1").style.color =
	document.getElementById("timeout"+team+"plus1").style.color = getTextColor(getShadedColor(color, 0.7, false));
	
	// Colors of Team Foul Control Buttons
	document.getElementById("foul"+team+"zero").style.backgroundColor = getShadedColor(color, 0.45, true);
	document.getElementById("foul"+team+"zero").style.color = getTextColor(getShadedColor(color, 0.45, true));
	document.getElementById("foul"+team+"minus1").style.backgroundColor =
	document.getElementById("foul"+team+"plus1").style.backgroundColor = getShadedColor(color, 0.45, false);
	document.getElementById("foul"+team+"minus1").style.color =
	document.getElementById("foul"+team+"plus1").style.color = getTextColor(getShadedColor(color, 0.45, false));
}

function setTeamInfo(team) {
	document.getElementById("team"+team+"name").value = 
	document.getElementById("sbTeam"+team+"name").innerHTML = team == "A"? teamAname:teamBname;
}

function setScoreboardElements() {
	// Scoreboard Background
	teamAcolor = document.getElementById("teamAcolor").value;
	teamBcolor = document.getElementById("teamBcolor").value;
	document.getElementById("scoreboard").style.background = "linear-gradient(to right, " + teamAcolor + " 0 50%, " + teamBcolor + " 50% 100%)";
	
	// Match Title
	//matchTitle = document.getElementById("matchTitle").value;
	document.getElementById("sbMatchTitle").innerHTML = matchTitle;
}

function getTextColor(color) {
	return getColorLightness(color) >= 0.5? "#000000":"#ffffff";
}

/**
	Based on my understanding on color conversion formulas on Wikipedia:
	https://en.wikipedia.org/wiki/HSL_and_HSV
*/
function getShadedColor(color, multiplier, isGrayscaled) {
	let r = parseInt(color.substr(1, 2), 16) / 255; // red %
	let g = parseInt(color.substr(3, 2), 16) / 255; // green %
	let b = parseInt(color.substr(5, 2), 16) / 255; // blue %
	let maxRGB, minRGB, chroma, hue, saturation, lightness;
	maxRGB = Math.max(r, g, b);
	minRGB = Math.min(r, g, b);
	chroma = maxRGB - minRGB;
	lightness = (maxRGB + minRGB) / 2;
	
	// getting Hue and Saturation
	if(maxRGB == minRGB || isGrayscaled) {
		hue = saturation = 0;
	}
	else {
		switch(maxRGB) {
			case r: hue = (((g - b) / chroma) + (g < b? 6 : 0)) / 6; break;
			case g: hue = (((b - r) / chroma) + 2) / 6; break;
			case b: hue = (((r - g) / chroma) + 4) / 6; break;
		}
		hue = Math.round(hue*360); // in degrees
		saturation = lightness > 0.5? (chroma / (2 - maxRGB - minRGB)):(chroma / (maxRGB + minRGB));
		saturation *= 100; // in percent
	}
	
	// getting the new Lightness
	lightness *= multiplier * 100; // in percent
	
	return "hsl(" + hue + "," + saturation + "%," + lightness + "%)";
}

/**
	Based on my understanding on RGB to HSL formulas on Wikipedia:
	https://en.wikipedia.org/wiki/HSL_and_HSV
*/
function getColorLightness(color) {
	let r = parseInt(color.substr(1, 2), 16) / 255; // red %
	let g = parseInt(color.substr(3, 2), 16) / 255; // green %
	let b = parseInt(color.substr(5, 2), 16) / 255; // blue %
	return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
}

function changeTeamName(team) {
	if(team === "A")
		teamAname = document.getElementById("team"+team+"name").value;
	if(team === "B")
		teamBname = document.getElementById("team"+team+"name").value;
	setTeamInfo(team);
}

function changeTeamColor(team) {
	setTeamColors(team, document.getElementById("team"+team+"color").value);
	setScoreboardElements();
}

function updateScore(team, scoreButton) {
	let update = 0;
	if(isBasketball) {
		switch(scoreButton) {
			case "A": update = -1; break;
			case "B": update = 1; break;
			case "C": update = 2; break;
			case "D": update = 3; break;
		}
	}
	else {
		switch(scoreButton) {
			case "A": team === "A"? teamAscore = 0:teamBscore = 0; break;
			case "B": update = -1; break;
			case "C": update = 1; break;
			default: break; // button D is unavailable in volleyball mode
		}
	}
	if(team === "A") teamAscore += update;
	if(team === "B") teamBscore += update;
	// prevent negative scores
	if(teamAscore < 0) teamAscore = 0;
	if(teamBscore < 0) teamBscore = 0;
	// prevent scores above 999
	if(teamAscore > 999) teamAscore = 999;
	if(teamBscore > 999) teamBscore = 999;
	refreshCounters();
}

function updateCounter(team, ctrType, ctrButton) {
	if(ctrButton === 0) {
		if(ctrType === "T") team === "A"? teamAtimeouts = 0:teamBtimeouts = 0;
		if(ctrType === "F") team === "A"? teamAfouls = 0:teamBfouls = 0;
	}
	else {
		if(ctrType === "T") team === "A"? teamAtimeouts += ctrButton:teamBtimeouts += ctrButton;
		if(ctrType === "F") team === "A"? teamAfouls += ctrButton:teamBfouls += ctrButton;
	}
	// prevent negative values
	if(teamAtimeouts < 0) teamAtimeouts = 0;
	if(teamBtimeouts < 0) teamBtimeouts = 0;
	if(teamAfouls < 0) teamAfouls = 0;
	if(teamBfouls < 0) teamBfouls = 0;
	// prevent values above 9
	if(teamAtimeouts > 9) teamAtimeouts = 9;
	if(teamBtimeouts > 9) teamBtimeouts = 9;
	if(teamAfouls > 9) teamAfouls = 9;
	if(teamBfouls > 9) teamBfouls = 9;
	refreshCounters();
}

function refreshCounters() {
	document.getElementById("sbTeamAscore").innerHTML = teamAscore;
	document.getElementById("sbTeamBscore").innerHTML = teamBscore;
	document.getElementById("upperCounterA").innerHTML = teamAtimeouts;
	document.getElementById("upperCounterB").innerHTML = teamBtimeouts;
	document.getElementById("lowerCounterA").innerHTML = teamAfouls;
	document.getElementById("lowerCounterB").innerHTML = teamBfouls;
}

function resetCounters(team) {
	if(team === "A") {
		teamAscore = 0;
		teamAtimeouts = 0;
		teamAfouls = 0;
	}
	else {
		teamBscore = 0;
		teamBtimeouts = 0;
		teamBfouls = 0;
	}
	refreshCounters();
}