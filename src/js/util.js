
module.exports = {
    getRandomF: (min, max) => {
        return Math.random() * (max - min) + min;
    },
    getRandomFP: (min, max) => {
        const rand = Math.pow(Math.random(), 10);
        return rand * (max - min) + min
    } 

}