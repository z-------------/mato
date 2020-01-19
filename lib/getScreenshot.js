const screenshot = require("screenshot-desktop");
const path = require("path");
const { app } = require("electron");

const tempDir = app.getPath("temp");

const generateFilename = () => `screenshot-${Date.now()}.png`;

const getScreenshot = async () => {
    const filename = path.join(tempDir, generateFilename());
    await screenshot({ filename });
    return { filename };
};

module.exports = getScreenshot;
