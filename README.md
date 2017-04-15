# Ankiweb_Quiz
### Download
https://greasyfork.org/scripts/28189

### Description
Script which shows quiz on ankiweb. Tested with [Japanese Visual Novel, Anime, Manga, LN Vocab - V2K(modified by me)](https://ankiweb.net/shared/info/1434910726)
**Please read installation**

![Example](https://i.imgur.com/JHpfvcN.png)

### Installation
Only installing script it's not enough, so go trough this steps to make sure that everything working install correct
1. After installing script, go in anki app choose Tools-Manage Note Types 

![1](https://i.imgur.com/otKlRdV.png)

2. Choose your deck-Cards

![2](https://i.imgur.com/Ym0T6D3.png)

3. 
+ First put `<awq>` in the beginning 
+ Second put `</awq>` in the ending
+ Third put `<awq_question>` and `</awq_question>` between "Question", my example its `{{furigana:Reading}}`
+ Forth put `<awq_answer>` and `</awq_answer>` between "Answer", my example its `{{Meaning}}`
+ Repeat if you have multiply decks/cards. In my example for `Kanji2` card
![3](https://i.imgur.com/J5ivb20.png)

4. Close it, go File-Export

![4](https://i.imgur.com/Au73yO3.png)

5. Choose Export Format: Cards in plain text(*.txt). Next Choose your deck, save it with simple name 
![5](https://i.imgur.com/xLdwLWz.png)
![6](https://i.imgur.com/gxmwgWp.png)

6. DO NOT FORGET TO SYNC

![7](https://i.imgur.com/Nrlzgua.png)

7. Go in `C:\Users\*YourUserName*\AppData\Roaming\Mozilla\Firefox\Profiles\*ProfileName*\gm_scripts\AnkiWeb_Quiz` paste your deck.txt here

8. Open `AnkiWeb_Quiz.user.js` edit PUT_HERE_YOUR_DECK.txt on `deck_name.txt`. In my example it is `Japanese.txt`
![8](https://i.imgur.com/Nck39hS.png)

9. Thats it, go in Ankiweb and enjoy your stay... :)

### Cons
* Well greasemonkey not updating @resource file, thats bad, you can change name of @resource ankideck on @resource ankideck1 etc. DO NOT FORGET CHANGE `var originAnkiDeck = GM_getResourceText("ankiDeck")`.
* If update released, you need change script (Not good, maybe somehow change this ***Need research***)
* Add something in deck, need repeat from `4 step`

*Sorry for any grammar error, english not my native language.*
