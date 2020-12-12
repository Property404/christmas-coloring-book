import("./style.scss");
import {Sketchbook} from "./Sketchbook.js"
import {FillMode} from "./modes.js"

const sketchbook = new Sketchbook();
const mode = new FillMode(sketchbook);

mode.activate();

function updateColor()
{
	const colorValue = document.getElementById("color-button").value;
	mode.setColor(colorValue);

	const colorButton = document.getElementById("color-button-label");
	colorButton.style=`text-shadow: 0 0 ${colorValue};`;
}

// Set initial color
updateColor();

document.querySelector("#undo-button").addEventListener("click", ()=>{
	sketchbook.popHistory();
});

document.querySelector("#color-button").addEventListener("change", e=>{
	updateColor();
});

document.querySelector("#next-button").addEventListener("click", e=>{
	sketchbook.nextPage();
});
document.querySelector("#prev-button").addEventListener("click", e=>{
	sketchbook.prevPage();
});
document.querySelector("#outline-button").addEventListener("click", e=>{
	sketchbook.pushHistory();
	sketchbook.loadOutline();
});

document.querySelector("#reset-button").addEventListener("click", e=>{
	sketchbook.pushHistory();
	sketchbook.clear();
	sketchbook.loadOutline();
});



