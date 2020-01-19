const path = require("path");
const { app, BrowserWindow, clipboard, Menu, Tray } = require("electron");
const ukogi = require("ukogi");
const getScreenshot = require("./lib/getScreenshot");

const strings = require("./strings.json");

const appDir = path.join(__dirname, "app");

let win, tray;

function initWindow() {
    return new Promise((resolve, reject) => {
        win = new BrowserWindow({
            title: strings.appName,
            show: false,
            frame: false,
            transparent: true,
            thickFrame: false,
            webPreferences: {
                nodeIntegration: true,
            },
        });
        win.setFullScreen(true);
        win.loadFile(path.join(appDir, "select", "index.html")).then(resolve);
    });
}

function showScreenshot(filename) {
    return new Promise((resolve, reject) => {
        ukogi.send("show_screenshot", {
            filename
        }, resolve);
    });
}

function initTray() {
    tray = new Tray("build/icon.png");
    tray.setToolTip(strings.appName);

    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: strings.appName,
            enabled: false,
        }, {
            label: strings.menu.takeScreenshot,
            click: doScreenshot,
        }, {
            label: strings.menu.quit,
            click: quitApp,
        },
    ]));

    tray.on("click", doScreenshot);
}

async function doScreenshot() {
    const { filename } = await getScreenshot();
    await initWindow();
    await showScreenshot(filename);
    win.show();
}

function quitApp() {
    tray.destroy();
    app.quit();
}

async function main() {
    initTray();

    ukogi.on("grab_color", (e, colorStr) => {
        clipboard.clear();
        clipboard.writeText(colorStr);
    });
}

app.on("window-all-closed", e => e.preventDefault());
app.on("ready", main);
