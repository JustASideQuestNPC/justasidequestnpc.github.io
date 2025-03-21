export default function addCanvasListeners({ canvas, disableContextMenu = true, keyPressed, keyReleased, mousePressed, mouseReleased, mouseWheel }) {
    if (keyPressed || keyReleased || mousePressed || mouseReleased || disableContextMenu) {
        const c = document.getElementById(canvas.id());
        c.tabIndex = -1;
        if (mousePressed) {
            c.addEventListener("mousedown", mousePressed);
        }
        if (mouseReleased) {
            c.addEventListener("mouseup", mouseReleased);
        }
        if (keyPressed) {
            c.addEventListener("keydown", keyPressed);
        }
        if (keyReleased) {
            c.addEventListener("keyup", keyReleased);
        }
        if (scroll) {
            c.addEventListener("wheel", mouseWheel);
        }
        if (disableContextMenu) {
            c.addEventListener("contextmenu", e => e.preventDefault());
        }
    }
}
//# sourceMappingURL=listener-generator.js.map