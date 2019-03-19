require('svg.js');
const { getRandomF, getRandomFP } = require('./util');


const label = document.querySelector('#scrollpos');

// drawing
const canvas = SVG('drawing').size('100%', '100%');
// b1.rect(100, 100).move(100, 50)
// b2.rect(100, 100).move(250, 100);
// const b1 = canvas.rect(100, 100).move(0, 100).fill('#f06');
// const b2 = canvas.rect(200, 200).move(100, 0).fill('#aaffdd');

const bigStars = genDots(500, 1, 10);

function genDots(num, minSize, maxSize) {
  let dots = Array(num).fill(null);
  return dots.map((_, i) => {
    const winWidth = window.innerWidth;
    const size = getRandomFP(minSize, maxSize);
    const x = getRandomF(0, winWidth);
    const y = getRandomF(-500, window.innerHeight + 500);
    return canvas.circle(size).move(x, y).fill('#FFF');
  });
}

function getScrollRatio() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.offsetHeight;
  const winHeight = window.innerHeight;
  const scrollRatio = 1 - ((scrollTop) / (docHeight - winHeight));

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
    requestAnimationFrame(() => {
      svg.transform({ y: scroll * window.innerHeight * (svg.width() / 10) })
    })
  }
}

document.addEventListener('scroll', () => {
  const scroll = getScrollRatio();
  // label.innerHTML = scroll;
  move([...bigStars]);
});
