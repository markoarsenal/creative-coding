const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
};

let manager;

let text = "A";
const fontFamily = "Serif";
let fontSize = 1200;

const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const sketch = ({ context, width, height }) => {
  const cell = 20;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const cells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = "black";
    typeContext.fillRect(0, 0, cols, rows);

    fontSize = cols * 1.2;

    typeContext.fillStyle = "white";
    typeContext.font = `${fontSize}px ${fontFamily}`;
    typeContext.textBaseline = "middle";
    typeContext.textAlign = "center";

    const metrics = typeContext.measureText(text);
    const mx = -metrics.actualBoundingBoxLeft;
    const my = -metrics.actualBoundingBoxAscent;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const x = (cols - mw) / 2 - mx;
    const y = (rows - mh) / 2 - my;

    typeContext.save();

    typeContext.translate(x, y);

    typeContext.beginPath();
    typeContext.rect(mx, my, mw, mh);
    typeContext.stroke();

    console.log("text", text, typeContext.fillStyle, metrics);

    typeContext.fillText(text, 0, 0);

    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.textAlign = "center";
    context.textBaseline = "middle";

    for (let i = 0; i < cells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const red = typeData[i * 4];
      const green = typeData[i * 4 + 1];
      const blue = typeData[i * 4 + 2];

      const glyph = getGlyph(red, text);

      context.fillStyle = `rgb(${red}, ${green}, ${blue})`;

      context.save();

      context.translate(x, y);
      context.translate(-cell * 0.5, -cell * 0.5);
      // context.fillRect(0, 0, cell, cell);

      context.font = `${cell * 2}px ${fontFamily}`;
      if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;

      context.fillText(glyph, 0, 0);

      context.restore();
    }
  };
};

const getGlyph = (red, text) => {
  if (red < 50) return "";
  if (red < 100) return ".";
  if (red < 150) return ",";
  if (red < 200) return "!";
  if (red < 250) return "?";

  const glyphs = "_+/".split("");

  return random.pick(glyphs);
};

document.addEventListener("keyup", (event) => {
  text = event.key;
  manager.render();
});

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};

start();
