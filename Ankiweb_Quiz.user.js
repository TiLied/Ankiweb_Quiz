// ==UserScript==
// @name        AnkiWeb Quiz
// @namespace   https://greasyfork.org/users/102866
// @description Shows quiz
// @include     https://ankiweb.net/*
// @include     http://ankiweb.net/*
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @author      TiLied
// @version     0.0.4
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @resource    ankiDeck https://raw.githubusercontent.com/TiLied/hello-world/master/test/test4.txt
// ==/UserScript==

var originAnkiDeck = GM_getResourceText("ankiDeck");
var stringArray = [];
var tempStrings = [];
var searchFor;
var trueAnswer;
var falseAnswers = [];
var inB = [];
var inE = [];
var inBstring = "<awq>";
var inEstring = "</awq>";
var inBegAnswer = "<awq_answer>";
var inEndAnswer = "</awq_answer>";
var trueId, id;
var buttons = [];
var tempArr = [];

Main();

function Main()
{
    //stringArray = $.makeArray(originAnkiDeck);
    //console.log(stringArray);

    inB = findIndexes(inBstring, originAnkiDeck);
    inE = findIndexes(inEstring, originAnkiDeck);
    console.log(inB);
    console.log(inE);

    for (var i = 0; i < inB.length; i++)
    {
        tempStrings[i] = originAnkiDeck.slice(inB[i] + 5, inE[i]);
        //console.log(tempStrings[i]);
    }
    console.log(tempStrings);
}

function findIndexes(searchStr, str, caseSensitive)
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


$(document).ready(function () {

    // Append some text to the element with id someText using the jQuery library.
    //$("#studynow").append(" more text...................");

    $("#studynow").click(function () {
        setTimeout(function ()
        {
            console.log($("awq").text());
            searchFor = $("awq").text();
            getTrueAnswer(searchFor);
            //alert("Settings has been changed. Now brackets hiding.");
            console.log('Study Click');
            console.log(searchFor);
            //return $("awq").text();
        }, 1000);
        //searchFor = question();
        //getTrueAnswer($("awq").text());
        //alert("Settings has been changed. Now brackets hiding.");
        //console.log('Study Click');
        //console.log(searchFor);
    });

    function question()
    {
        //setTimeout(function () { console.log($("awq").text()); return $("awq").text(); }, 1000);
        //console.log($("#qa").html());
        //return $("awq").text();
    }

    function getTrueAnswer(sFor) {
        for (var i = 0; i < tempStrings.length; i++) {
            //console.log('sFor =' + sFor + "leng " + sFor.length + " debug : " + tempStrings[i].includes(sFor));
            if (tempStrings[i].includes(sFor)) {
                const str = tempStrings[i].toString();
                trueAnswer = str.slice(str.indexOf(inBegAnswer) + 12, str.indexOf(inEndAnswer));
                trueId = i;
                console.log("True answer : " + trueAnswer + " id trueAnsw = " + trueId);
                getFalseAnswers(trueId);
                break;
            }
        }
    }

    function getFalseAnswers(trueId) {
        tempArr.length = 0;
        for (var i = 0; i < 7; i++) {
            id = get_rand(tempStrings);
            if (id != trueId) {
                console.log(tempStrings[id]);
                const str = tempStrings[id].toString();
                falseAnswers[i] = str.slice(str.indexOf(inBegAnswer) + 12, str.indexOf(inEndAnswer));
                console.log("***False answer " + i + " : " + falseAnswers[i] + " id: " + id);
                //console.log("inBegAnswer: " + str.indexOf(inBegAnswer) + " : " + str.indexOf(inEndAnswer) + " inEndAnswer");
            } else {
                id = get_rand(tempStrings);
                i--;
            }
        }
        ramdomButton();
        buttonsEvent();
    }

    function buttonsEvent()
    {
        $("#ansbuta").click(function () {
            setTimeout(function () {
                console.log("Button check");
                $("#ease1").click(function () {
                    otherEvent();
                });
                $("#ease2").click(function () {
                    otherEvent();
                });
                $("#ease3").click(function () {
                    otherEvent();
                });
                $("#ease4").click(function () {
                    otherEvent();
                });
            }, 500);
        });
    }

    function otherEvent()
    {
        console.log("Button click");
        console.log($("awq").text());
        searchFor = $("awq").text();
        $(".awq_rstyle").remove();
        getTrueAnswer(searchFor);
    }

    //random functions
    function in_array(array, el) {
        for (var i = 0 ; i < array.length; i++)
            if (array[i] == el) return true;
        return false;
    }

    function get_rand(array) {
        var rand = Math.floor(Math.random() * array.length);
        if (!in_array(tempArr, rand)) {
            tempArr.push(rand);
            return rand;
        }
        return get_rand(array);
    }
    //end of random functions

    function ramdomButton()
    {
        tempArr.length = 0;
        var allAnswers = [];
        allAnswers[0] = trueAnswer;
        for (var i = 1; i <= falseAnswers.length; i++) {
            allAnswers[i] = falseAnswers[i - 1];
        }
        console.log(falseAnswers);
        console.log(allAnswers);
        for (var i = 0; i < allAnswers.length; i++) {
            buttons[i] = allAnswers[get_rand(allAnswers)];
        }
        console.log("Random oeder :) = " + buttons);
        // console.log($(".awq_LeftSide").html());

        uiButtons();
    }

    function uiButtons()
    {
        $("head").append($("<style type=text/css></style>").text("button.awq_LeftSide { \
        float:left;  \
        }"));

        $("head").append($("<style type=text/css></style>").text("button.awq_RightSide { \
        float:right;  \
        }"));

        $("head").append($("<style type=text/css></style>").text("button.awq_style { \
        cursor: pointer; color: #fff; background-color: #0275d8; border-color: #0275d8; padding: .75rem 1.5rem; font-size: 1rem; border-radius: .3rem; border: 1px solid transparent;\
        }"));

        $("head").append($("<style type=text/css></style>").text("button.awq_style:hover { \
        cursor: pointer; color: #fff; background-color: #025aa5; border-color: #01549b; padding: .75rem 1.5rem; font-size: 1rem; border-radius: .3rem; border: 1px solid transparent;\
        }"));

        $("head").append($("<style type=text/css></style>").text("div.awq_rstyle { \
        width:500px; margin-top:30px;\
        }"));

        const buttonL = $("<div class=awq_rstyle style=float:left></div>").html("<button class=awq_LeftSide>" + buttons[0] + "</button><button class=awq_LeftSide>" + buttons[1] + "</button><button class=awq_LeftSide>" + buttons[2] + "</button><button class=awq_LeftSide>" + buttons[3] + "</button>");
        const buttonR = $("<div class=awq_rstyle style=float:right></div>").html("<button class=awq_RightSide>" + buttons[4] + "</button><button class=awq_RightSide>" + buttons[5] + "</button><button class=awq_RightSide>" + buttons[6] + "</button><button class=awq_RightSide>" + buttons[7] + "</button>");
        $("#qa_box").before(buttonL);
        $("#qa_box").before(buttonR);
        $(".awq_LeftSide").addClass("awq_style");
        $(".awq_RightSide").addClass("awq_style");
        checkPresedButtons();
    }

    function checkPresedButtons()
    { 
        $("head").append($("<style type=text/css></style>").text("button.awq_true { \
        background-color: green; border-color: green;\
        }"));

        $(".awq_LeftSide, .awq_RightSide").removeClass("awq_true");

        $(".awq_LeftSide, .awq_RightSide").click(function ()
        {
            if (trueAnswer == $(this).text())
            {
                $(this).addClass("awq_true");
            }
        });
    }

    console.log("AnkiWeb Quiz v" + GM_info.script.version + " Initialized"); 
});
