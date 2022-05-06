window.addEventListener("contextmenu",e => e.preventDefault())


/*-------------------------*/


const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function resizeCanvas(canvas){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
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

  static drawBenz(context, pointArray){
    const c = context;
    const p0 = pointArray[0];
    p0.reverse = true;
    const p1 = pointArray[1];
    p1.reverse = true;
    const p2 = pointArray[2];
    const p3 = pointArray[3];

    c.save();
    const g = c.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
    g.addColorStop(0, '#FF005530');
    g.addColorStop(0.2, '#FF005560');
    g.addColorStop(0.8, '#0000FF60');
    g.addColorStop(1, '#0000FF40');
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
    h.addColorStop(0, '#FF0055');
    h.addColorStop(1, '#0000FF')
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
    this.x = Math.floor((canvas.width / 2)  * Math.random()) + canvas.width / 4;
    this.y = Math.floor((canvas.height / 2) * Math.random()) + canvas.height / 4;

    this.r = Math.floor(canvas.height / 2 * Math.random()) + 20;
    this.rx = 0; //orbit point
    this.ry = 0;
    this.rr = 10;

    this.opx = 0;
    this.opy = 0;

    this.dx = 0; //center point
    this.dy = 0;

    this.a = 0;
    this.ad = Math.random() >= 0.5 ? 1 : -1;
    this.av = Math.PI / 360 * this.ad * Math.random();

    this.strokeStyle = '#FFFFFF70';

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
    c.strokeStyle = '#FFFFFF20';
    c.fillStyle = '#000';
    c.lineWidth = 6;
    c.setLineDash(dash || [2,4]);
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, this.fullArc);
    c.stroke();
    c.restore();
  }

  animate(){
    this.update();
    this.drawOrbit();
    this.calcCtrlPoint();
    this.calcOppositePoint();
    this.drawCenterLine();
    this.drawCenterPoint();
    this.drawCtrlPoint();
  }
}


/*-------------------------*/

const points = Point.createArray(canvas, context, 4);

function loop(){
  requestAnimationFrame(loop);
  clearCanvas(canvas, context);
  // fadeCanvas(canvas, context);
  Point.animate(points);
  Point.drawBenz(context, points);
  return
}
loop();
