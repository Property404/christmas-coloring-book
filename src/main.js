import("./style.scss");
import {Sketchbook} from "./Sketchbook.js"
import {FillMode} from "./modes.js"

const sketchbook = new Sketchbook();
const mode = new FillMode(sketchbook);
mode.activate();

document.querySelector("#undo-button").addEventListener("click", ()=>{
	sketchbook.popHistory();
})


