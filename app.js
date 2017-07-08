const readline = require('readline');
let rooms = require('./rooms');
let actions = require("./actions");
let chalk = require('chalk');
let helpers = require('./text-helpers');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let state = {location: [0, 0], scene: "", map: "rooms", locked: false, variables: {
    hasMadeCharacter: false,
    hasFoundGold: false,
    hasTakenKey: false
}};
let player = {
    name: "",
    gender: 0,
    inventory: []
}

function initialize() {
    // DEBUG
    // console.log("Whee!" == /[Whee!]/g)
    // END DEBUG
    createQuestionWithLocation(state.location)
}

function createQuestionWithLocation(location) {
    rl.question(makePrompt(rooms.scenes[rooms[state.map][location[0]][location[1]]].text), answer => {
        parseAction(answer);
    })
}

function createQuestionWithText(text) {
    rl.question(makePrompt(text), answer => {
        parseAction(answer);
    })
}

function makePrompt(text) {
    return "\n" + (typeof text === "function" ? text() : text) + "\n> ";
}

function checkInventoryForKey(name) {
    for (item of player.inventory) {
        if (item.name === name) {
            return true;
        }
    }
    return false;
}

function goDirection(currentLocation, direction, map) {
    let newRequestedLocation = [currentLocation[0] + direction[0],
                                currentLocation[1] + direction[1]];
    if (newRequestedLocation[0] < 0) return false;
    if (newRequestedLocation[1] < 0) return false;
    let room = rooms[state.map][newRequestedLocation[0]][newRequestedLocation[1]];
    if (room) {
        let scene = f(rooms.scenes[room]);
        if (!scene) {
            return false;
        }
        else if (!scene.locked) {
            return newRequestedLocation;
        }
        else {
            if (scene.locked[0] == "inventory") {
                return checkInventoryForKey(scene.locked[1]) ? newRequestedLocation : "locked";
            }
            return "locked";
        }
    }
    else return false;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const commands = {
    move: newLocation => {
        state.location = newLocation;
        createQuestionWithLocation(newLocation);
    },
    changeMaps: map => {
        state.map = map.map;
        map.location ? commands.move(map.location) : false;
    },
    describe: text => {
        createQuestionWithText(text);
    },
    inventory_add: thing => {
        player.inventory.push(thing);
        createQuestionWithText(`${chalk.blue(capitalize(thing.name))} has been added to your inventory.\n${thing.description}`);
    },
    inventory_remove: name => {

    },
    set_var: data => {
        state.variables[data.var] = data.val;
    },
    scene: id => {
        state.scene = id;
        createQuestionWithText(rooms.scenes[id].text);
    },
    lock_scene: id => {
        state.locked = true;
        commands.scene(id);
    },
    enter_name: name => {
        player.name = name;
        state.scene = "characterCreation2",
        createQuestionWithText(`Is ${chalk.green(player.name)} your name?`);
    },
    confirm_name: yn => {
        if (actions.yes.indexOf(yn) !== -1) {
            state.scene = "characterCreation3",
            createQuestionWithText(`Are you a man or a woman?`);
        }
        else if (actions.no.indexOf(yn) !== -1) {
            state.scene = "characterCreation1",
            createQuestionWithText(`What's your name?`);
        }
        else {
            createQuestionWithText(`Is ${chalk.green(player.name)} your name?`);
        }
    },
    enter_gender: gender => {
        player.gender = encodeGender(gender);
        state.scene = "characterCreation4",
        createQuestionWithText(`So you're a ${chalk.green(helpers.getSubjectPronoun(player))}?`);
    },
    confirm_gender: yn => {
        if (actions.yes.indexOf(yn) !== -1) {
            state.scene = "characterCreation5",
            createQuestionWithText(`More stuff?`);
        }
        else if (actions.no.indexOf(yn) !== -1) {
            state.scene = "characterCreation3",
            createQuestionWithText(`What's your gender?`);
        }
        else {
            createQuestionWithText(`So you're a ${chalk.green(helpers.getSubjectPronoun(player))}?`);
        }
    },
}

function encodeGender(gender) {
        if (["man",  "guy", "male", "boy", "dude", 0].indexOf(gender) !== -1) {
            return 0;
        }
        else if (["woman", "gal", "female", "girl", 1].indexOf(gender) !== -1) {
            return 1;
        }
        else return 2;
}

function advanceScene() {

}

function showHelp() {
    createQuestionWithText(
    `${chalk.green(" Help:\n==========")}
    In general, type what comes naturally. 
    For example, ${chalk.magenta("go east")} will do the same thing as ${chalk.magenta("walk to the east")}. 
    Your command should be understood if the intent is valid.
    However, you may choose to use the standard words, which will always work.\n\n${chalk.underline("Standard words:")}
    ${chalk.magenta("go ") + chalk.green("<north|east|south|west>")}: move in a cardinal direction
    ${chalk.magenta("look at ") + chalk.yellow("[the] ") + chalk.green("<object|myself>")}: look at an object in more detail
    ${chalk.magenta("talk to ") + chalk.green("<person>")}: initiate dialogue with someone
    ${chalk.magenta("take ") + chalk.yellow("[the] ") + chalk.green("<object>")}: pick up an object and put it in your inventory
    ${chalk.magenta("use ") + chalk.yellow("[the] ") + chalk.green("<object>")}: use an item that you have\n\n${chalk.underline("Other commands:")}
    ${chalk.magenta("inventory|i")}: view the contents of your inventory
    ${chalk.magenta("quit")}: quit the game
    ${chalk.magenta("help|?")}: show this screen\n\n${chalk.underline("Glossary:")}
    ${chalk.green("<word>")}: required
    ${chalk.yellow("[word]")}: optional
    "|": or\n${chalk.green("==========")}\n`)
}

function showInventory() {
    if (player.inventory.length > 0) {
        let text = chalk.green(" Inventory \n===============\n");
        let i = 1;
        for (let item of player.inventory) {
            text += `${chalk.blue(item.name)}: ${item.shortDescription || item.description}`;
            text += "\n";
            if (i >= player.inventory.length) {
                text += chalk.green("===============\n");
            }
            i++;
        }
        createQuestionWithText(text);
    }
    else {
        createQuestionWithText("Your inventory is empty!")
    }
}

function makeDirectionError() {
    createQuestionWithText(chalk.red("Uh, oh! You can't go that way!"));
}

function parseAction(action) {
    let scene = rooms.scenes[rooms[state.map][state.location[0]][state.location[1]]];
    if (rooms.scenes[state.scene]) {
        if (rooms.scenes[state.scene].action) {
            commands[rooms.scenes[state.scene].action](action);
            return;
        }
    }
    try {
        let command = scene.commands[action];
        if(command) {
            runCommands(command);
            return;
        }
    } catch (err) {}
    let words = action.toLowerCase().split(/[\s]/g);
    let bank = actions.parse(words);
    let _continue_ = actions.parseContinue(bank);
    let _direction_ = actions.parseDirection(bank, f(scene.things));
    let _look_ = actions.parseLook(bank, f(scene.things), f(player.inventory));
    let _grab_ = actions.parseGrab(bank, f(scene.things));
    if (bank[0][1].quit) {
        process.exit();
        return;
    }
    if (actions.help.indexOf(bank[0][0]) !== -1) {
        showHelp();
        return;
    }
    if (bank[0][0] == "inventory" || bank[0][0] == "i") {
        showInventory();
        return;
    }
    if (state.locked) {
        if (_continue_ == "advance") {

        }
    }
    else if (_direction_) {
        if (typeof _direction_[0] == "string") {
            runCommands(_direction_);
        }
        else if (typeof _direction_[0] == "number") {
            let newLocation = goDirection(state.location, _direction_, rooms[state.map]);
            if(newLocation && newLocation !== "locked") {
                commands.move(newLocation);
            }
            else if (newLocation && newLocation == "locked") {
                createQuestionWithText(chalk.red("The door is locked!"));
            }
            else makeDirectionError();
        }
        else makeDirectionError();
    }
    else if (_look_) {
        runCommands(_look_);
    }
    else if (_grab_) {
        runCommands(_grab_);
    }
    else {
        createQuestionWithText(chalk.red("I couldn't understand your action."));
    }
}

function runCommands(command_list) {
    for (let command of command_list) {
        commands[command[0]](command[1]);
    }
}

function f(d) {
    return typeof d === "function" ? d(state.variables) : d
}

initialize();
