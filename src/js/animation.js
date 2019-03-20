require('svg.js');
const { getScrollRatio, getRandomF, getRandomFP } = require('./util');

// Global Variables
const label = document.querySelector('#scrollpos');


// generate dots 
function genDots(num, minSize, maxSize) {
  let dots = Array(num).fill(null);
  return dots.map((_, i) => {
    const winWidth = window.innerWidth;
    const size = getRandomFP(minSize, maxSize);
    const x = getRandomF(0, winWidth);
    const y = getRandomF(-300, window.innerHeight + 300) - 150;
    return canvas.circle(size).move(x, y).fill('#FFF');
  });
}

// moves svgs elements according to scroll position & diameter
function move(svg) {
  if (Array.isArray(svg)) {
    svg.forEach(m);
    return;
  }
  m(svg);

  function m(svg) {
    requestAnimationFrame(() => {
      const winHeight = window.innerHeight;
      const sizeScale = svg.width() / 10;
      svg.transform({ y: getScrollRatio() * winHeight * sizeScale });
      // updatePath();
    });
  }
}

function updatePath() {
  requestAnimationFrame(() => {
    const ps = points();
    path.plot(ps);
  });
}

// drawing
const canvas = SVG('drawing').size('100%', '100%');
const stars = genDots(500, 1, 10);
const bigStars = stars.filter((p) => p.width() > 7)

// get positions of all the big stars
const points = () => bigStars.map((p) => [p.cx(), p.cy() + p.transform().y]);

const path = canvas.polygon(points())
  .stroke('#FFF')
  .opacity(0.5)
  .style('fill-opacity', '0');


// animate
document.addEventListener('scroll', () => {
  move([...stars]);
  updatePath();
  // console.log(path.node.attributes[1].nodeValue);
});
