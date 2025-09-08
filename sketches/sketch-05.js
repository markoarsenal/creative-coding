const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};

let manager;

let text = "A";
const fontFamily = "Serif";
const fontSize = 1200;

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.fillStyle = "black";
    context.font = `${fontSize}px ${fontFamily}`;
    context.textBaseline = "middle";
    context.textAlign = "center";

    const metrics = context.measureText(text);
    const mx = -metrics.actualBoundingBoxLeft;
    const my = -metrics.actualBoundingBoxAscent;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const x = (width - mw) / 2 - mx;
    const y = (height - mh) / 2 - my;

    context.save();

    context.translate(x, y);

    context.beginPath();
    context.rect(mx, my, mw, mh);
    context.stroke();

    context.fillText(text, 0, 0);

    context.restore();
  };
};

document.addEventListener("keyup", (event) => {
  text = event.key;
  manager.render();
});

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};

start();
