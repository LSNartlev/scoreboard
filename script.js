var teamAname = "HOME";
var teamBname = "AWAY";
var teamAcolor = "#e31b93";
var teamBcolor = "#1b82e3";
var teamAscore = 0;
var teamBscore = 0;
var teamAfouls = 0;
var teamBfouls = 0;
var teamAtimeouts = 0;
var teamBtimeouts = 0;
var ballPossession = 0;

function setDefaults() {
	setTeamColors("A", teamAcolor);
	setTeamColors("B", teamBcolor);
	setScoreboardElements();
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
	
	// Colors of Timeout/Sets Won Control Buttons
	document.getElementById("timeout"+team+"minus1").style.backgroundColor =
	document.getElementById("timeout"+team+"plus1").style.backgroundColor = getDarkerColor(color, 0.7);
	document.getElementById("timeout"+team+"minus1").style.color =
	document.getElementById("timeout"+team+"plus1").style.color = getTextColor(getDarkerColor(color, 0.7));
	
	// Colors of Team Foul Control Buttons
	document.getElementById("foul"+team+"minus1").style.backgroundColor =
	document.getElementById("foul"+team+"plus1").style.backgroundColor = getDarkerColor(color, 0.45);
	document.getElementById("foul"+team+"minus1").style.color =
	document.getElementById("foul"+team+"plus1").style.color = getTextColor(getDarkerColor(color, 0.45));
}

function setScoreboardElements() {
	let colorA = document.getElementById("teamAcolor").value;
	let colorB = document.getElementById("teamBcolor").value;
	document.getElementById("scoreboard").style.background = "linear-gradient(to right, " + colorA + " 0 50%, " + colorB + " 50% 100%)";
}

function getTextColor(bgColor) {
	return getColorLightness(bgColor) >= 0.5? "#000000":"#ffffff";
}

/**
	Based on my understanding on color conversion formulas on Wikipedia:
	https://https://en.wikipedia.org/wiki/HSL_and_HSV
*/
function getDarkerColor(color, multiplier) {
	let r = parseInt(color.substr(1, 2), 16) / 255; // red %
	let g = parseInt(color.substr(3, 2), 16) / 255; // green %
	let b = parseInt(color.substr(5, 2), 16) / 255; // blue %
	let maxRGB, minRGB, chroma, hue, saturation, lightness;
	maxRGB = Math.max(r, g, b);
	minRGB = Math.min(r, g, b);
	chroma = maxRGB - minRGB;
	lightness = (maxRGB + minRGB) / 2;
	
	// getting Hue and Saturation
	if(maxRGB == minRGB) {
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
	https://https://en.wikipedia.org/wiki/HSL_and_HSV
*/
function getColorLightness(bgColor) {
	let r = parseInt(bgColor.substr(1, 2), 16) / 255; // red %
	let g = parseInt(bgColor.substr(3, 2), 16) / 255; // green %
	let b = parseInt(bgColor.substr(5, 2), 16) / 255; // blue %
	return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
}

function changeTeamAColor() {
	setTeamColors("A", document.getElementById("teamAcolor").value);
	setScoreboardElements();
}

function changeTeamBColor() {
	setTeamColors("B", document.getElementById("teamBcolor").value);
	setScoreboardElements();
}