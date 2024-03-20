const setData = require("../data/setData.json"); 
const themeData = require("../data/themeData.json"); 

let sets = [];

// Initializes the 'sets' array with data from 'setData' and 'themeData'
function initialize() {
    return new Promise((resolve, reject) => {
        try {
            setData.forEach(set => {
                const theme = themeData.find(theme => theme.id == set.theme_id)?.name;
                if (theme) {
                    sets.push({...set, theme});
                }
            });
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

// Returns all Lego sets
function getAllSets() {
    return new Promise((resolve, reject) => {
        if (sets.length > 0) {
            resolve(sets);
        } else {
            reject("No sets found.");
        }
    });
}

// Returns a specific Lego set by its number
function getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
        const set = sets.find(set => set.set_num === setNum);
        if (set) {
            resolve(set);
        } else {
            reject(`Set number ${setNum} not found.`);
        }
    });
}

// Returns sets that match a specific theme
function getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
        const filteredSets = sets.filter(set => set.theme.toLowerCase().includes(theme.toLowerCase()));
        if (filteredSets.length > 0) {
            resolve(filteredSets);
        } else {
            reject(`Sets with theme containing "${theme}" not found.`);
        }
    });
}

// Export the functions 
module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };

