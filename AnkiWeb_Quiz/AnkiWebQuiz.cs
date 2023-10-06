using CSharpToJavaScript.APIs.JS;
using System.Text.RegularExpressions;
using static CSharpToJavaScript.APIs.JS.GlobalObject;

using Math = CSharpToJavaScript.APIs.JS.Math;
using Object = CSharpToJavaScript.APIs.JS.Object;

namespace AnkiWeb_Quiz;
public class AnkiWebQuiz
{
	private dynamic _Options = new Object();
	private dynamic _Decks = new Object();
	private dynamic _GlobalId = 0;

	private string _DeckId;

	public AnkiWebQuiz()
	{
		//GM.deleteValue("awqDecks");
		//GM.deleteValue("awqGlobalId");
		Console.WriteLine("AnkiWeb Quiz v" + GM.Info.Script.Version + " initialization");

		_LoadOptionsAndDecks();
		_SetCSS();

		(GlobalThis.Window as WindowOrWorkerGlobalScope).SetTimeout(() =>
		{
			_OptionsUI();
		}, 750);
	}

	private void _SetCSS()
	{
		(GlobalThis.Window.Document.Head as ParentNode).Append("<!--Start of AnkiWeb Quiz v" + GM.Info.Script.Version + " CSS-->");
			
			
		GlobalThis.Window.Document.Head.InsertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_quizGrid" +
		"{" +
			"display: grid;" +
			"grid-template-columns: repeat(4,auto);" +
			"grid-template-rows: auto;" +
			"grid-gap: 5px;" +
		"}</style>");

		GlobalThis.Window.Document.Head.InsertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_quizButton" +
		"{" +
			"color: #fff !important;" +
			"background-color: #0275d8;" +
			"border-color: #0275d8;" +
			"font-size: 1rem;" +
			"border-radius: .3rem;" +
			"border: 1px solid transparent;" +
			"max-width:350px;" +
			"cursor: pointer;" +
			"max-height: 300px;" +
			"overflow: auto;" +
			"padding: 5px;" +
		"}</ style >");
		GlobalThis.Window.Document.Head.InsertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_quizButton:hover" +
		"{" +
			"background-color: #025aa5;" +
		"}</ style >");

		GlobalThis.Window.Document.Head.InsertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_true" +
		"{" +
			"background-color: #75d802;" +
		"}</style>");
		GlobalThis.Window.Document.Head.InsertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_true:hover" +
		"{" +
			"background-color: #5aa502;" +
		"}</style>");
		GlobalThis.Window.Document.Head.InsertAdjacentHTML("beforeend", "<style type='text/css'>.awq_trueBorder" +
		"{" +
			"border-color: #75d802;" +
			"border-width: 3px;" +
		"}</style>");
		GlobalThis.Window.Document.Head.InsertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_false" +
		"{" +
			"background-color: #d80275;" +
		"}</style>");
		GlobalThis.Window.Document.Head.InsertAdjacentHTML("beforeend", "<style type='text/css'>div.awq_false:hover" +
		"{" +
			"background-color: #a5025a;" +
		"}</style>");
		GlobalThis.Window.Document.Head.InsertAdjacentHTML("beforeend", "<style type='text/css'>.awq_falseBorder" +
		"{" +
			"border-color: #d80275;" +
			"border-width: 3px;" +
		"}</style>");

		(GlobalThis.Window.Document.Head as ParentNode).Append("<!--End of AnkiWeb Quiz v" + GM.Info.Script.Version + " CSS-->");

	}
	private async void _LoadOptionsAndDecks() 
	{
		_Options = await GM.GetValue("awqOptions");
		_Decks = await GM.GetValue("awqDecks");
		_GlobalId = await GM.GetValue("awqGlobalId");

		if (_Options == null)
		{
			_Options = new Object();
			_Options["Buttons"] = 8;
		}
		if (_Decks == null)
			_Decks = new Object();
		if (_GlobalId == null)
			_GlobalId = 0;

		//Console log prefs with value
		Console.WriteLine("*prefs:");
		Console.WriteLine("*-----*");

		List<dynamic> vals = await GM.ListValues();

		for (int i = 0; i < vals.Count; i++)
		{
			Console.WriteLine("*" + vals[i] + ":" + await GM.GetValue(vals[i]));
		}
		Console.WriteLine("*-----*");
	}
	private void _OptionsUI() 
	{

		Element nav = (GlobalThis.Window.Document.Body as ParentNode).QuerySelector(".navbar-nav");

		string num = $"<label for=\"awqButtons\">Number of Buttons (4-12):</label>\r\n\r\n<input type=\"number\" id=\"awqButtons\" name=\"tentacles\" min=\"4\" max=\"12\" value=\"{_Options["Buttons"]}\" />";
		nav.InsertAdjacentHTML("beforeend", num);

		Element inputt = (GlobalThis.Window.Document as ParentNode).QuerySelector("#awqButtons");

		inputt.AddEventListener("change", (e) =>
		{

			dynamic value = (e.Target as dynamic)["value"];
			Console.WriteLine(value);
			_Options["Buttons"] = value;
			GM.SetValue("awqOptions", _Options);

		}, false);

	}

	public async void Main() 
	{
		if (GlobalThis.Window.Document.Location.Pathname.StartsWith("/decks"))
		{
			NodeList strs = (GlobalThis.Window.Document as ParentNode).QuerySelectorAll("button.btn-link");
			for (int i = 0; i < (int)strs.Length; i++)
			{
				Node _node = (strs[i] as Node);
				string _text = _node.TextContent.Trim().ReplaceAll(" ", "");

				if(_Decks[_text] == null)
						_Decks[_text] = new Object();

				(_node as HTMLElement).AddEventListener("click", () => 
				{
					GM.SetValue("awqDeckId", _text);
				}, true);

			}
			GM.SetValue("awqDecks", _Decks);
		}
		if (GlobalThis.Window.Document.Location.Pathname.StartsWith("/study"))
		{
			_DeckId = await GM.GetValue("awqDeckId");
			if (_DeckId == null) 
			{
				Console.WriteLine("Deck id is null");
				return;
			}

			Element? _awq = (GlobalThis.Window.Document.Body as ParentNode).QuerySelector("#qa");	
			Console.WriteLine(_awq);

			if (_awq == null) 
			{
				(GlobalThis.Window as WindowOrWorkerGlobalScope).SetTimeout(() =>
				{
					Main();
				}, 1000);
				return;
			}
			string _inner = (_awq as Element2).InnerHTML;
			string _id = "";
			List<string> keys = Object.Keys(_Decks[_DeckId]);
			
			for (int i = 0; i < keys.Count; i++)
			{
				if (_inner == _Decks[_DeckId][keys[i]]["question"]) 
				{
					_id = _Decks[_DeckId][keys[i]]["cardId"];
					break;
				}
			}

			if (_id == "") 
			{
				_id += GetId();

				_Decks[_DeckId][_id] = new Object();
				_Decks[_DeckId][_id]["cardId"] = _id;
				_Decks[_DeckId][_id]["question"] = _inner;
				_Decks[_DeckId][_id]["answer"] = "Use this deck more!";
			}

			Qiuz(_id);

			GM.SetValue("awqDecks", _Decks);
				
		}
	}

	private void Qiuz(string id) 
	{
		PlayAudio();

		List<string> cardsId = new();

		cardsId.Add(id);

		List<string> keys = Object.Keys(_Decks[_DeckId]);

		int len = _Options["Buttons"] - 1;
		if(len >= keys.Count) 
		{
			len = keys.Count - 1;
		}

		for(int i = 0; i < len; i++) 
		{
			int _randomInt = GetRandomInt(keys.Count);
			string _id = keys[_randomInt];
			bool _continue = false;

			for (int j = 0; j < cardsId.Count; j++)
			{
				if (_id == cardsId[j])
				{
					i--;
					_continue = true;
					break;
				}
			}
			if (_continue)
				continue;
			else
				cardsId.Add(_id);
		}
		//Console.WriteLine(cardsId);

		cardsId = Shuffle(cardsId);

		Element before = (GlobalThis.Window.Document as ParentNode).QuerySelector("#qa_box");
		Element divGrid = GlobalThis.Window.Document.CreateElement("div");
		divGrid.ClassList.Add("awq_quizGrid");

		before.ParentNode.InsertBefore(divGrid, before);

		Element answer = (GlobalThis.Window.Document as ParentNode).QuerySelector("button.btn-primary");
		if (!answer.ClassList.Contains("awqEvent")) 
		{
			answer.ClassList.Add("awqEvent");
			answer.AddEventListener("click", () =>
			{
				NodeList eases = (GlobalThis.Window.Document as ParentNode).QuerySelectorAll("button.m-1");

				//Console.WriteLine(eases);
				for (int i = 0; i < (int)eases.Length; i++)
				{
					if ((eases[i] as Element).ClassList.Contains("awqEvent"))
						continue;

					(eases[i] as Element).ClassList.Add("awqEvent");
					eases[i].AddEventListener("click", () =>
					{
						AddEventsForEases();
					}, false);
				}
			}, false);
		}

		for (int i = 0; i < cardsId.Count; i++)
		{
			Element div = GlobalThis.Window.Document.CreateElement("div");
			div.ClassList.Add("awq_quizButton");
			div.Id = cardsId[i];

			div.AddEventListener("click", (Event e) => 
			{
				string _id = (e.CurrentTarget as Element).Id;
				Console.WriteLine(_id);

				Element _button = (GlobalThis.Window.Document as ParentNode).QuerySelector("button.btn-primary");
				(_button as HTMLElement).Click();

				Element? _awq = (GlobalThis.Window.Document.Body as ParentNode).QuerySelector("#qa");
				_Decks[_DeckId][id]["answer"] = (_awq as Element2).InnerHTML;
				PlayAudio();

				(GlobalThis.Window as WindowOrWorkerGlobalScope).SetTimeout(() =>
				{
					NodeList _eases = (GlobalThis.Window.Document as ParentNode).QuerySelectorAll("button.m-1");

					//Console.WriteLine(_eases);
					for (int i = 0; i < (int)_eases.Length; i++)
					{
						if ((_eases[i] as Element).ClassList.Contains("awqEvent"))
							continue;

						(_eases[i] as Element).ClassList.Add("awqEvent");
						_eases[i].AddEventListener("click", () =>
						{
							AddEventsForEases();
						}, false);
					}

					if (_id == id)
					{
						div.ClassList.Add("awq_true");
						div.ClassList.Add("awq_trueBorder");

						(_eases[1] as Element).ClassList.Add("awq_trueBorder");
					}
					else
					{
						div.ClassList.Add("awq_false");
						div.ClassList.Add("awq_falseBorder");

						(_eases[0] as Element).ClassList.Add("awq_falseBorder");
					}
				}, 500);
				
			},false);

			string q = _Decks[_DeckId][cardsId[i]]["question"].Replace("</awq>", "");
			RegExp regex2 = new("style=", "g");
			string html = "<awq>" + _Decks[_DeckId][cardsId[i]]["answer"].Replace(q, "").Replace("\n\n<hr id=\"answer\">\n\n", "").Replace("<img", "<img width=\"100%\"").Replace(regex2, "data-style=");

			div.InsertAdjacentHTML("beforeend", html);

			(divGrid as ParentNode).Append(div);
		}
	}

	private void AddEventsForEases() 
	{
		Element grid = (GlobalThis.Window.Document as ParentNode).QuerySelector(".awq_quizGrid");
		(grid as ChildNode).Remove();
		Main();
	}

	private int GetId()
	{
		int id = _GlobalId++;
		GM.SetValue("awqGlobalId", id);
		return id;
	}

	private void PlayAudio() 
	{
		Element box = (GlobalThis.Window.Document.Body as ParentNode).QuerySelector("#qa_box");
		if (box != null)
		{
			Element audio = (box as ParentNode).QuerySelector("audio");
			if(audio != null)
				(audio as HTMLAudioElement).Play();
		}
	}

	private int GetRandomInt(int max)
	{
		return Math.Floor(Math.Random() * max);
	}

	private List<string> Shuffle(List<string> array)
	{
		for (int i = array.Count - 1; i > 0; i--)
		{
			int _i = i + 1;
			int j = Math.Floor(Math.Random() * _i);
			string temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}

		return array;
	}
}

