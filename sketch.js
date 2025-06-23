// Pixel-Sorting mit deutlich sichtbaren Rasterbändern, selektiven Feldern
let img;

let gridCols = 5;
let gridRows = 5;
let maxSortLength = 190;
let numSelectedCells = 11; // Anzahl Rasterzellen, die sortiert werden
let selectedCells = [];

function preload() {
  img = loadImage('assets/asset_image_7.jpeg'); // <--- Pfad anpassen!
}

function setup() {
  createCanvas(img.width, img.height);
  pixelDensity(1);
  img.loadPixels();

  let cellW = floor(width / gridCols);
  let cellH = floor(height / gridRows);

  // Rasterzellen sammeln und zufällig auswählen
  let allCells = [];
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      allCells.push({ row, col });
    }
  }
  shuffle(allCells, true);
  selectedCells = allCells.slice(0, numSelectedCells);

  for (let cell of selectedCells) {
    let x0 = cell.col * cellW;
    let y0 = cell.row * cellH;

    // horizontal: linke Zellkante
    for (let i = 0; i < cellH; i++) {
      let y = y0 + i;
      if (y < height) {
        sortHorizontalLine(y, x0, width);
      }
    }

    // vertikal: obere Zellkante
    for (let i = 0; i < cellW; i++) {
      let x = x0 + i;
      if (x < width) {
        sortVerticalLine(x, y0, height);
      }
    }

    // diagonal von linker & oberer Zellkante
    for (let i = 0; i < cellW; i++) {
      let x = x0 + i;
      let y = y0;
      if (x < width && y < height) {
        sortDiagonalLine(x, y);
      }
    }
    for (let i = 1; i < cellH; i++) {
      let x = x0;
      let y = y0 + i;
      if (x < width && y < height) {
        sortDiagonalLine(x, y);
      }
    }
  }

  img.updatePixels();
  image(img, 0, 0);
  noLoop();
}

function sortHorizontalLine(y, xStart, xEnd) {
  let x = xStart;
  while (x < xEnd) {
    let len = floor(random(5, maxSortLength));
    if (x + len > xEnd) len = xEnd - x;

    let segment = [];
    for (let i = 0; i < len; i++) {
      let idx = 4 * (y * img.width + (x + i));
      let r = img.pixels[idx];
      let g = img.pixels[idx + 1];
      let b = img.pixels[idx + 2];
      let a = img.pixels[idx + 3];
      let brightness = (r + g + b) / 3;
      segment.push({ r, g, b, a, brightness });
    }

    segment.sort((a, b) => a.brightness - b.brightness);

    for (let i = 0; i < len; i++) {
      let idx = 4 * (y * img.width + (x + i));
      let p = segment[i];
      img.pixels[idx] = p.r;
      img.pixels[idx + 1] = p.g;
      img.pixels[idx + 2] = p.b;
      img.pixels[idx + 3] = p.a;
    }

    x += len;
  }
}

function sortVerticalLine(x, yStart, yEnd) {
  let y = yStart;
  while (y < yEnd) {
    let len = floor(random(5, maxSortLength));
    if (y + len > yEnd) len = yEnd - y;

    let segment = [];
    for (let i = 0; i < len; i++) {
      let idx = 4 * ((y + i) * img.width + x);
      let r = img.pixels[idx];
      let g = img.pixels[idx + 1];
      let b = img.pixels[idx + 2];
      let a = img.pixels[idx + 3];
      let brightness = (r + g + b) / 3;
      segment.push({ r, g, b, a, brightness });
    }

    segment.sort((a, b) => a.brightness - b.brightness);

    for (let i = 0; i < len; i++) {
      let idx = 4 * ((y + i) * img.width + x);
      let p = segment[i];
      img.pixels[idx] = p.r;
      img.pixels[idx + 1] = p.g;
      img.pixels[idx + 2] = p.b;
      img.pixels[idx + 3] = p.a;
    }

    y += len;
  }
}

function sortDiagonalLine(xStart, yStart) {
  let coords = [];
  let x = xStart;
  let y = yStart;

  while (x < img.width && y < img.height) {
    coords.push({ x, y });
    x++;
    y++;
  }

  let i = 0;
  while (i < coords.length) {
    let len = floor(random(5, maxSortLength));
    if (i + len > coords.length) len = coords.length - i;

    let segment = [];
    for (let j = 0; j < len; j++) {
      let px = coords[i + j].x;
      let py = coords[i + j].y;
      let idx = 4 * (py * img.width + px);
      let r = img.pixels[idx];
      let g = img.pixels[idx + 1];
      let b = img.pixels[idx + 2];
      let a = img.pixels[idx + 3];
      let brightness = (r + g + b) / 3;
      segment.push({ r, g, b, a, brightness });
    }

    segment.sort((a, b) => a.brightness - b.brightness);

    for (let j = 0; j < len; j++) {
      let px = coords[i + j].x;
      let py = coords[i + j].y;
      let idx = 4 * (py * img.width + px);
      let p = segment[j];
      img.pixels[idx] = p.r;
      img.pixels[idx + 1] = p.g;
      img.pixels[idx + 2] = p.b;
      img.pixels[idx + 3] = p.a;
    }

    i += len;
  }
}