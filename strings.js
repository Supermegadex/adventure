let chalk = require('chalk');

module.exports = {
////////////////////////////////////////////////////////////////////////////////
choose_background: chalk`You remember one thing about your forgotten life...
What was it?


{blue 0}: Serving in your militia

{blue 1}: Studying at college

{blue 2}: Meditating for hours

{blue 3}: Being the life of every party

{blue 4}: Dancing better than anyone at recitals

{blue 5}: Getting in neighborhood fights`,
////////////////////////////////////////////////////////////////////////////////
confirm_background_str: chalk`You used to serve with great \
bravery and courage to protect your people.

The strength you gained during the time you spent in the \
militia will earn you a boost in {magenta Strength}.

Is this what you remember? {blue (y/n)}`,
////////////////////////////////////////////////////////////////////////////////
confirm_background_dex: chalk`You used to dance at recitals \
often, and you have been limbered by the stretching and prowess it requires.

The dexterity that dance provides \
will earn you a boost in {magenta Dexterity}.

Is this what you remember? {blue (y/n)}`,
/////////////////////////////////////////////////////////////////////////////////
confirm_background_con: chalk`You used to brawl in the streets \
of your former home.

The dexterity that dance provides \
will earn you a boost in {magenta Constitution}.

Is this what you remember? {blue (y/n)}`
}