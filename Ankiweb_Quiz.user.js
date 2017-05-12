// ==UserScript==
// @name        AnkiWeb Quiz
// @namespace   https://greasyfork.org/users/102866
// @description Shows quiz on ankiweb
// @include     https://ankiweb.net/*
// @include     http://ankiweb.net/*
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @author      TiLied
// @version     0.1.9
// @grant       GM_getResourceText
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_getValue
// @grant       GM_setValue
// @resource    ankiDeck Japanese.txt
// @resource    ankiDeck1 JLPTN5.txt
// @resource    ankiDeck2 TheKodanshaKanjiLearnersCourse.txt
// ==/UserScript==

//not empty val
var originAnkiDeck = GM_getResourceText("ankiDeck"),
    inBstring = "<awq>",
    inEstring = "</awq>",
    inBegAnswer = "<awq_answer>",
    inEndAnswer = "</awq_answer>";

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
    rubyVal;

//prefs
var amountButtons,
    debug;

Main();

function Main()
{
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
    //SetSettings();
}

//Settings
function SetSettings()
{
    const settings = $("<li class=nav-item></li>").html("<a id=awq_settings class=nav-link>Settings Ankiweb Quiz</a> \
        <div id=awq_settingsPanel class=awq_settingsP>\
        <form> \
        <br> \
        Debug: <input type=checkbox name=debug id=awq_debug></input>\
        </form>\
        <button class=awq_style>Hide</button>\
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
        GM_setValue(nameVal, optValue);
        return true;
    } else
    {
        return false;
    }
}


function SetEventSettings()
{
    $("#awq_settings").click(function ()
    {
        $("#awq_settingsPanel").toggle();
    });

    $("#awq_debug").change(function ()
    {
        GM_setValue("awq_debug", $(this).prop("checked"));
        debug = $(this).prop("checked");
        alert("Settings has been changed. Please reload the page.");
    });
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
}

$(document).ready(function () {

    // Append some text to the element with id someText using the jQuery library.
    //$("#studynow").append(" more text...................");

    $("#studynow").click(function () {
        setTimeout(function ()
        {
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
                    x++
                }
            }
            return rubyVal;


            //This is if first goes hiragana/katakana
            /*if (contentText[0].nodeValue != "")
            {
                rubyVal = $.trim(contentText[0].nodeValue);
                rubyVal += "<ruby><rb>";

                rubyVal += $.trim($(contentSpan[0]).contents().filter(function ()
                {
                    return this.nodeType == 3;
                })[0].nodeValue) + "</rb><rt>";

                rubyVal += $(contentSpan[0]).contents()[0].innerHTML + "</rt></ruby>";

                //After kanji goes  hiragana/katakana if not return
                if (contentText[1] != null)
                {
                    rubyVal += $.trim(contentText[1].nodeValue);
                    if (contentSpan[1] != null)
                    {
                        rubyVal += "<ruby><rb>";
                        rubyVal += $.trim($(contentSpan[1]).contents().filter(function ()
                        {
                            return this.nodeType == 3;
                        })[0].nodeValue) + "</rb><rt>";

                        rubyVal += $(contentSpan[1]).contents()[0].innerHTML + "</rt></ruby>";

                        //After kanji goes  hiragana/katakana if not return
                        if (contentText[2] != null)
                        {
                            rubyVal += $.trim(contentText[2].nodeValue);
                            if (contentSpan[2] != null)
                            {
                                //TODO THIRD
                            } else
                            {
                                if (debug)
                                {
                                    console.log("Here actua this: " + rubyVal);
                                }
                                return rubyVal;
                            }
                        } else
                        {
                            if (debug)
                            {
                                console.log("Here actua this: " + rubyVal);
                            }
                            return rubyVal;
                        }
                    } else
                    {
                        if (debug)
                        {
                            console.log("Here actua this: " + rubyVal);
                        }
                        return rubyVal;
                    }
                } else
                {
                    if (debug)
                    {
                        console.log("Here actua this: " + rubyVal);
                    }
                    return rubyVal;
                }

                if (debug)
                {
                    console.log("value first:" + contentText[0].nodeValue);
                    console.log(contentSpan);
                    console.log(contentSpan[0].innerHTML);
                }
            }

            if (debug)
            {
                console.log(contentText);
                console.log("IT DOES");
                console.log($("awq_question").contents());
                //rubyVal = $("awq_question").contents().filter(function ()
                //{
                //    return this.nodeType == 3;
                //})[0].nodeValue;
                console.log("Here actua this: " + rubyVal);
            }*/
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
            }
        }
    }

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
                }
            } else {
                id = GetRand(tempStrings);
                i--;
            }
        }
        RamdomButton();
    }

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


// ------------
//  TODO
// ------------

/* TODO STARTS
✓    1)Make it only one element of buttons  //DONE 0.0.9
        1.1)Increase numbers of buttons to 10-12(optional through settings???)
✓    2)Make it limit of length answer and put whole in attribute title  //DONE 0.1.0
    3)Make it settings, almost done in 0.1.0
✓        3.1)Debug   //DONE 0.1.0 
        3.2)Add txt file ***RESEARCH NEEDED***
            3.2.1)Choose them
        3.3)Make it always show quiz
✓    4)Make it full functionality of Japanese deck, partial done in 0.0.8    //DONE 0.0.9 Happy with that :)
    5)Search question in between tags <awq_question> and </awq_question> not in whole sentence, almost done in 0.1.2
✓    6)TODO for loop in finding question NEED TEST IT    //DONE 0.1.7 BROKEN     //DONE 0.1.9
TODO ENDS */
