// ==UserScript==
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

	_DeckId;

	constructor() {
		console.log("AnkiWeb Quiz v" + GM.info.script.version + " initialization");

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
		}
		console.log("*-----*");
	}

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
				}
			}
			if (_continue)
				continue;
			else
				cardsId.push(_id);
		}
		//Console.WriteLine(cardsId);

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