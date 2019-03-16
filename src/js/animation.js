require('svg.js')

const label = document.querySelector('#scrollpos');

// drawing
const canvas = SVG('drawing').size('100%', '100%');
// b1.rect(100, 100).move(100, 50)
// b2.rect(100, 100).move(250, 100);
const b1 = canvas.rect(100,100).move(0,100).fill('#f06');
const b2 = canvas.rect(100,100).move(100,0).fill('#aaffdd');


function getScrollRatio() {
    const scrollTop = window.scrollY;
    const docHeight = document.body.offsetHeight;
    const winHeight = window.innerHeight;
    const scrollRatio = ((scrollTop) / (docHeight - winHeight));

    return scrollRatio;
}

document.addEventListener('scroll', () => {
    const scroll = getScrollRatio();
    label.innerHTML = scroll;
    b1.transform({y: scroll * window.innerHeight})
    b2.transform({y: scroll * window.innerHeight * 2})
});