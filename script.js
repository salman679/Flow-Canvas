const canvas = document.getElementById("canvas");
const addNodeBtn = document.getElementById("addNodeBtn");
const nodeSelector = document.getElementById("nodeSelector");
const connectionsSVG = document.getElementById("connections");
const scrollContainer = document.getElementById("scrollContainer");
const nodes = [];
const connections = [];
let selectedSource = null;

// Toggle sidebar
addNodeBtn.onclick = () => {
  nodeSelector.classList.toggle("hidden");
};

scrollContainer.addEventListener("scroll", () => {
  const scrollX = scrollContainer.scrollLeft;
  const scrollY = scrollContainer.scrollTop;
  const visibleWidth = scrollContainer.clientWidth;
  const visibleHeight = scrollContainer.clientHeight;

  const canvasWidth = canvas.offsetWidth;
  const canvasHeight = canvas.offsetHeight;

  // Check if near the right edge
  if (scrollX + visibleWidth > canvasWidth - 200) {
    canvas.style.width = canvasWidth + 200 + "px";
  }

  // Check if near the bottom edge
  if (scrollY + visibleHeight > canvasHeight - 200) {
    canvas.style.height = canvasHeight + 200 + "px";
  }
});

// function createNode(type, svgElement) {
//   const node = document.createElement("div");
//   node.className =
//     "absolute bg-[#2d2e2e] border border-gray-500 rounded-lg shadow-md px-4 py-3 w-48 text-center text-white";

//   node.style.top = `${100 + Math.random() * 300}px`;
//   node.style.left = `${100 + Math.random() * 500}px`;

//   const title = type === "Switch" ? "Switch" : "Edit Fields";
//   const subtitle = type === "Switch" ? "mode:Rules" : "manual";

//   const nodeContent = `
//     <div class="relative">
//       <div class="port port-left"></div>
//       <div class="port port-right"></div>
//     </div>
//     <div class="flex justify-center mb-2 mt-1">
//     </div>
//     <div class="font-bold text-[15px]">${title}</div>
//     <div class="text-gray-300 text-sm">${subtitle}</div>
//     <button class="connect-btn mt-2 bg-blue-600 hover:bg-blue-500 px-2 py-1 text-sm rounded">+</button>
//   `;

//   node.innerHTML = nodeContent;

//   // Append cloned SVG into the center area
//   const clonedSvg = svgElement.cloneNode(true);
//   clonedSvg.classList.add("w-10", "h-10", "text-blue-400");
//   node.querySelector(".flex").appendChild(clonedSvg);

//   canvas.appendChild(node);
//   nodes.push(node);
//   enableDrag(node);

//   // Connect button logic
//   const connectBtn = node.querySelector(".connect-btn");
//   connectBtn.addEventListener("click", () => {
//     if (!selectedSource) {
//       selectedSource = node;
//       connectBtn.classList.add("bg-green-600");
//     } else if (selectedSource !== node) {
//       connections.push([selectedSource, node]);
//       selectedSource
//         .querySelector(".connect-btn")
//         .classList.remove("bg-green-600");
//       selectedSource = null;
//       drawConnections();
//     }
//   });
// }

nodeSelector.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const svg = btn.querySelector("svg");

    createNode(btn.dataset.type, svg);

    nodeSelector.classList.add("hidden");
  });
});

function createNode(type, svgElement) {
  const node = document.createElement("div");
  node.className = "absolute flex flex-col items-center text-white";
  node.style.top = `${100 + Math.random() * 300}px`;
  node.style.left = `${100 + Math.random() * 500}px`;

  const title = type === "Switch" ? "Switch" : "Edit Fields";
  const subtitle = type === "Switch" ? "mode:Rules" : "manual";

  // Append cloned SVG into the center area

  node.innerHTML = `  
    <!-- Node Box -->
    <div class="relative w-24 h-24 bg-[#2d2e2e] border border-gray-500 rounded-md">
<div class="svgIcon"></div>
      <button class="connect-btn outside-plus bg-blue-600 hover:bg-blue-500 text-sm w-6 h-6 rounded-full">+</button>
    </div>

    <!-- Title and Subtitle -->
    <div class="text-center mt-1">
      <div class="font-semibold text-sm">${title}</div>
      <div class="text-xs text-gray-300">${subtitle}</div>
    </div>
  `;

  const clonedSvg = svgElement.cloneNode(true);
  clonedSvg.classList.add("w-10", "h-10", "text-blue-400");
  node.querySelector(".svgIcon").appendChild(clonedSvg);

  canvas.appendChild(node);
  nodes.push(node);
  enableDrag(node);

  // Connection logic
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
    // node.style.cursor = "grabbing";
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
