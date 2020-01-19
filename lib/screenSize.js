const isRenderer = require("is-electron-renderer");
const electron = require("electron");
const { screen } = isRenderer ? electron.remote : electron;

const screenSize = () => {
    const display = screen.getPrimaryDisplay();
    return {
        width: display.size.width * display.scaleFactor,
        height: display.size.height * display.scaleFactor,
        scaleFactor: display.scaleFactor,
    };
};

module.exports = screenSize();
