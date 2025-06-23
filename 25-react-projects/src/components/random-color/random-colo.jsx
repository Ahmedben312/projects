import { useState } from "react";

function RandomColor() {
  const [color, setColor] = useState("#000000");
  const [colorType, setColorType] = useState("HEX");

  function createHexColor() {
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += Math.floor(Math.random() * 16).toString(16);
    }
    setColor(color);
    setColorType("HEX");
  }

  function generateRgbColor() {
    let color = "";
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    color = `rgb(${r}, ${g}, ${b})`;
    setColor(color);
    setColorType("RGB");
  }

  function generateRandomColor() {
    const randomChoice = colorType;
    if (randomChoice === "HEX") {
      createHexColor();
    } else if (randomChoice === "RGB") {
      generateRgbColor();
    }
  }
  return (
    <div className="container">
      <button className="create-hex-color" onClick={createHexColor}>
        Create HEX color
      </button>
      <button className="generate-rgb-color" onClick={generateRgbColor}>
        Create rgb color
      </button>
      <button className="generate-random-color" onClick={generateRandomColor}>
        Generate Random color
      </button>
      <div className="color-box" style={{ backgroundColor: color }}>
        <h1>{colorType} color</h1>
        <h1>{color}</h1>
      </div>
    </div>
  );
}

export default RandomColor;
