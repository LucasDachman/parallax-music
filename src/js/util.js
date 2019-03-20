
module.exports = {
    getRandomF: (min, max) => {
        return Math.random() * (max - min) + min;
    },
    getRandomFP: (min, max) => {
        const rand = Math.pow(Math.random(), 12);
        return rand * (max - min) + min;
    },
    getScrollRatio: () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollRatio = 1 - ((scrollTop) / (docHeight - winHeight));

        return scrollRatio;
    }
};