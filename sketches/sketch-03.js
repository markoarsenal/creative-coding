const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketch = ({ width, height }) => {
  const agents = [];

  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);
    const agent = new Agent(x, y);

    agents.push(agent);
  }

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      for (let j = i + 1; j < agents.length; j++) {
        const agentA = agents[i];
        const agentB = agents[j];

        const distance = agentA.vector.getDistance(agentB.vector);
        const lineWidth = math.mapRange(distance, 0, 200, 8, 1);

        if (distance > 200) continue;

        context.lineWidth = lineWidth;

        context.beginPath();
        context.moveTo(agentA.vector.x, agentA.vector.y);
        context.lineTo(agentB.vector.x, agentB.vector.y);
        context.stroke();
      }
    }

    agents.forEach((agent) => {
      agent.update();
      agent.bounce(width, height);
      agent.draw(context);
    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(vector) {
    const dx = this.x - vector.x;
    const dy = this.y - vector.y;

    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y) {
    this.vector = new Vector(x, y);
    this.radius = random.range(4, 12);
    this.velocity = new Vector(random.range(-1, 1), random.range(-1, 1));
  }

  update() {
    this.vector.x += this.velocity.x;
    this.vector.y += this.velocity.y;
  }

  bounce(width, height) {
    if (this.vector.x < 0 || this.vector.x > width) {
      this.velocity.x = -this.velocity.x;
    }

    if (this.vector.y < 0 || this.vector.y > height) {
      this.velocity.y = -this.velocity.y;
    }
  }

  draw(context) {
    context.save();

    context.translate(this.vector.x, this.vector.y);
    context.lineWidth = random.range(1, 2);

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore();
  }
}
