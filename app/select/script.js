const ukogi = require("ukogi");
const fileUrl = require("file-url");
const { width, height, scaleFactor } = require("../../lib/screenSize");

const currentColor = [];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorEl = document.getElementById("color");
const colorCodeEl = document.getElementById("color-code");
const colorShowEl = document.getElementById("color-show");

canvas.width = width;
canvas.height = height;

function getColor(ctx, x, y) {
    const w = canvas.width;
    const { data } = ctx.getImageData(0, 0, w, canvas.height);
    const i = 4 * (y * w + x);
    return [data[i], data[i + 1], data[i + 2]];
}

function rgbToHex(rgb) {
    return "#" + rgb.map(val => val.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function showScreenshot(filename) {
    return new Promise((resolve, reject) => {
        const image = document.createElement("img");
        image.addEventListener("load", () => {
            ctx.drawImage(image, 0, 0);
            resolve();
        });
        image.src = fileUrl(filename);
    });
}

function saveColor([r, g, b]) {
    currentColor[0] = r;
    currentColor[1] = g;
    currentColor[2] = b;
}

function selectColor(x, y) {
    const rgb = getColor(ctx, x, y);
    saveColor(rgb);

    const hex = rgbToHex(rgb);
    colorCodeEl.textContent = hex;
    colorShowEl.style.backgroundColor = hex;
}

function sendColor() {
    ukogi.send("grab_color", rgbToHex(currentColor));
}

function positionSelector({ screenX, screenY }) {
    colorEl.style.transform = `translateX(${screenX}px) translateY(${screenY}px)`;
}

function initSelector() {
    colorEl.classList.add("visible");
    window.addEventListener("mousemove", ({ screenX, screenY }) => {
        const x = Math.floor(screenX * scaleFactor);
        const y = Math.floor(screenY * scaleFactor);
        selectColor(x, y);
        positionSelector({ screenX, screenY });
    });
}

async function main({ filename }, reply) {
    await showScreenshot(filename);
    reply();
    initSelector();
}

window.addEventListener("click", () => {
    sendColor();
    window.close();
});

window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        window.close();
    }
});

ukogi.on("show_screenshot", async (e, arg, reply) => {
    await main(arg, reply);
});
