module.exports = {
    getSubjectPronoun: (player) => {
        switch (player.gender) {
            case 0:
                return "he";
            case 1:
                return "she";
            case 2:
                return "they";
        }
    },
    getObjectPronoun: (player) => {
        switch (player.gender) {
            case 0:
                return "him";
            case 1:
                return "her";
            case 2:
                return "them";
        }
    }
}