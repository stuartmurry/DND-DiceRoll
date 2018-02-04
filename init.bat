START /WAIT npm i -g angular-cli-ghpages
REM Don't forget the trailing forward slash on base-href attribute otherwise the browser with chop the word off will not be able to find the javscript and css files.
START /WAIT ng build --prod --base-href "https://stuartmurry.github.io/DND-DiceRoll/"
START /WAIT git remote add origin https://github.com/stuartmurry/DND-DiceRoll.git
START /WAIT git push -u origin master
START /WAIT ngh

