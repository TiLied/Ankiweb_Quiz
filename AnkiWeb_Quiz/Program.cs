using CSharpToJavaScript;
using CSharpToJavaScript.APIs.JS;
using CSharpToJavaScript.Utils;

namespace AnkiWeb_Quiz
{
	internal class Program
	{
		static async Task Main(string[] args)
		{
			var opt = new CSTOJSOptions
			{
				AddSBInFront = new("// ==UserScript==\r\n" +
					"// @name	AnkiWeb Quiz\r\n" +
					"// @namespace	https://greasyfork.org/users/102866\r\n" +
					"// @description	Shows quiz on ankiweb.\r\n" +
					"// @match     https://ankiuser.net/*\r\n" +
					"// @match     https://ankiweb.net/*\r\n" +
					"// @author	TiLied\r\n" +
					"// @version	2.0.04\r\n" +
					"// @grant	GM_listValues\r\n" +
					"// @grant	GM_getValue\r\n" +
					"// @grant	GM_setValue\r\n" +
					"// @grant	GM_deleteValue\r\n" +
					"// @require	https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js\r\n" +
					"// @grant	GM.listValues\r\n" +
					"// @grant	GM.getValue\r\n" +
					"// @grant	GM.setValue\r\n" +
					"// @grant	GM.deleteValue\r\n" +
					"// ==/UserScript==\r\n\r\n"),

				AddSBInEnd = new("\r\nlet awq;\r\n\r\n" +
					"window.onload = function ()\r\n" +
					"{\r\n\t" +
					"awq = new AnkiWebQuiz();\r\n\r\n" +
					"\tsetTimeout(() =>\r\n" +
					"\t{\r\n" +
					"\t\tawq.Main();\r\n" +
					"\t\tconsole.log(awq);\r\n" +
					"\t}, 1000);\r\n};"),

				CustomCSNamesToJS = new List<Tuple<string, string>>()
				{
					new Tuple<string, string>("Replace", "replace"),
					new Tuple<string, string>("Trim", "trim"),
					new Tuple<string, string>("Length", "length"),
				},

				CustomCSTypesToJS = new() { typeof(Extensions), typeof(Element2) },

				OutPutPath = "..\\..\\..\\..\\"
			};
			var cstojs = new CSTOJS(opt);
			await cstojs.GenerateOneAsync("..\\..\\..\\..\\AnkiWeb_Quiz\\AnkiWebQuiz.cs", "Ankiweb_Quiz.user.js");

			Console.ReadKey();
		}
	}

	public static class Extensions
	{
		[To(ToAttribute.FirstCharToLowerCase)]
		public static string InsertAdjacentHTML(this Element obj, string where, string data)
		{
			throw new System.NotImplementedException();
		}
		[To(ToAttribute.FirstCharToLowerCase)]
		public static string ReplaceAll(this string obj, string pattern, string replacement)
		{
			throw new System.NotImplementedException();
		}
	}
	public class Element2 : Element
	{
		[To(ToAttribute.FirstCharToLowerCase)]
		public string InnerHTML { get; set; }
	}
}