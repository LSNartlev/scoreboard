var matchTitle = "Web Scoreboard by LSNartlev";
var teamAname = "BLUE TEAM", teamBname = "RED TEAM";
var teamAcolor = "#6dbcf5", teamBcolor = "#f56d66";
var teamAscore = 0, teamBscore = 0;
var teamAupperCounter = 0, teamBupperCounter = 0;
var teamAlowerCounter = 0, teamBlowerCounter = 0;
var isBasketball = true, ballPossession = 0;
var enableTimer = true, enableShotClock = true;
var isTimerRunning = false, isShotClockRunning = false;
var timer = [10, 0, 0], shotClock = 24, isTimeout = false;
var defaultTimer = [10, 0, 0], defaultShotClocks = [24, 14, 60];

function setDefaults() {
	setTeamColors("A", teamAcolor);
	setTeamInfo("A");
	setTeamColors("B", teamBcolor);
	setTeamInfo("B");
	setMatchTitle(matchTitle);
	setScoreboardElements();
	changePeriod();
	resetCounters("A");
	resetCounters("B");
}

function setMatchTitle(matchTitle) {
	document.getElementById("matchTitle").value = matchTitle;
}

function setTeamColors(team, color) {
	if(team === "A") teamAcolor = color;
	if(team === "B") teamBcolor = color;
	
	// Background Colors of Input Color, Score Control Buttons
	document.getElementById("team"+team+"color").value = 
	document.getElementById("score"+team+"funcA").style.backgroundColor = isBasketball? color:getShadedColor(color, 0.7, true);
	document.getElementById("score"+team+"funcB").style.backgroundColor = 
	document.getElementById("score"+team+"funcC").style.backgroundColor = 
	document.getElementById("score"+team+"funcD").style.backgroundColor = color;
	
	// Text Colors of Score Control Buttons and Ball Possession indicator
	document.getElementById("score"+team+"funcA").style.color = isBasketball? getTextColor(color):getTextColor(getShadedColor(color, 0.7, true));
	document.getElementById("score"+team+"funcB").style.color = 
	document.getElementById("score"+team+"funcC").style.color = 
	document.getElementById("score"+team+"funcD").style.color = getTextColor(color);
	
	// Colors of Timeout/Sets Won Control Buttons
	document.getElementById("upper"+team+"zero").style.backgroundColor = getShadedColor(color, 0.7, true);
	document.getElementById("upper"+team+"zero").style.color = getTextColor(getShadedColor(color, 0.7, true));
	document.getElementById("upper"+team+"minus1").style.backgroundColor =
	document.getElementById("upper"+team+"plus1").style.backgroundColor = getShadedColor(color, 0.7, false);
	document.getElementById("upper"+team+"minus1").style.color =
	document.getElementById("upper"+team+"plus1").style.color = getTextColor(getShadedColor(color, 0.7, false));
	
	// Colors of Team Foul Control Buttons
	document.getElementById("lower"+team+"zero").style.backgroundColor = getShadedColor(color, 0.45, true);
	document.getElementById("lower"+team+"zero").style.color = getTextColor(getShadedColor(color, 0.45, true));
	document.getElementById("lower"+team+"minus1").style.backgroundColor =
	document.getElementById("lower"+team+"plus1").style.backgroundColor = getShadedColor(color, 0.45, false);
	document.getElementById("lower"+team+"minus1").style.color =
	document.getElementById("lower"+team+"plus1").style.color = getTextColor(getShadedColor(color, 0.45, false));
}

function setTeamInfo(team) {
	document.getElementById("team"+team+"name").value = 
	document.getElementById("sbTeam"+team+"name").innerHTML = team == "A"? teamAname:teamBname;
}

function setScoreboardElements() {
	// Scoreboard Background
	document.getElementById("scoreboard").style.background = "linear-gradient(to right, " + teamAcolor + " 0 50%, " + teamBcolor + " 50% 100%)";
	
	// Match Title
	matchTitle = document.getElementById("matchTitle").value;
	document.getElementById("sbMatchTitle").innerHTML = matchTitle;
	
	// Scoreboard Labels
	document.getElementById("teamAupperctrl").innerHTML = 
	document.getElementById("teamBupperctrl").innerHTML = 
	document.getElementById("upperLabelA").innerHTML = 
	document.getElementById("upperLabelB").innerHTML = isBasketball? "Team Fouls":"Set Wins";
	document.getElementById("teamAlowerctrl").innerHTML = 
	document.getElementById("teamBlowerctrl").innerHTML = 
	document.getElementById("lowerLabelA").innerHTML = 
	document.getElementById("lowerLabelB").innerHTML = "Timeouts Left";
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

function changeMatchTitle() {
	matchTitle = document.getElementById("matchTitle").value;
	setScoreboardElements();
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
		if(ctrType === "T") team === "A"? teamAupperCounter = 0:teamBupperCounter = 0;
		if(ctrType === "F") team === "A"? teamAlowerCounter = 0:teamBlowerCounter = 0;
	}
	else {
		if(ctrType === "T") team === "A"? teamAupperCounter += ctrButton:teamBupperCounter += ctrButton;
		if(ctrType === "F") team === "A"? teamAlowerCounter += ctrButton:teamBlowerCounter += ctrButton;
	}
	// prevent negative values
	if(teamAupperCounter < 0) teamAupperCounter = 0;
	if(teamBupperCounter < 0) teamBupperCounter = 0;
	if(teamAlowerCounter < 0) teamAlowerCounter = 0;
	if(teamBlowerCounter < 0) teamBlowerCounter = 0;
	// prevent values above 9
	if(teamAupperCounter > 9) teamAupperCounter = 9;
	if(teamBupperCounter > 9) teamBupperCounter = 9;
	if(teamAlowerCounter > 9) teamAlowerCounter = 9;
	if(teamBlowerCounter > 9) teamBlowerCounter = 9;
	refreshCounters();
}

function refreshCounters() {
	document.getElementById("sbTeamAscore").innerHTML = teamAscore;
	document.getElementById("sbTeamBscore").innerHTML = teamBscore;
	document.getElementById("upperCounterA").innerHTML = teamAupperCounter;
	document.getElementById("upperCounterB").innerHTML = teamBupperCounter;
	document.getElementById("lowerCounterA").innerHTML = teamAlowerCounter;
	document.getElementById("lowerCounterB").innerHTML = teamBlowerCounter;
}

function resetCounters(team) {
	if(team === "A") {
		teamAscore = 0;
		teamAupperCounter = 0;
		teamAlowerCounter = 0;
	}
	else {
		teamBscore = 0;
		teamBupperCounter = 0;
		teamBlowerCounter = 0;
	}
	refreshCounters();
}

function changeGameMode() {
	isBasketball = document.querySelector("input[name='gameMode']:checked").value === "Basketball"? true:false;
	document.getElementById("scoreAfuncA").value = isBasketball? "\u22121":"0";
	document.getElementById("scoreAfuncA").style.backgroundColor = isBasketball? teamAcolor:getShadedColor(teamAcolor, 0.7, true);
	document.getElementById("scoreAfuncA").style.color = isBasketball? getTextColor(teamAcolor):getTextColor(getShadedColor(teamAcolor, 0.7, true));
	document.getElementById("scoreBfuncA").value = isBasketball? "\u22121":"0";
	document.getElementById("scoreBfuncA").style.backgroundColor = isBasketball? teamBcolor:getShadedColor(teamBcolor, 0.7, true);
	document.getElementById("scoreBfuncA").style.color = isBasketball? getTextColor(teamBcolor):getTextColor(getShadedColor(teamBcolor, 0.7, true));
	document.getElementById("scoreAfuncB").value = isBasketball? "+1":"\u22121";
	document.getElementById("scoreBfuncB").value = isBasketball? "+1":"\u22121";
	document.getElementById("scoreAfuncC").value = isBasketball? "+2":"+1";
	document.getElementById("scoreBfuncC").value = isBasketball? "+2":"+1";
	document.getElementById("scoreAfuncD").style.display = isBasketball? "inline-block":"none";
	document.getElementById("scoreBfuncD").style.display = isBasketball? "inline-block":"none";
	setScoreboardElements();
}

function changePeriod() {
	let periodNum = document.getElementById("periodNum").value;
	let gamePeriod = document.querySelector("#gamePeriod").value;
	let periodLabel = "";
	switch(periodNum) {
		case "0": periodLabel += "Time Remaining"; break;
		case "1": periodLabel += "1st " + gamePeriod; break;
		case "2": periodLabel += "2nd " + gamePeriod; break;
		case "3": periodLabel += gamePeriod === "Half"? "Overtime":"3rd " + gamePeriod; break;
		case "4": periodLabel += gamePeriod === "Half"? "Overtime":"4th " + gamePeriod; break;
		case "5": periodLabel += gamePeriod != "Set"? "Overtime":"5th " + gamePeriod; break;
	}
	document.getElementById("sbPeriodText").innerHTML = periodLabel;
}