module.exports = {
    parse: function(words) {
        let bank = [], i = 0;
        for (let word of words) {
            bank[i] = [word, this.words[word] || "unknown"];
            i++;
        }
        return bank;
    },
    parseDirection: (bank, things) => {
        if (bank[0][1].directional) {
            if(bank[0][1].pos = "verb") {
                for (let entry of bank) {
                    if (entry[1].pos == "noun") {
                        return entry[1].direction;
                    }
                }
                for (let word of bank) {
                    if (things) {
                        for (let thing of things) {
                            if (thing.name === word[0]) {
                                return thing.move;
                            }
                        }
                    }
                }
                return false;
            }
            else if (bank[0][1].pos = "noun") {
                if (bank[0][1].direction) {
                    return bank[0][1].direction;
                }
            }
            else return false;
        }
        else return false;
    },
    parseLook: (bank, things, inventory) => {
        if (bank[0][1].look) {
            if (bank[0][1].pos == "verb") {
                for (let word of bank) {
                    if (typeof things === "object") {
                        for (let thing of things) {
                            if (thing.name === word[0]) {
                                return thing.look;
                            }
                        }
                    }
                    if (inventory) {
                        for (let item of inventory) {
                            if (item.name === word[0]) {
                                return [["describe", item.description]]
                            }
                        }
                    }
                }
                return false;
            }
            else if (bank[0][1].pos == "noun") {
                for (let thing of things) {
                    if (thing.name === bank[0][0]) {
                        return thing.look;
                    }
                }
                return false;
            }
            else return false;
        }
        else return false;
    },
    parseGrab: (bank, things) => {
        if (bank[0][1].grab) {
            if (bank[0][1].pos == "verb") {
                for (let word of bank) {
                    if (things) {
                        for (let thing of things) {
                            if (thing.name === word[0]) {
                                return thing.take;
                            }
                        }
                    }
                }
                return false;
            }
            else if (bank[0][1].pos == "noun") {
                if(things){
                    for (let thing of things) {
                        if (thing.name === bank[0][0]) {
                            return thing.take;
                        }
                    }
                }
                return false;
            }
            else return false;
        }
        else return false;
    },
    parseContinue: bank => {
        if (bank[0][0].advance) {
            return "advance";
        }
        else return false;
    },
    yes: [
        "yes",
        "yep",
        "affirmative",
        "y",
        "indeed",
        "yeah",
        "yea"
    ],
    no: [
        "no",
        "nope",
        "negative",
        "n",
        "nah",
        "nay"
    ],
    help: [
        "help",
        "?"
    ],
    words: {
        "go": {
            directional: true,
            pos: "verb"
        },
        "travel": {
            directional: true,
            pos: "verb"
        },
        "walk": {
            directional: true,
            pos: "verb"
        },
        "move": {
            directional: true,
            pos: "verb"
        },
        "north": {
            directional: true,
            direction: [-1, 0],
            pos: "noun",
        },
        "south": {
            directional: true,
            direction: [1, 0],
            pos: "noun",
        },
        "east": {
            directional: true,
            direction: [0, 1],
            pos: "noun",
        },
        "west": {
            directional: true,
            direction: [0, -1],
            pos: "noun",
        },
        "look": {
            look: true,
            pos: "verb"
        },
        "glance": {
            look: true,
            pos: "verb"
        },
        "glimpse": {
            look: true,
            pos: "verb"
        },
        "peek": {
            look: true,
            pos: "verb"
        },
        "review": {
            look: true,
            pos: "verb"
        },
        "stare": {
            look: true,
            pos: "verb"
        },
        "view": {
            look: true,
            pos: "verb"
        },
        "pick": {
            grab: true,
            pos: "verb"
        },
        "grab": {
            grab: true,
            pos: "verb"
        },
        "snatch": {
            grab: true,
            pos: "verb"
        },
        "take": {
            grab: true,
            pos: "verb"
        },
        "next": {
            advance: true,
            pos: "noun"
        },
        "quit": {
            quit: true
        }
    }
}