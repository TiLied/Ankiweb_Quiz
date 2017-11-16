// ==UserScript==
// @name        AnkiWeb Quiz
// @namespace   https://greasyfork.org/users/102866
// @description Shows quiz on ankiweb
// @include     https://ankiweb.net/*
// @include     http://ankiweb.net/*
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @author      TiLied
// @version     1.2.3
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant       GM.listValues
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// ==/UserScript==

//not empty val
var std = window.eval("require('study').default;"),
	defaultDeck = new Deck("question default", "answer default", 10001, 20002),
	defaultDecks =
		{
			defaultId: new Decks(defaultDeck)
		}

//const
const inBstring = "<awq>",
	inEstring = "</awq>",
	inBegAnswer = "<awq_answer>",
	inEndAnswer = "</awq_answer>",
	textDefault = "You need to use this deck more to get more variations";

//arrays
var stringArray = [],
	tempStrings = [],
	falseAnswers = [],
	inB = [],
	inE = [],
	buttons = [],
	tempArr = [];

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

void function Main()
{
	//Place CSS in head
	CssAdd();
	//Set settings or create
	SetSettings();
	//Set event on decks page
	SetEventsOnDecks(document.URL);
}();

//Settings
function SetSettings()
{
	const settings = $("<li class=nav-item></li>").html("<a id=awq_settings class=nav-link>Settings Ankiweb Quiz " + GM.info.script.version + "</a> \
	<div id=awq_settingsPanel class=awq_settingsP>\
	<form> \
	<br> \
	Amount Buttons(4-20):<input type=number name=amountBtn id=awq_amountBtn min=4 max=20 value=4></input><br> \
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

async function LoadSettings()
{

	DeleteValues("old");

	//THIS IS ABOUT DEBUG
	if (await HasValue("awq_debug", false))
	{
		debug = await GM.getValue("awq_debug");
		$("#awq_debug").prop("checked", debug);
	}

	//THIS IS ABOUT DECKS
	if (await HasValue("awq_decks", JSON.stringify(defaultDecks)))
	{
		decks = JSON.parse(await GM.getValue("awq_decks"));
		//console.log(decks);
	}

	//THIS IS ABOUT lastIdChosen
	if (await HasValue("awq_lastIdChosen", 000))
	{
		lastIdChosen = await GM.getValue("awq_lastIdChosen");
		GetDeck(lastIdChosen);
	}

	//THIS IS ABOUT BUTTONS
	if (await HasValue("awq_amountButtons", 8))
	{
		amountButtons = await GM.getValue("awq_amountButtons");
		$("#awq_amountBtn").prop("value", amountButtons);
	}

	//Console log prefs with value
	console.log("*prefs:");
	console.log("*-----*");
	var vals = await GM.listValues();

	for (var i = 0; i < vals.length; i++)
	{
		console.log("*" + vals[i] + ":" + await GM.getValue(vals[i]));
	}
	console.log("*-----*");
}

//Check if value exists or not.  optValue = Optional
async function HasValue(nameVal, optValue)
{
	var vals = await GM.listValues();

	if (vals.length === 0)
	{
		if (optValue != undefined)
		{
			GM.setValue(nameVal, optValue);
			return true;
		} else
		{
			return false;
		}
	}

	for (var i = 0; i < vals.length; i++)
	{
		if (vals[i] === nameVal)
		{
			return true;
		}
	}

	if (optValue != undefined)
	{
		GM.setValue(nameVal, optValue);
		return true;
	} else
	{
		return false;
	}
}

//Delete Values
async function DeleteValues(nameVal)
{
	var vals = await GM.listValues();

	if (vals.length === 0 || typeof nameVal != "string")
	{
		return;
	}

	switch (nameVal)
	{
		case "all":
			for (var i = 0; i < vals.length; i++)
			{
				GM.deleteValue(vals[i]);
			}
			break;
		case "old":
			for (var i = 0; i < vals.length; i++)
			{
				if (vals[i] === "debug" || vals[i] === "debugA" || vals[i] === "awq_amountBtn")
				{
					GM.deleteValue(vals[i]);
				}
			}
			break;
		default:
			for (var i = 0; i < vals.length; i++)
			{
				if (vals[i] === nameVal)
				{
					GM.deleteValue(nameVal);
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
	this.idTimeTwo = [idTimeTwo];
}

//Construction of Decks
function Decks(cards)
{
	this.cards = cards;
	this.updateDeck = false;
	this.firstTime = true;
	this.customSettings = {};
};

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
		GM.setValue("awq_debug", $(this).prop("checked"));
		debug = $(this).prop("checked");
		alert("Settings has been changed. Please reload the page.");
	});

	$("#awq_amountBtn").change(function ()
	{
		GM.setValue("awq_amountButtons", $(this).prop("value"));
		amountButtons = $(this).prop("value");
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
			GM.setValue("awq_lastIdChosen", lastIdChosen);
		});
	} else
	{
		return;
	}
}

function SetEventsOnStudy(url)
{
	if (url.match(/http:\/\/ankiweb\.net\/study/i) || url.match(/https:\/\/ankiweb\.net\/study/i))
	{
		$("#leftStudyMenu a:first-child").on("mouseover", function ()
		{
			try
			{
				UpdateGMDecks();
				console.log("UpdateGM");
			} catch (e) { console.log(e); }
		});
	} else
	{
		return;
	}
}

function FindIndexes(searchStr, str, caseSensitive)
{
	var searchStrLen = searchStr.length;
	if (searchStrLen == 0)
	{
		return [];
	}
	var startIndex = 0, index, indices = [];
	if (!caseSensitive)
	{
		str = str.toLowerCase();
		searchStr = searchStr.toLowerCase();
	}
	while ((index = str.indexOf(searchStr, startIndex)) > -1)
	{
		indices.push(index);
		startIndex = index + searchStrLen;
	}
	return indices;
}

//css styles adds
function CssAdd()
{
	$("head").append($("<!--Start of AnkiWeb Quiz v" + GM.info.script.version + " CSS-->"));

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

	$("head").append($("<style type=text/css></style>").text("button.awq_first { \
	background-color: #000; border-color: #000;\
	}"));

	$("head").append($("<style type=text/css></style>").text("button.awq_false:hover { \
	background-color: #a5025a; border-color: #a5025a;\
	}"));

	$("head").append($("<!--End of AnkiWeb Quiz v" + GM.info.script.version + " CSS-->"));
}

function GetDeck(idDeck)
{
	var keyNames = Object.keys(decks);
	for (var i in keyNames)
	{
		if (idDeck == keyNames[i])
		{
			deck = decks[idDeck].cards;
			return;
		}
	}

	if (deck == undefined)
	{
		decks[idDeck] = new Decks(defaultDeck);
		deck = decks[idDeck].cards;
		return;
	}
}

//THIS FUNC FOR UPDATING Greasemonkey value JSON OBJECT
function UpdateGMDecks()
{
	try
	{
		if (deck["answer"].length < amountButtons)
		{
			decks[lastIdChosen].firstTime = true;
		}

		var gmDecks = JSON.stringify(decks);
		GM.setValue("awq_decks", gmDecks);
	}
	catch (e)
	{
		console.log(e);
	}
}

$(document).ready(function ()
{

	// Append some text to the element with id someText using the jQuery library.
	//$("#studynow").append(" more text...................");
	$("#studynow").click(function ()
	{
		setTimeout(function ()
		{
			SetUI();
			SetEventsOnStudy(document.URL);
			if (decks[lastIdChosen].firstTime == true)
			{
				FirstTimeDeck(std.currentCard, std["deck"].cards);
			} else
			{
				var question = $.trim(StripNewLines(StripTags(std.currentCard[1].replace(/<style>[\s\S]*?<\/style>/ig, '')))),
					answer = $.trim(StripNewLines(StripTags(std.currentCard[2].replace(/[\s\S]*?(<hr id=answer>)/ig, '').replace(/<style>[\s\S]*?<\/style>/ig, '')))),
					idTimeOne = std.currentCard[0],
					idTimeTwo = std.currentCard[4];
				UpdateDeck(question, answer, idTimeOne, idTimeTwo);
			}
			//searchFor = SearchQuestion();
			if (debug)
			{
				console.log(std);
				console.log("---");
				//console.log($.trim(StripNewLines(StripTags(asd[1].replace(/<style>[\s\S]*?<\/style>/ig, '')))));
				//console.log($.trim(StripNewLines(StripTags(asd[2].replace(/[\s\S]*?(<hr id=answer>)/ig, '').replace(/<style>[\s\S]*?<\/style>/ig, '')))));
				console.log("---");
				//console.log("FirstTime:" + decks[lastIdChosen].firstTime);
				console.log(decks);
				console.log($.trim($("#rightStudyMenu").text()).split("+"));
				//console.log("searchFor:" + searchFor);
			}
			//GetTrueAnswer(searchFor);
			GetTrueAnswerU(std.currentCard[0], std.currentCard[4]);
			if (debug)
			{
				console.log('Study Click');
			}
		}, 1500);
	});

	function NumberOfButtons()
	{
		var buttons = "";
		for (var i = 0; i < amountButtons; i++)
		{
			buttons += "<button class=awq_btn></button>";
		}
		return buttons;
	}

	//THIS FUNC FOR FIRST TIME USING DECK AFteR INSTALL SCRIPT
	function FirstTimeDeck(currentCard, nextCards)
	{
		var questions = [$.trim(StripNewLines(StripTags(currentCard[1].replace(/<style>[\s\S]*?<\/style>/ig, ''))))],
			answers = [$.trim(StripNewLines(StripTags(currentCard[2].replace(/[\s\S]*?(<hr id=answer>)/ig, '').replace(/<style>[\s\S]*?<\/style>/ig, ''))))],
			idTimeOnes = [currentCard[0]],
			idTimeTwos = [currentCard[4]];

		for (var i = 0; i < nextCards.length; i++)
		{
			questions.push($.trim(StripNewLines(StripTags(nextCards[i][1].replace(/<style>[\s\S]*?<\/style>/ig, '')))));
			answers.push($.trim(StripNewLines(StripTags(nextCards[i][2].replace(/[\s\S]*?(<hr id=answer>)/ig, '').replace(/<style>[\s\S]*?<\/style>/ig, '')))));
			idTimeOnes.push(nextCards[i][0]);
			idTimeTwos.push(nextCards[i][4]);
		}

		for (var i = 0; i < questions.length; i++)
		{
			UpdateDeck(questions[i], answers[i], idTimeOnes[i], idTimeTwos[i]);
		}

		decks[lastIdChosen].firstTime = false;
	}

	//THIS FUNC FOR UPDATING DECK OBJECT
	function UpdateDeck(question, answer, idTimeOne, idTimeTwo)
	{
		//TODO FORCE UPDATE
		if (question.length >= 350)
		{
			question = "CARD TOO LONG: " + question.slice(0, 350);
		}

		if (answer.length >= 350)
		{
			answer = "CARD TOO LONG: " + answer.slice(0, 350);
		}

		//CHECK FOR REPEAT
		for (var i = 0; i < deck["idTimeOne"].length; i++)
		{
			if (idTimeOne === deck["idTimeOne"][i] && idTimeTwo === deck["idTimeTwo"][i])
			{
				return;
			}
		}

		//First time deck detected(delete default card)
		if (deck["idTimeOne"][0] === 10001 && deck["idTimeTwo"][0] === 20002)
		{
			deck["question"][0] = question;
			deck["answer"][0] = answer;
			deck["idTimeOne"][0] = idTimeOne;
			deck["idTimeTwo"][0] = idTimeTwo;
		} else
		{
			deck["question"].push(question);
			deck["answer"].push(answer);
			deck["idTimeOne"].push(idTimeOne);
			deck["idTimeTwo"].push(idTimeTwo);
		}
	}

	function SetUI()
	{
		const buttonP = $("<button id=awq_quiz class=btn style=margin-left:4px></button>").text("Quiz");
		const button = $("<div class=awq_rstyle></div>").html(NumberOfButtons());

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

		$("#awq_quiz").click(function ()
		{
			$(".awq_rstyle").toggle();
		});

		$("#ansbuta").click(function ()
		{
			CheckStatus($.trim($("#rightStudyMenu").text()).split("+"));
			setTimeout(function ()
			{
				if (debug)
				{
					console.log("Button check");
				}
				$("#ease1").click(function ()
				{
					OtherEventU();
					//OtherEvent();
				});
				$("#ease2").click(function ()
				{
					OtherEventU();
					//OtherEvent();
				});
				$("#ease3").click(function ()
				{
					OtherEventU();
					//OtherEvent();
				});
				$("#ease4").click(function ()
				{
					OtherEventU();
					//OtherEvent();
				});
			}, 250);
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

	function CheckStatus(statusArr)
	{
		var one = parseInt(statusArr[0]),
			two = parseInt(statusArr[1]),
			tree = parseInt(statusArr[2]);
		if (debug)
		{
			console.log(one);
			console.log(two);
			console.log(tree);
		}
		if ((one + two + tree) === 0)
		{
			UpdateGMDecks();
		} else
		{
			return;
		}
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

	function GetTrueAnswerU(idOne, idTwo)
	{
		for (var i = 0; i < deck["idTimeOne"].length; i++)
		{
			if (idOne === deck["idTimeOne"][i] && idTwo === deck["idTimeTwo"][i])
			{
				trueAnswer = deck["answer"][i];
				trueId = i;
				GetFalseAnswersU(trueId);
				return;
			}
		}
	}

	function GetFalseAnswersU(trueId)
	{
		tempArr.length = 0;
		if (deck["answer"].length <= amountButtons)
		{
			var temp = [];
			temp = temp.concat(deck["answer"]);
			if (debug)
			{
				console.log(temp);
			}
			for (var i = 0; i < (amountButtons - (deck["answer"].length - 1)); i++)
			{
				temp.push(textDefault);
			}
			if (debug)
			{
				console.log(temp);
			}
		}
		for (var i = 0; i < (amountButtons - 1); i++)
		{
			if (deck["answer"].length > amountButtons)
			{
				id = GetRand(deck["answer"]);
				if (id != trueId)
				{
					if (debug)
					{
						console.log(deck["answer"][id]);
					}
					falseAnswers[i] = deck["answer"][id];
					if (debug)
					{
						console.log("***False answer " + i + " : " + falseAnswers[i] + " id: " + id);
						//console.log("inBegAnswer: " + str.indexOf(inBegAnswer) + " : " + str.indexOf(inEndAnswer) + " inEndAnswer");
					}
				} else if (id === 0 || id === trueId)
				{
					id = GetRand(deck["answer"]);
					i--;
				}
			} else
			{
				id = GetRand(temp);
				if (id != trueId)
				{
					if (debug)
					{
						console.log(temp[id]);
					}
					falseAnswers[i] = temp[id];
					if (debug)
					{
						console.log("***False answer " + i + " : " + falseAnswers[i] + " id: " + id);
						//console.log("inBegAnswer: " + str.indexOf(inBegAnswer) + " : " + str.indexOf(inEndAnswer) + " inEndAnswer");
					}
				} else
				{
					id = GetRand(temp);
					i--;
				}
			}
		}
		RamdomButton();
	}

	function OtherEventU()
	{
		if (debug)
		{
			console.log("Button click");
			console.log("---------------");
			//console.log(std.currentCard);
			//console.log($("awq").text().length);
		}

		//event on Edit button
		SetEventsOnStudy(document.URL);

		$(".awq_rstyle").hide();
		$(".awq_btn").removeClass("awq_first");
		if (std.currentCard == undefined)
		{
			setTimeout(function ()
			{
				if (std.currentCard == undefined)
				{
					setTimeout(function ()
					{
						var question = $.trim(StripNewLines(StripTags(std.currentCard[1].replace(/<style>[\s\S]*?<\/style>/ig, '')))),
							answer = $.trim(StripNewLines(StripTags(std.currentCard[2].replace(/[\s\S]*?(<hr id=answer>)/ig, '').replace(/<style>[\s\S]*?<\/style>/ig, '')))),
							idTimeOne = std.currentCard[0],
							idTimeTwo = std.currentCard[4];
						UpdateDeck(question, answer, idTimeOne, idTimeTwo);
						GetTrueAnswerU(idTimeOne, idTimeTwo);
					}, 3000);
				} else
				{
					var question = $.trim(StripNewLines(StripTags(std.currentCard[1].replace(/<style>[\s\S]*?<\/style>/ig, '')))),
						answer = $.trim(StripNewLines(StripTags(std.currentCard[2].replace(/[\s\S]*?(<hr id=answer>)/ig, '').replace(/<style>[\s\S]*?<\/style>/ig, '')))),
						idTimeOne = std.currentCard[0],
						idTimeTwo = std.currentCard[4];
					UpdateDeck(question, answer, idTimeOne, idTimeTwo);
					GetTrueAnswerU(idTimeOne, idTimeTwo);
				}
			}, 1000);
		} else
		{
			var question = $.trim(StripNewLines(StripTags(std.currentCard[1].replace(/<style>[\s\S]*?<\/style>/ig, '')))),
				answer = $.trim(StripNewLines(StripTags(std.currentCard[2].replace(/[\s\S]*?(<hr id=answer>)/ig, '').replace(/<style>[\s\S]*?<\/style>/ig, '')))),
				idTimeOne = std.currentCard[0],
				idTimeTwo = std.currentCard[4];
			UpdateDeck(question, answer, idTimeOne, idTimeTwo);
			GetTrueAnswerU(idTimeOne, idTimeTwo);
		}
	}

	//
	//random functions
	function InArray(array, el)
	{
		for (var i = 0; i < array.length; i++)
			if (array[i] == el) return true;
		return false;
	}

	function GetRand(array)
	{
		var rand = Math.floor(Math.random() * array.length);
		if (!InArray(tempArr, rand))
		{
			tempArr.push(rand);
			return rand;
		}
		return GetRand(array);
	}
	//end of random functions
	//

	function RamdomButton()
	{
		var allAnswers = [];
		buttons.length = 0;
		tempArr.length = 0;
		allAnswers[0] = trueAnswer;
		for (var i = 1; i <= falseAnswers.length; i++)
		{
			allAnswers[i] = falseAnswers[i - 1];
		}
		if (debug)
		{
			console.log("False answers :");
			console.log(falseAnswers);
			console.log("ALL answers :");
			console.log(allAnswers);
		}
		for (var i = 0; i < allAnswers.length; i++)
		{
			buttons[i] = $.trim(allAnswers[GetRand(allAnswers)]);
		}
		if (debug)
		{
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

				//change color of button with textDefault
				if ($(sel[i]).attr("title") == textDefault)
				{
					$(sel[i]).addClass("awq_first");
				}
			}

			if (debug)
			{
				//console.log($(sel[i]).attr("title"));
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
		//$(".awq_btn").removeClass("awq_first");
	}

	console.log("AnkiWeb Quiz v" + GM.info.script.version + " initialization");
});

function StripTags(string)
{
	return string.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?(\/)?>|<\/\w+>/gi, '');
}

function StripNewLines(string)
{
	return string.replace(/(^[\r\n]*|[\r\n]+)[\s\t]*[\r\n]+/gi, '\n');
}
// ------------
//  TODO
// ------------

/* TODO STARTS
✓	  0)REWRITE EVERYTHING WITHOUT USING GETRESOURCE AND CHANGING CODE	//DONE 1.0.0
		0.1)Make custom settings
		0.2)Make force update deck (Because once you updated card, in gm_value will be old version of card)
✓    1)Make it only one element of buttons  //DONE 0.0.9
✓		1.1)Increase numbers of buttons to 10-12(optional through settings???)	//DONE 1.1.0
✓    2)Make it limit of length answer and put whole in attribute title  //DONE 0.1.0
✓    3)Make it settings, almost done in 0.1.0	//DONE 0.2.0
✓        3.1)Debug   //DONE 0.1.0 
		3.2)Add txt file ***RESEARCH NEEDED***
			3.2.1)Choose them
		3.3)Make it always show quiz
✓    4)Make it full functionality of Japanese deck, partial done in 0.0.8    //DONE 0.0.9 Happy with that :)
	5)Search question in between tags <awq_question> and </awq_question> not in whole sentence, almost done in 0.1.2
✓    6)TODO for loop in finding question NEED TEST IT    //DONE 0.1.7 BROKEN     //DONE 0.1.9
✓	 7)Support GM4+, GM3 and other userscript extensions, beta 1.2.0	//DONE 1.2.3
	 7.1)DELETE CALLBACK!!!
TODO ENDS */
