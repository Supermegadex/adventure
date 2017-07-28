let chalk = require('chalk');
let helper = require('./text-helpers');

module.exports = {
    "rooms": [
        [ "nw", "n",      "ne", "house"   ],
        [ "w",  "center", "e",  "backyard"],
        [ "sw", "s",       null, null     ]
    ],
    "house": [
        [  null,      "bath",   null    ],
        [ "entrance", "foyer", "stairs" ],
        [  null,      "guest",  null    ]
    ],
    "ben": [
        [ "fire",  ],
        [],
    ],
    "scenes": {
        "nw": {
            "text": `${chalk.cyan("Welcome to " + chalk.underline("TXTGaym Demo!"))}\nYou can go ${chalk.red("south")} from here.\nIf you need help, type ${chalk.magenta("help")} or ${chalk.magenta("?")} for instructions.`,
            "go": [1, 1, 1, 1],
            "commands": {
                "cheat": [["changeMaps", {location: [1, 1], map: "house"}]],
            }
        },
        "n": {
            "text": `You are now in the ${chalk.blue("north")} part of the map`
        },
        "ne": {
            "text": `You are now in the ${chalk.blue("north-east")} corner of the map.\nYou see a house to the east.`
        },
        "w": {
            "text": `You are now in the ${chalk.blue("west")} part of the map`
        },
        "e": {
            "text": `You are now in the ${chalk.blue("east")} part of the map`
        },
        "s": {
            "text": `You are now in the south part of the map`
        },
        "se": {
            "text": `You are now in the ${chalk.blue("south-east")} corner of the map`
        },
        "sw": {
            "text": `You see the glint of a ${chalk.blue("golden coin")} lying on the ground.\nYou can go either ${chalk.yellow("north")} or ${chalk.green("east")};`,
            "things": (vars) => {
                return vars.hasFoundGold ? [] : [
                    {
                        name: "gold",
                        take: [["inventory_add", {name: "coin", description: "A gold coin you found lying on the ground."}], ["set_var", {var: "hasFoundGold", val: true}]],
                        look: [["describe", "A gold coin you found lying on the ground."]] 
                    },
                    {
                        name: "coin",
                        take: [["inventory_add", {name: "coin", description: "A gold coin you found lying on the ground."}], ["set_var", {var: "hasFoundGold", val: true}]],
                        look: [["describe", "A gold coin you found lying on the ground."]] 
                    },
                    {
                        name: "golden",
                        take: [["inventory_add", {name: "coin", description: "A gold coin you found lying on the ground."}], ["set_var", {var: "hasFoundGold", val: true}]],
                        look: [["describe", "A gold coin you found lying on the ground."]] 
                    }
                ];
            }
        },
        "center": {
            "text": `You are now in the ${chalk.blue("center")} part of the map`
        },
        "house": {
            "text": `You have approached the house.\nThe door is unlocked and you can ${chalk.blue("go inside")}.`,
            "things": [
                {
                    name: "door",
                    move: [["changeMaps", {location: [1, 0], map: "house"}]]
                }
            ],
            "commands": {
                "go inside": [["changeMaps", {location: [1, 0], map: "house"}]],
                "go in": [["changeMaps", {location: [1, 0], map: "house"}]],
                "enter": [["changeMaps", {location: [1, 0], map: "house"}]]
            }
        },
        "bedroom": {
            "text": "Hello"
        },
        "backyard": (vars) => {
            return vars.canSeeBackyard ? {
                text: "Backyard!"
            } : null;
        },
        "entrance": {
            "text": `You have entered the house. The foyer is to the ${chalk.green("east")}.`,
            "commands": {
                "exit": [["changeMaps", {location: [0, 3], map: "rooms"}]],
                "go out": [["changeMaps", {location: [0, 3], map: "rooms"}]],
                "leave": [["changeMaps", {location: [0, 3], map: "rooms"}]],
            }
        },
        "foyer": {
            "text": `You have entered the foyer. It is grand, with a huge ${chalk.blue("chandelier")} hanging from the ceiling.\nTo the ${chalk.green("east")} is a staircase, to the ${chalk.yellow("north")} is a bathroom, and to the ${chalk.red("south")} is a guest bedroom.\nYou can see something on the ground twinkling.`,
            "things": vars => {
                let look = [["describe", `It's a key on the ground! You can ${chalk.blue("pick it up")}.`]];
                let take = [["inventory_add", {name: "key", use: false, description: `It's a key you found on the ground. Probably unlocks the bathroom.`}], ["set_var", {var: "hasTakenKey", val: true}]];
                let key = vars.hasTakenKey ? [] : [
                    {
                        name: "key",
                        take: take,
                        look: look
                    },
                    {
                        name: "it",
                        take: take,
                        look: look
                    },
                    {
                        name: "something",
                        take: take,
                        look: look
                    },
                    {
                        name: "ground",
                        take: take,
                        look: look
                    }
                ]
                return [
                    {
                        name: "chandelier",
                        look: [["describe", `Wow! It's a huge chandelier. It's lit with candles and has three tiers. There are glass beads hanging from it as well as panels diffracting the light.`]],
                    }
                ].concat(key);
            }
        },
        "bath": {
            "text": `This is the main-floor bathroom. `,
            "things": [
                {
                    name: "mirror",
                    look: [["lock_scene", "characterCreation1"]]
                }
            ],
            "locked": ["inventory", "key"]
        },
        "guest": {
            "text": `You are in the guest bedroom. There's a ${chalk.blue("bed")}.`,
            "things": [
                {
                    name: "bed",
                    look: [["describe", "It's a nice bed."]]
                }
            ]
        },
        "stairs": {
            "text": () => {return `whee`}
        },
        "characterCreation1": {
            text: "Enter your name.",
            action: ["enter_name"]
        },
        "characterCreation2": {
            text: "Confirm your name.",
            action: ["confirm_name"]
        },
        "characterCreation3": {
            text: "Enter your gender.",
            action: ["enter_gender"]
        },
        "characterCreation4": {
            text: "Confirm your gender.",
            action: ["confirm_gender"]
        },
        "characterCreation5": {
            text: "Enter your background.",
            action: ["enter_bg"]
        },
        "characterCreation6": {
            text: "Confirm your background.",
            action: ["confirm_bg"]
        },
    }
}