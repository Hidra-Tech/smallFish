const countUp = ({amount, id}) => {
  let el = document.getElementById(id); // get canvas

  let options = {
    percent: el.getAttribute("data-percent") || 25,
    size: el.getAttribute("data-size") || 330,
    lineWidth: el.getAttribute("data-line") || 15,
    rotate: el.getAttribute("data-rotate") || 0,
  };

  let canvas = document.createElement("canvas");
  canvas.classList.add("count-up");
  let span = document.createElement("span");
  span.textContent = options.percent + "%";

  if (typeof G_vmlCanvasManager !== "undefined") {
    G_vmlCanvasManager.initElement(canvas);
  }

  let ctx = canvas.getContext("2d");
  canvas.width = canvas.height = options.size;

  el.appendChild(span);
  el.appendChild(canvas);

  ctx.translate(options.size / 2, options.size / 2); // change center
  ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

  let radius = (options.size - options.lineWidth) / 2;

  let drawCircle = function (color, lineWidth, percent) {
    percent = Math.min(Math.max(0, percent || 1), 1);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
    ctx.strokeStyle = color;
    ctx.lineCap = "round"; // butt, round or square
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  drawCircle("#efefef", options.lineWidth, 100 / 100);

  const color = "#5468ff";
  let i = 0;
  let int = setInterval(function () {
    i++;
    drawCircle(color, options.lineWidth, i / amount);
    const dollar = i;
    // const cents = String(i % 100).padStart(2, 0);

    span.textContent = `\$${dollar}`;
    if (i / amount >= 1) {
      clearInterval(int);
    }
  }, 15);
};

// countUp(10);
