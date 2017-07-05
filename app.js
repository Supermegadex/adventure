const readline = require('readline');
let rooms = require('./rooms');
let actions = require("./actions");
let chalk = require('chalk');
let helpers = require('./text-helpers');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let state = {location: [0, 0], scene: "", map: "rooms", locked: false, variables: {}};
let player = {
    name: "",
    gender: 0,
    inventory: []
}

function initialize() {
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
    if (rooms[state.map][newRequestedLocation[0]][newRequestedLocation[1]]) {
        if (!rooms.scenes[rooms[state.map][newRequestedLocation[0]][newRequestedLocation[1]]].locked) {
            return newRequestedLocation;
        }
        else {
            if (rooms.scenes[rooms[state.map][newRequestedLocation[0]][newRequestedLocation[1]]].locked[0] == "inventory") {
                return checkInventoryForKey(rooms.scenes[rooms[state.map][newRequestedLocation[0]][newRequestedLocation[1]]].locked[1]) ? newRequestedLocation : "locked";
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
        createQuestionWithText(`"${chalk.blue(capitalize(thing.name))}" has been added to your inventory.`);
    },
    inventory_remove: name => {

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
    }
}

function encodeGender(gender) {
    switch (gender) {
        case "man" || "guy" || "male" || "boy" || "dude" || 0:
            return 0;
        case "woman" || "gal" || "female" || "girl" || 1:
            return 1;
        default:
            return 3;
    }
}

function advanceScene() {

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
            commands[command[0]](command[1]);
            return;
        }
    } catch (err) {}
    let words = action.toLowerCase().split(/[\s]/g);
    let bank = actions.parse(words);
    let _continue_ = actions.parseContinue(bank);
    let _direction_ = actions.parseDirection(bank, scene.things);
    let _look_ = actions.parseLook(bank, scene.things);
    let _grab_ = actions.parseGrab(bank, scene.things);
    if (state.locked) {
        if (_continue_ == "advance") {

        }
    }
    else if (_direction_) {
        if (typeof _direction_[0] == "string") {
            commands[_direction_[0]](_direction_[1]);
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
        commands[_look_[0]](_look_[1]);
    }
    else if (_grab_) {
        commands[_grab_[0]](_grab_[1]);
    }
    else {
        createQuestionWithText(chalk.red("I couldn't understand your action."));
    }
}

initialize();
