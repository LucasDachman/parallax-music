require('svg.js');
const { getRandomFloat } = require('./util');


const label = document.querySelector('#scrollpos');

// drawing
const canvas = SVG('drawing').size('100%', '100%');
// b1.rect(100, 100).move(100, 50)
// b2.rect(100, 100).move(250, 100);
const b1 = canvas.rect(100, 100).move(0, 100).fill('#f06');
const b2 = canvas.rect(200, 200).move(100, 0).fill('#aaffdd');
let dots = Array(20).fill(null);
dots = dots.map((_, i) => {
  const winWidth = window.innerWidth;
  const size = getRandomFloat(0, 60);
  const x = getRandomFloat(0, winWidth);
  const y = getRandomFloat(0, 500);
  return canvas.circle(size).move(x, y);
})


function getScrollRatio() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.offsetHeight;
  const winHeight = window.innerHeight;
  const scrollRatio = ((scrollTop) / (docHeight - winHeight));

  return scrollRatio;
}

// moves svgs elements according to scroll position & width
function move(svg) {
  if (Array.isArray(svg)) {
    svg.forEach(m)
    return
  }
  m(svg)

  function m(svg) {
    const scroll = getScrollRatio();
    svg.transform({ y: scroll * window.innerHeight * (svg.width() / 100) })
  }
}



document.addEventListener('scroll', () => {
  const scroll = getScrollRatio();
  label.innerHTML = scroll;
  move([b1, b2, ...dots])
});
