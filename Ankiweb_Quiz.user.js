// ==UserScript==
<<<<<<< Updated upstream
// @name        AnkiWeb Quiz
// @namespace   https://greasyfork.org/users/102866
// @description Shows quiz on ankiweb
// @include     https://ankiweb.net/*
// @include     http://ankiweb.net/*
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @author      TiLied
// @version     0.2.4
// @grant       GM_getResourceText
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_setValue
// @resource    ankiDeck PUT_HERE_YOUR_DECK.txt
// ==/UserScript==

//not empty val
var originAnkiDeck = GM_getResourceText("ankiDeck"),
	std = window.eval("require('study').default;"),
	defaultDeck = new Deck("question default", "answer default", 10001, 20002),
	defaultDecks =
	{
		defaultId:
			{
				cards: defaultDeck,
				updateDeck: false
			}
	};
=======
// @name	AnkiWeb Quiz
// @namespace	https://greasyfork.org/users/102866
// @description	Shows quiz on ankiweb.
// @match     https://ankiuser.net/*
// @match     https://ankiweb.net/*
// @author	TiLied
// @version	2.0.00
// @grant	GM_openInTab
// @grant	GM_listValues
// @grant	GM_getValue
// @grant	GM_setValue
// @grant	GM_deleteValue
// @require	https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant	GM.openInTab
// @grant	GM.listValues
// @grant	GM.getValue
// @grant	GM.setValue
// @grant	GM.deleteValue
// ==/UserScript==

class AnkiWebQuiz {
	_Options = new Object();
	_Decks = new Object();
>>>>>>> Stashed changes

	_DeckId;

	constructor() {
		console.log("AnkiWeb Quiz v" + GM.info.script.version + " initialization");

<<<<<<< Updated upstream
//empty val
var searchFor,
	trueAnswer,
	trueId,
	id,
	rubyVal,
	deck;

//prefs
var amountButtons,
	debug,
	decks,
	lastIdChosen;

Main();

function Main()
{
	UrlHandler(document.URL);
	inB = FindIndexes(inBstring, originAnkiDeck);
	inE = FindIndexes(inEstring, originAnkiDeck);
	console.log(inB);
	console.log(inE);
	
	for (var i = 0; i < inB.length; i++)
	{
		tempStrings[i] = originAnkiDeck.slice(inB[i] + 5, inE[i]);
		//console.log(tempStrings[i]);
	}
	console.log(tempStrings);
	CssAdd();
	SetSettings();
	SetEventsOnDecks(document.URL);
}

//Settings
function SetSettings()
{
	const settings = $("<li class=nav-item></li>").html("<a id=awq_settings class=nav-link>Settings Ankiweb Quiz " + GM_info.script.version + "</a> \
		<div id=awq_settingsPanel class=awq_settingsP>\
		<form> \
		<br> \
		Debug: <input type=checkbox name=debug id=awq_debug></input>\
		</form>\
		<button id=hideButton class=awq_style>Hide</button>\
		</div>\
		");

	$(".navbar-nav:first").append(settings);
	$("#awq_settings").addClass("awq_settings");
	$("#awq_settingsPanel").hide();
	SetEventSettings();
	LoadSettings();
}

function LoadSettings()
{
	//THIS IS ABOUT DEBUG
	if (HasValue("awq_debug", false))
	{
		debug = GM_getValue("awq_debug");
		$("#awq_debug").prop("checked", debug);
	}

	//THIS IS ABOUT DECKS
	if (HasValue("awq_decks", JSON.stringify(defaultDecks)))
	{
		decks = JSON.parse(GM_getValue("awq_decks"));
	}

	//THIS IS ABOUT lastIdChosen
	if (HasValue("awq_lastIdChosen", 000))
	{
		lastIdChosen = GM_getValue("awq_lastIdChosen");
		GetDeck(lastIdChosen);
	}

	//THIS IS ABOUT BUTTONS
	if (HasValue("awq_amountButtons", 8))
	{
		amountButtons = GM_getValue("awq_amountButtons");
	}

	//Console log prefs with value
	console.log("*prefs:");
	console.log("*-----*");
	var vals = [];
	for (var i = 0; i < GM_listValues().length; i++)
	{
		vals[i] = GM_listValues()[i];
	}
	for (var i = 0; i < vals.length; i++)
	{
		console.log("*" + vals[i] + ":" + GM_getValue(vals[i]));
	}
	console.log("*-----*");
}

//Check if value exists or not.  optValue = Optional
function HasValue(nameVal, optValue)
{
	var vals = [];
	for (var i = 0; i < GM_listValues().length; i++)
	{
		vals[i] = GM_listValues()[i];
	}

	if (vals.length === 0)
	{
		if (optValue != undefined)
		{
			GM_setValue(nameVal, optValue);
			return true;
		} else
		{
			return false;
=======
		this._LoadOptionsAndDecks();
		this._SetCSS();
		//_FirstTime();
	}

	_SetCSS() {
		globalThis.window.document.head.append("<!--Start of AnkiWeb Quiz v" + GM.info.script.version + " CSS-->");


		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_quizGrid" +
			"{" +
			"display: grid;" +
			"grid-template-columns: repeat(4,auto);" +
			"grid-template-rows: auto;" +
			"}</style>");

		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_quizButton" +
			"{" +
			"color: #fff;" +
			"background-color: #0275d8;" +
			"border-color: #0275d8;" +
			"padding: .75rem 1.5rem;" +
			"font-size: 1rem;" +
			"border-radius: .3rem;" +
			"border: 1px solid transparent;" +
			"max-width:250px;" +
			"margin:5px;" +
			"cursor: pointer;" +
			"max-height: 300px;" +
			"overflow: auto;" +
			"}</ style >");
		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_quizButton:hover" +
			"{" +
			"background-color: #025aa5;" +
			"}</ style >");

		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_true" +
			"{" +
			"background-color: #75d802;" +
			"}</style>");
		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_true:hover" +
			"{" +
			"background-color: #5aa502;" +
			"}</style>");
		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>.awq_trueBorder" +
			"{" +
			"border-color: #75d802;" +
			"}</style>");
		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_false" +
			"{" +
			"background-color: #d80275;" +
			"}</style>");
		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_false:hover" +
			"{" +
			"background-color: #a5025a;" +
			"}</style>");
		globalThis.window.document.head.insertAdjacentHTML("beforeend", "<style type='text/css'>.awq_falseBorder" +
			"{" +
			"border-color: #d80275;" +
			"}</style>");

		globalThis.window.document.head.append("<!--End of AnkiWeb Quiz v" + GM.info.script.version + " CSS-->");

	}

	async _LoadOptionsAndDecks() {
		this._Options = await GM.getValue("awqOptions");
		this._Decks = await GM.getValue("awqDecks");

		if (this._Options == null)
			this._Options = new Object();
		if (this._Decks == null)
			this._Decks = new Object();

		//Console log prefs with value
		console.log("*prefs:");
		console.log("*-----*");

		let vals = await GM.listValues();

		for (let i = 0; i < vals.length; i++) {
			console.log("*" + vals[i] + ":" + await GM.getValue(vals[i]));
>>>>>>> Stashed changes
		}
		console.log("*-----*");
	}

<<<<<<< Updated upstream
	for (var i = 0; i < vals.length; i++)
	{
		if (vals[i] === nameVal)
		{
			return true;
		}
	}

	if (optValue != undefined)
	{
		GM_setValue(nameVal, optValue);
		return true;
	} else
	{
		return false;
	}
}

//Delete Values
function DeleteValues(nameVal)
{
	var vals = [];
	for (var i = 0; i < GM_listValues().length; i++)
	{
		vals[i] = GM_listValues()[i];
	}

	if (vals.length === 0 || typeof nameVal != "string")
	{
		return;
	}

	switch (nameVal)
	{
		case "all":
			for (var i = 0; i < vals.length; i++)
			{
				GM_deleteValue(vals[i]);
			}
			break;
		case "old":
			for (var i = 0; i < vals.length; i++)
			{
				if (vals[i] === "debug" || vals[i] === "debugA")
				{
					GM_deleteValue(vals[i]);
				}
			}
			break;
		default:
			for (var i = 0; i < vals.length; i++)
			{
				if (vals[i] === nameVal)
				{
					GM_deleteValue(nameVal);
				}
			}
			break;
	}
}

//Construction of Deck
function Deck(question, answer, idTimeOne, idTimeTwo)
{
	this.question = [question];
	this.answer = [answer];
	this.idTimeOne = [idTimeOne];
	this.IdTimeTwo = [idTimeTwo];
}

function SetEventSettings()
{
	$("#awq_settings").click(function ()
	{
		$("#awq_settingsPanel").toggle(1000);
	});

	$("#hideButton").click(function ()
	{
		$("#awq_settingsPanel").toggle(1000);
	});

	$("#awq_debug").change(function ()
	{
		GM_setValue("awq_debug", $(this).prop("checked"));
		debug = $(this).prop("checked");
		alert("Settings has been changed. Please reload the page.");
	});
}

function SetEventsOnDecks(url)
{
	if (url.match(/http:\/\/ankiweb\.net\/decks/i) || url.match(/https:\/\/ankiweb\.net\/decks/i))
	{
		$("div.light-bottom-border > div:first-child > button").on("mousedown", function ()
		{
			lastIdChosen = this.id;
			GM_setValue("awq_lastIdChosen", lastIdChosen);
		});
	} else
	{
		return;
	}
}

function FindIndexes(searchStr, str, caseSensitive)
{
	var searchStrLen = searchStr.length;
	if (searchStrLen == 0) {
		return [];
	}
	var startIndex = 0, index, indices = [];
	if (!caseSensitive) {
		str = str.toLowerCase();
		searchStr = searchStr.toLowerCase();
	}
	while ((index = str.indexOf(searchStr, startIndex)) > -1) {
		indices.push(index);
		startIndex = index + searchStrLen;
	}
	return indices;
}

//css styles adds
function CssAdd()
{
	$("head").append($("<!--Start of AnkiWeb Quiz v" + GM_info.script.version + " CSS-->"));

	$("head").append($("<style type=text/css></style>").text("button.awq_btn { \
		 \
		}"));

	$("head").append($("<style type=text/css></style>").text("a.awq_settings { \
		cursor: pointer;\
		}"));

	$("head").append($("<style type=text/css></style>").text("div.awq_settingsP { \
		position:absolute; width:300px; background-color: #fff; border-color: #eee!important; border-radius: .3rem; border: 2px solid transparent; z-index: 150;\
		}"));

	$("head").append($("<style type=text/css></style>").text("button.awq_style { \
		cursor: pointer; color: #fff; background-color: #0275d8; border-color: #0275d8; padding: .75rem 1.5rem; font-size: 1rem; border-radius: .3rem; border: 1px solid transparent; max-width:200px; margin:5px;\
		}"));

	$("head").append($("<style type=text/css></style>").text("button.awq_style:hover { \
		cursor: pointer; color: #fff; background-color: #025aa5; border-color: #01549b; padding: .75rem 1.5rem; font-size: 1rem; border-radius: .3rem; border: 1px solid transparent;\
		}"));

	$("head").append($("<style type=text/css></style>").text("div.awq_rstyle { \
		width:100%; margin-top:30px; z-index: 100;\
		}"));

	$("head").append($("<style type=text/css></style>").text("button.awq_true { \
		background-color: #75d802; border-color: #75d802;\
		}"));

	$("head").append($("<style type=text/css></style>").text("button.awq_true:hover { \
		background-color: #5aa502; border-color: #5aa502;\
		}"));

	$("head").append($("<style type=text/css></style>").text("button.awq_false { \
		background-color: #d80275; border-color: #d80275;\
		}"));

	$("head").append($("<style type=text/css></style>").text("button.awq_false:hover { \
		background-color: #a5025a; border-color: #a5025a;\
		}"));

	$("head").append($("<!--End of AnkiWeb Quiz v" + GM_info.script.version + " CSS-->"));
}

//hHander for url
function UrlHandler(url)
{
	if (url.match(/http:\/\/ankiweb\.net\/study/i) || url.match(/https:\/\/ankiweb\.net\/study/i))
	{
		this.oldHash = window.location.pathname;
		this.Check;

		var that = this;
		var detect = function ()
		{
			if (that.oldHash != window.location.pathname)
			{
				that.oldHash = window.location.pathname;
				UpdateGMValue();
			}
		};
		this.Check = setInterval(function () { detect() }, 200);
	} else
	{
		return;
	}
}

function GetDeck(idDeck)
{
	var keyNames = Object.keys(decks);
	for (var i in keyNames)
	{
		if (idDeck == keyNames)
		{
			deck = decks[idDeck].cards;
		} else
		{
			decks[idDeck] =
			{
				cards: defaultDeck,
				updateDeck: false
			}
			deck = decks[idDeck].cards;
		}
	}
}

$(document).ready(function () {

	// Append some text to the element with id someText using the jQuery library.
	//$("#studynow").append(" more text...................");

	$("#studynow").click(function () {
		setTimeout(function ()
		{
			//var asd = std.currentCard;
			//console.log(asd[1]);
			//console.log($.trim(StripTags(asd[1].replace(/<style>[\s\S]*?<\/style>/ig, ''))));
			SetUI();
			searchFor = SearchQuestion();
			if (debug)
			{
				console.log("searchFor:" + searchFor);
			}
			GetTrueAnswer(searchFor);
			if (debug) {
				console.log('Study Click');
			}
		}, 1500);
	});

	function SetUI()
	{
		const buttonP = $("<button id=awq_quiz class=btn style=margin-left:4px></button>").text("Quiz");
		const button = $("<div class=awq_rstyle></div>").html("<button class=awq_btn></button><button class=awq_btn></button><button class=awq_btn></button><button class=awq_btn></button><button class=awq_btn></button><button class=awq_btn></button><button class=awq_btn></button><button class=awq_btn></button>");

		$(".pt-1").before("<br>");
		$(".pt-1").before(button);

		$("#leftStudyMenu").after(buttonP);

		SettingsEvents();

		$("#awq_quiz").addClass("btn-secondary");
		$(".awq_btn").addClass("awq_style");
		$(".awq_rstyle").hide();
	}

	function SettingsEvents()
	{

		$("#awq_quiz").click(function () {
			$(".awq_rstyle").toggle();
		});

		$("#ansbuta").click(function ()
		{
			setTimeout(function ()
			{
				if (debug)
				{
					console.log("Button check");
				}
				$("#ease1").click(function ()
				{
					OtherEvent();
				});
				$("#ease2").click(function ()
				{
					OtherEvent();
				});
				$("#ease3").click(function ()
				{
					OtherEvent();
				});
				$("#ease4").click(function ()
				{
					OtherEvent();
				});
			}, 500);
		});

		$(".awq_btn").click(function ()
		{
			if (debug)
			{
				if ($(this).attr("title"))
				{
					console.log("html:" + $(this).attr("title"));
					console.log("true:" + trueAnswer);
				} else
				{
					console.log("html:" + $(this).html());
					console.log("text:" + $(this).text());
					console.log("------------------------");
					console.log("true:" + trueAnswer);
					console.log("************************");
				}
			}

			if ($(this).attr("title"))
			{
				if (trueAnswer == $(this).attr("title"))
				{
					$(this).addClass("awq_true");
				} else
				{
					$(this).addClass("awq_false");
				}
			} else
			{
				if (trueAnswer == $(this).html() || trueAnswer == $(this).text())
				{
					$(this).addClass("awq_true");
				} else
				{
					$(this).addClass("awq_false");
				}
			}
		});
	}

	function EscapeRegExp(string)
	{
		return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	}

	function SearchQuestion()
	{
		if (debug)
		{
			console.log("span: ");
			console.log($("awq_question").has("span"));
		}
		if ($("awq_question").has("span").length >= 1)
		{
			var contentText = $("awq_question").contents().filter(function ()
			{
				return this.nodeType == 3;
			});

			var contentSpan = $("awq_question").contents().filter("span");

			if (debug)
			{
				console.log(contentText);
				console.log(contentSpan);
			}

			rubyVal = "";
			var x = 0;
			if (contentText >= contentSpan)
			{
				for (var i = 0; i < contentText.length; i++)
				{
					rubyVal += $.trim(contentText[i].nodeValue);
					if (x < contentSpan.length)
					{
						rubyVal += "<ruby><rb>";
						rubyVal += $.trim($(contentSpan[x]).contents().filter(function ()
						{
							return this.nodeType == 3;
						})[0].nodeValue) + "</rb><rt>";
						rubyVal += $(contentSpan[x]).contents()[0].innerHTML + "</rt></ruby>";
						x++;
					}
				}
			} else
			{
				for (var i = 0; i < contentSpan.length; i++)
				{
					if (x < contentText.length)
					{
						rubyVal += $.trim(contentText[x].nodeValue);
						x++;
					}
					rubyVal += "<ruby><rb>";
					rubyVal += $.trim($(contentSpan[i]).contents().filter(function ()
					{
						return this.nodeType == 3;
					})[0].nodeValue) + "</rb><rt>";
					rubyVal += $(contentSpan[i]).contents()[0].innerHTML + "</rt></ruby>";
				}
			}
			return rubyVal;
		} else
		{
			return $.trim($("awq_question").text());
		}
	}

	//Replace wrong <br>'s or other html tags, should work perfectly but it isn't >:( Fixed(probably)
	function ReplaceString(str)
	{
		var trueString = str;

		while (trueString.search("<br />") !== -1)
		{
			trueString = str.replace(/<br \/>/g, "<br>");
		}

		return trueString;
	}

	function GetTrueAnswer(sFor)
	{
		var regex = '(^|\\s|\\b|(n\\>))';
		var tempQuestion;
		var strQ;
		regex += EscapeRegExp(sFor);
		regex += '($|\\s|\\b|(\\<\\/a))';

		if (debug)
		{
			console.log(regex);
		}

		for (var i = 0; i < tempStrings.length; i++) {
			//console.log('sFor =' + sFor + " leng " + sFor.length + " debug : " + new RegExp(regex, "g").test(tempStrings[i]));
			//contains = tempStrings[i].matches(".*\\bram\\b.*");
			//tempQuestion = '';
			//strQ = '';
			//strQ = tempStrings[i].toString();
			//tempQuestion = $.trim(str.slice(str.indexOf("<awq_question>") + 14, str.indexOf("</awq_question>")));
			//console.log(tempQuestion);
			if (new RegExp(regex, "g").test(tempStrings[i]))
			{
				const str = tempStrings[i].toString();
				trueAnswer = ReplaceString($.trim(str.slice(str.indexOf(inBegAnswer) + 12, str.indexOf(inEndAnswer))));
				trueId = i;
				if (debug)
				{
					//console.log(tempStrings[i - 1]);
					console.log(str);
					//console.log(tempQuestion);
					//console.log(tempStrings[i + 1]);
					console.log("True answer : " + trueAnswer + " id trueAnsw = " + trueId);
				}
				GetFalseAnswers(trueId);
				break;
=======
	async Main() {
		if (globalThis.window.document.location.pathname.startsWith("/decks")) {
			let strs = globalThis.window.document.querySelectorAll("button.btn-link");
			for (let i = 0; i < strs.length; i++) {
				let _id = strs[i].id;

				//Console.WriteLine(_id);

				if (_id.startsWith("did")) {
					if (this._Decks[_id.substring(3)] == null)
						this._Decks[_id.substring(3)] = new Object();

					strs[i].addEventListener("click", () => {
						GM.setValue("awqDeckId", _id.substring(3));
					}, true);
				}
			}
			GM.setValue("awqDecks", this._Decks);
		}
		if (globalThis.window.document.location.pathname.startsWith("/study")) {
			this._DeckId = await GM.getValue("awqDeckId");
			if (this._DeckId == null) {
				console.log("Deck id is null");
				return;
			}

			let _study = globalThis.window.eval("study");
			console.log(_study);

			if (_study["currentCard"] == null) {
				globalThis.window.setTimeout(() => {
					this.Main();
				}, 1000);
				return;
>>>>>>> Stashed changes
			}

			let _id = _study["currentCard"]["cardId"];

			this._Decks[this._DeckId][_id] = _study["currentCard"];

			for (let i = 0; i < _study["cards"].length; i++) {
				_id = _study["cards"][i]["cardId"];
				this._Decks[this._DeckId][_id] = _study["cards"][i];
			}

			this.Qiuz(_study);

			GM.setValue("awqDecks", this._Decks);
		}
	}

<<<<<<< Updated upstream
	function GetFalseAnswers(trueId) {
		tempArr.length = 0;
		for (var i = 0; i < 7; i++) {
			id = GetRand(tempStrings);
			if (id != trueId) {
				if (debug) {
					console.log(tempStrings[id]);
				}
				const str = tempStrings[id].toString();
				falseAnswers[i] = str.slice(str.indexOf(inBegAnswer) + 12, str.indexOf(inEndAnswer));
				if (debug) {
					console.log("***False answer " + i + " : " + falseAnswers[i] + " id: " + id);
					//console.log("inBegAnswer: " + str.indexOf(inBegAnswer) + " : " + str.indexOf(inEndAnswer) + " inEndAnswer");
=======
	Qiuz(study) {
		let cardsId = new Array();

		cardsId.push(study["currentCard"]["cardId"]);

		let keys = Object.keys(this._Decks[this._DeckId]);

		let len = 11;
		if (len >= keys.length) {
			len = keys.length - 1;
		}

		for (let i = 0; i < len; i++) {
			let _randomInt = this.GetRandomInt(keys.length);
			let _id = keys[_randomInt];
			let _continue = false;

			for (let j = 0; j < cardsId.length; j++) {
				if (_id == cardsId[j]) {
					i--;
					_continue = true;
					break;
>>>>>>> Stashed changes
				}
			} else {
				id = GetRand(tempStrings);
				i--;
			}
			if (_continue)
				continue;
			else
				cardsId.push(_id);
		}
		//Console.WriteLine(cardsId);

<<<<<<< Updated upstream
	function OtherEvent()
	{
		if (debug) {
			console.log("Button click");
			console.log("---------------");
		}
		searchFor = "";
		//searchFor = $("awq_question").html();
		searchFor = SearchQuestion();
		if (debug) {
			console.log("searchFor:" + searchFor);
			console.log($("awq").text().length);
		}
		$(".awq_rstyle").hide();
		if (searchFor == "") {
			setTimeout(function () {
				if ($("awq").text().length === 0) {
					setTimeout(function () {
						//searchFor = $("awq_question").html();
						searchFor = SearchQuestion();
						if (debug) {
							console.log("searchFor:::" + searchFor);
						}
						GetTrueAnswer(searchFor);
					}, 3000);
				} else {
					//searchFor = $("awq_question").html();
					searchFor = SearchQuestion();
					if (debug) {
						console.log("searchFor::" + searchFor);
					}
					GetTrueAnswer(searchFor);
				}
			}, 1000);
		} else {
			GetTrueAnswer(searchFor);
		}
	}

	//random functions
	function InArray(array, el) {
		for (var i = 0 ; i < array.length; i++)
			if (array[i] == el) return true;
		return false;
	}

	function GetRand(array) {
		var rand = Math.floor(Math.random() * array.length);
		if (!InArray(tempArr, rand)) {
			tempArr.push(rand);
			return rand;
		}
		return GetRand(array);
	}
	//end of random functions

	function RamdomButton()
	{
		buttons.length = 0;
		tempArr.length = 0;
		var allAnswers = [];
		allAnswers[0] = trueAnswer;
		for (var i = 1; i <= falseAnswers.length; i++) {
			allAnswers[i] = falseAnswers[i - 1];
		}
		if (debug) {
			console.log("False answers :");
			console.log(falseAnswers);
			console.log("ALL answers :");
			console.log(allAnswers);
		}
		for (var i = 0; i < allAnswers.length; i++) {
			buttons[i] = $.trim(allAnswers[GetRand(allAnswers)]);
		}
		if (debug) {
			console.log("Random order :) = " + buttons);
			// console.log($(".awq_LeftSide").html());
		}
		UiButtons();
	}

	function UiButtons()
	{
		const sel = document.querySelectorAll("button.awq_btn");
		if (debug)
		{
			console.log("*HERE UI BUTTONS :");
		}

		for (var i = 0; i < buttons.length; i++)
		{
			//Delete arttribute
			if ($(sel[i]).attr("title"))
			{
				$(sel[i]).removeAttr("title");
			}

			if (buttons[i].length <= 40 || buttons[i].includes("</ruby>"))
			{
				$(sel[i]).html(buttons[i]);
			} else
			{
				$(sel[i]).html(buttons[i].slice(0, 40) + "...");
				$(sel[i]).attr("title", buttons[i]);
			}
			
			if (debug)
			{
				//console.log(sel[i]);
				console.log(buttons[i] + " Length: " + buttons[i].length);
				console.log(buttons[i].includes("</ruby>"));
			}
		}

		CheckPresedButtons();
	}

	function CheckPresedButtons()
	{ 
		$(".awq_btn").removeClass("awq_true");
		$(".awq_btn").removeClass("awq_false");
	}

	console.log("AnkiWeb Quiz v" + GM_info.script.version + " Initialized"); 
});

function StripTags(string)
{
	return string.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?(\/)?>|<\/\w+>/gi, '');
}

// ------------
//  TODO
// ------------

/* TODO STARTS
	0)REWRITE EVERYTHING WITHOUT USING GETRESOURCE AND CHANGING CODE
✓    1)Make it only one element of buttons  //DONE 0.0.9
		1.1)Increase numbers of buttons to 10-12(optional through settings???)
✓    2)Make it limit of length answer and put whole in attribute title  //DONE 0.1.0
✓    3)Make it settings, almost done in 0.1.0	//DONE 0.2.0
✓        3.1)Debug   //DONE 0.1.0 
		3.2)Add txt file ***RESEARCH NEEDED***
			3.2.1)Choose them
		3.3)Make it always show quiz
✓    4)Make it full functionality of Japanese deck, partial done in 0.0.8    //DONE 0.0.9 Happy with that :)
	5)Search question in between tags <awq_question> and </awq_question> not in whole sentence, almost done in 0.1.2
✓    6)TODO for loop in finding question NEED TEST IT    //DONE 0.1.7 BROKEN     //DONE 0.1.9
TODO ENDS */
=======
		cardsId = this.Shuffle(cardsId);

		let before = globalThis.window.document.querySelector("#qa_box");
		let divGrid = globalThis.window.document.createElement("div");
		divGrid.classList.add("awq_quizGrid");

		before.parentNode.insertBefore(divGrid, before);

		let answer = globalThis.window.document.querySelector("#ansbuta");
		if (!answer.classList.contains("awqEvent")) {
			answer.classList.add("awqEvent");
			answer.addEventListener("click", () => {
				let eases = globalThis.window.document.querySelectorAll("#easebuts button");

				//Console.WriteLine(eases);
				for (let i = 0; i < eases.length; i++) {
					if (eases[i].classList.contains("awqEvent"))
						continue;

					eases[i].classList.add("awqEvent");
					eases[i].addEventListener("click", () => {
						this.AddEventsForEases();
					}, false);
				}
			}, false);
		}

		for (let i = 0; i < cardsId.length; i++) {
			let div = globalThis.window.document.createElement("div");
			div.classList.add("awq_quizButton");
			div.id = cardsId[i];

			div.addEventListener("click", (e) => {
				let _id = e.currentTarget.id;
				console.log(_id);

				let _button = globalThis.window.document.querySelector("#ansbuta");
				_button.click();

				let _eases = globalThis.window.document.querySelectorAll("#easebuts button");

				//Console.WriteLine(_eases);
				for (let i = 0; i < _eases.length; i++) {
					if (_eases[i].classList.contains("awqEvent"))
						continue;

					_eases[i].classList.add("awqEvent");
					_eases[i].addEventListener("click", () => {
						this.AddEventsForEases();
					}, false);
				}

				if (_id == study["currentCard"]["cardId"]) {
					div.classList.add("awq_true");
					div.classList.add("awq_trueBorder");

					_eases[1].classList.add("awq_trueBorder");
				}
				else {
					div.classList.add("awq_false");
					div.classList.add("awq_falseBorder");

					_eases[0].classList.add("awq_falseBorder");
				}
			}, false);

			let html = this._Decks[this._DeckId][cardsId[i]]["answer"].replace(this._Decks[this._DeckId][cardsId[i]]["question"], "").replace("\n\n<hr id=answer>\n\n", "").replace("<img", "<img width=\"100%\"");

			div.insertAdjacentHTML("beforeend", html);

			divGrid.append(div);
		}
	}

	AddEventsForEases() {
		let _grid = globalThis.window.document.querySelector(".awq_quizGrid");
		_grid.remove();
		this.Main();
	}

	GetRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	Shuffle(array) {
		for (let i = array.length - 1; i > 0; i--) {
			let _i = i + 1;
			let j = Math.floor(Math.random() * _i);
			let temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}

		return array;
	}
}

let awq;

window.onload = function () {
	awq = new AnkiWebQuiz();

	setTimeout(() => {
		awq.Main();
		console.log(awq);
	}, 1000);
};
>>>>>>> Stashed changes
