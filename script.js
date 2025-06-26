const canvas = document.getElementById("canvas");
const addNodeBtn = document.getElementById("addNodeBtn");
const nodeSelector = document.getElementById("nodeSelector");
const connectionsSVG = document.getElementById("connections");
const nodes = [];
const connections = [];
let selectedSource = null;

// Toggle sidebar
addNodeBtn.onclick = () => {
  nodeSelector.classList.toggle("hidden");
};

// Node creator
nodeSelector.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    createNode(btn.dataset.type);
    console.log(btn.dataset.type);

    nodeSelector.classList.add("hidden");
  });
});

function createNode(label) {
  const node = document.createElement("div");
  node.className =
    "absolute node bg-gray-700 border border-gray-500 rounded shadow p-3 w-40";
  node.style.top = `${100 + Math.random() * 300}px`;
  node.style.left = `${100 + Math.random() * 500}px`;
  node.innerHTML = `
        <div class="font-bold mb-2">${label}</div>
        <button class="connect-btn absolute  bg-blue-600 hover:bg-blue-500 text-sm px-2 py-1 rounded">+</button>
      `;
  canvas.appendChild(node);
  nodes.push(node);
  enableDrag(node);

  // connect button
  const connectBtn = node.querySelector(".connect-btn");
  connectBtn.addEventListener("click", () => {
    if (!selectedSource) {
      selectedSource = node;
      connectBtn.classList.add("bg-green-600");
    } else if (selectedSource !== node) {
      connections.push([selectedSource, node]);
      selectedSource
        .querySelector(".connect-btn")
        .classList.remove("bg-green-600");
      selectedSource = null;
      drawConnections();
    }
  });
}

function getCenter(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 + window.scrollX,
    y: rect.top + rect.height / 2 + window.scrollY,
  };
}

function drawConnections() {
  connectionsSVG.innerHTML = "";
  connections.forEach(([from, to]) => {
    const p1 = getCenter(from);
    const p2 = getCenter(to);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", p1.x);
    line.setAttribute("y1", p1.y);
    line.setAttribute("x2", p2.x);
    line.setAttribute("y2", p2.y);
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", "2");
    connectionsSVG.appendChild(line);
  });
}

function enableDrag(node) {
  let offsetX = 0,
    offsetY = 0,
    dragging = false;

  node.addEventListener("mousedown", (e) => {
    dragging = true;
    offsetX = e.clientX - node.offsetLeft;
    offsetY = e.clientY - node.offsetTop;
    node.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (dragging) {
      node.style.left = `${e.clientX - offsetX}px`;
      node.style.top = `${e.clientY - offsetY}px`;
      drawConnections();
    }
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
    node.style.cursor = "grab";
  });
}

window.addEventListener("resize", drawConnections);
