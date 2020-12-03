import("./style.scss");
import {Sketchbook} from "./Sketchbook.js"
import {FillMode} from "./modes.js"

const sketchbook = new Sketchbook();
const mode = new FillMode(sketchbook);

mode.activate();

document.querySelector("#undo-button").addEventListener("click", ()=>{
	sketchbook.popHistory();
})

document.querySelector("#color-button").addEventListener("change", e=>{
	mode.setColor(e.currentTarget.value);
})

document.querySelector("#next-button").addEventListener("click", e=>{
	sketchbook.nextPage();
})
document.querySelector("#prev-button").addEventListener("click", e=>{
	sketchbook.prevPage();
})


