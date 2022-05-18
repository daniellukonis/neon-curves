// window.addEventListener("contextmenu",e => e.preventDefault())


/*-------------------------*/


const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function resizeCanvas(canvas){
  let length;
  window.innerWidth > window.innerHeight ? length = window.innerHeight : length = window.innerWidth;
  length = Math.floor(length * 0.95);
  canvas.width = length;
  canvas.height = length;
}
resizeCanvas(canvas);

function clearCanvas(canvas, context){
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function fadeCanvas(canvas, context){
  context.save();
  context.fillStyle = '#00000010'
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();
}

function fillCanvas(canvas, context, color){
  context.save();
  context.fillStyle = color || '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();
}

fillCanvas(canvas, context);


/*-------------------------*/


class Point {
  static createArray(canvas, context, quantity){
    const array = [];
    for(let i = 0; i < quantity; i++){
      array.push(new Point(canvas, context));
    }
    return array;
  }

  static createPalette(){
    const ad = Math.floor(fxrand() * 10) + 1;
    let a = Math.floor(360 * fxrand());
    const s = 100
    const l = 50
    const cs1 = `hsl(${a}, ${s}%, ${l}%, .30)`
    const cs2 = `hsl(${a}, ${s}%, ${l}%, .60)`
    const cs5 = `hsl(${a}, ${s}%, ${l}%)`
    a += 30 * ad;
    const cs3 = `hsl(${a}, ${s}%, ${l}%, .60)`
    const cs4 = `hsl(${a}, ${s}%, ${l}%, .40)`
    const cs6 = `hsl(${a}, ${s}%, ${l}%)`

    return {cs1,cs2,cs3,cs4,cs5,cs6}
  }

  static drawBenz(context, pointArray, colorPalette){
    const cp = colorPalette;
    const c = context;
    const p0 = pointArray[0];
    p0.reverse = true;
    const p1 = pointArray[1];
    p1.reverse = true;
    const p2 = pointArray[2];
    const p3 = pointArray[3];

    c.save();
    const g = c.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
    g.addColorStop(0, cp.cs1);
    g.addColorStop(0.2, cp.cs2);
    g.addColorStop(0.8, cp.cs3);
    g.addColorStop(1, cp.cs4);
    c.strokeStyle = g;
    c.lineWidth = 30;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(p2.rx, p2.ry);
    c.quadraticCurveTo(p0.opx, p0.opy, p0.x, p0.y);
    c.bezierCurveTo(p0.rx, p0.ry, p1.rx, p1.ry, p1.x, p1.y);
    c.quadraticCurveTo(p1.opx, p1.opy, p3.rx, p3.ry );
    c.stroke();
    c.restore();

    c.save();
    const h = c.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
    h.addColorStop(0, cp.cs5);
    h.addColorStop(1, cp.cs6)
    c.strokeStyle = h;
    c.lineWidth = 15;
    c.lineCap = 'round';
    c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(p0.x, p0.y);
    c.bezierCurveTo(p0.rx, p0.ry, p1.rx, p1.ry, p1.x, p1.y);
    c.stroke();
    c.restore();
  }

  static animate(pointArray){
    pointArray.forEach(e => {
      e.animate();
    });
  }


  /*-------------------------*/


  constructor(canvas, context){
    this.canvas = canvas;
    this.context = context;
    this.fullArc = Math.PI * 2;
    this.x = Math.floor((canvas.width / 2)  * fxrand()) + canvas.width / 4;
    this.y = Math.floor((canvas.height / 2) * fxrand()) + canvas.height / 4;

    this.r = Math.floor(canvas.height / 2 * fxrand()) + 20;
    this.rx = 0; //orbit point
    this.ry = 0;
    this.rr = 10;

    this.opx = 0;
    this.opy = 0;

    this.dx = 0; //center point
    this.dy = 0;

    this.a = 0;
    this.ad = fxrand() >= 0.5 ? 1 : -1;
    this.av = Math.PI / 360 * this.ad * fxrand();

    this.strokeStyle = '#FFFFFF70';
    this.lineWidth = 6;

    this.reverse = false;

  }
  calcCtrlPoint(){
    this.rx = this.x + Math.cos(this.a) * this.r;
    this.ry = this.y + Math.sin(this.a) * this.r;
  }

  calcOppositePoint(){
    this.opx = this.x + Math.cos(this.a + Math.PI) * this.r;
    this.opy = this.y + Math.sin(this.a + Math.PI) * this.r;
  }

  update(){
    this.a += this.av;
  }
  drawBoundingLine({context:c} = this){
    c.save();
    c.strokeStyle = this.strokeStyle;
    c.fillStyle = '#000';
    c.beginPath();
    c.moveTo(this.rx, this.ry);
    c.lineTo(this.dx, this.dy);
    c.stroke();
    c.restore()
  }

  drawCenterLine({context:c} = this){
    c.save();
    c.strokeStyle = this.strokeStyle;
    c.fillStyle = '#000';
    c.beginPath();
    c.moveTo(this.x, this.y);
    this.reverse ? c.lineTo(this.opx, this.opy) : c.lineTo(this.rx, this.ry);
    c.stroke();
    c.restore()
  }

  drawCenterPoint({context:c} = this){
    c.save();
    c.strokeStyle = this.strokeStyle;
    c.fillStyle = '#000';
    c.beginPath();
    c.arc(this.x, this.y, this.rr, 0, this.fullArc)
    c.fill();
    c.stroke();
    c.restore()
  }

  drawCtrlPoint({context:c} = this){
    c.save();
    c.strokeStyle = this.strokeStyle;
    c.fillStyle = '#000';
    c.beginPath();
    this.reverse ? c.arc(this.opx, this.opy, this.rr, 0, this.fullArc) : c.arc(this.rx, this.ry, this.rr, 0, this.fullArc);
    c.fill();
    c.stroke();
    c.restore()
  }

  drawOrbit({context:c} = this, dash){
    c.save();
    c.strokeStyle = '#FFFFFF30';
    c.fillStyle = '#000';
    c.lineWidth = this.lineWidth;
    c.setLineDash(dash || [2,4]);
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, this.fullArc);
    c.stroke();
    c.restore();
  }

  drawHighlightOrbit({context:c} = this, dash){
    const ac = Math.PI / 8
    c.save();
    c.strokeStyle = '#FFFFFF20';
    c.fillStyle = '#000';
    c.lineCap = 'round';
    c.lineWidth = this.lineWidth * 2;
    // c.setLineDash(dash || [2,4]);
    c.beginPath();
    c.arc(this.x, this.y, this.r, this.a - ac, this.a + ac );
    c.stroke();
    c.restore();
  }

  animate(){
    this.update();
    this.drawOrbit();
    this.reverse ? null : this.drawHighlightOrbit();
    this.calcCtrlPoint();
    this.calcOppositePoint();
    this.drawCenterLine();
    this.drawCenterPoint();
    this.drawCtrlPoint();
  }
}


/*-------------------------*/

class OutOrbit{
  constructor(canvas, context){
    this.canvas = canvas;
    this.context = context;

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;
    this.r = this.canvas.width / 2 - 20;

    this.a = 0;
    this.d = fxrand() >= 0.5 ? 1 : -1;
    this.av = fxrand() * 0.005 * this.d;
    this.al = Math.floor(180 * fxrand());

    this.strokeStyle = '#222'
  }
  draw({context:c} = this){
    c.save();
    c.lineWidth = 20;
    c.strokeStyle = this.strokeStyle;
    c.setLineDash([5,5]);
    c.beginPath();
    c.arc(this.x, this.y, this.r, this.a, this.a - this.al);
    c.stroke()
    c.restore();
  }
  update(){
    this.a += this.av;
  }
  animate(){
    this.update();
    this.draw();

  }
}


/*-------------------------*/


const points = Point.createArray(canvas, context, 4);
const colorPalette = Point.createPalette();

const orbit = new OutOrbit(canvas, context);

const fps = 60;
const interval = 1000 / fps;
let now = Date.now();
let then = Date.now();
let delta = 0;

function loop(){
  animation = requestAnimationFrame(loop);
  now = Date.now();
  delta = now - then;
  if(delta > interval){
      then = now - (delta % interval);
      //animation code
      clearCanvas(canvas, context);
      orbit.animate();
      Point.animate(points);
      Point.drawBenz(context, points, colorPalette);
    }
  }

loop();

function radToDeg(rad){
  const deg = 180 / Math.PI * rad;
  return deg;
}

window.$fxhashFeatures = {
  "Neon color 1": colorPalette.cs5,
  "Neon color 2": colorPalette.cs6
// here define the token features
}
