import { useEffect, useState } from "react";
import frailtyData from "./frailty_map.json";
import { iso3ToSvgId } from "./iso3ToSvgId";


function SVGWorldMap() {
  const [tooltip, setTooltip] = useState(null);

  const dataMap = {};
  frailtyData.forEach(d => {
    const svgId = iso3ToSvgId[d.iso3];
if (svgId) dataMap[svgId] = d.frailty_rate;
});

  useEffect(() => {
    fetch("/world.svg")
      .then(res => res.text())
      .then(svg => {
        document.getElementById("svg-container").innerHTML = svg;

        document.querySelectorAll("svg path").forEach(path => {
        const svgId = path.id;
        const value = dataMap[svgId];

          path.style.fill = value !== undefined ? "#d43c0dff" : "#ffffffff";
          path.style.stroke = "#000000ff";
          path.style.strokeWidth = "0.4";

          if (value !== undefined) {
            path.onmouseenter = e => {
              path.style.fill = "#e25858ff";
              setTooltip({
                x: e.clientX,
                y: e.clientY,
                country: svgId,
                value
              });
            };
            path.onmouseleave = () => {
              path.style.fill = "#d43c0dff";
              setTooltip(null);
            };
          }
        });
      });
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <div id="svg-container" />
      {tooltip && (
        <div style={{
          position: "fixed",
          top: tooltip.y + 10,
          left: tooltip.x + 10,
          background: "#020617",
          color: "#dcbfbfff",
          padding: "8px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          pointerEvents: "none"
        }}>
          <strong>{tooltip.country}</strong><br />
          Non-Frailty: {100-(tooltip.value * 100).toFixed(2)}%<br />
          Frailty: {(tooltip.value * 100).toFixed(2)}%
        </div>
      )}
    </div>
  );
}

export default SVGWorldMap;
