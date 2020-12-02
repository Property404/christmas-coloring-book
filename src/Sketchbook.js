import SANTA_SRC from "./santa.png";
class Page
{
	#history=[];
	constructor()
	{
	}

	pushHistory(mainCanvas)
	{
		const mainContext = mainCanvas.getContext("2d");
		const backup = document.createElement("canvas");
		backup.width = mainCanvas.width;
		backup.height = mainCanvas.height;
		const backupContext = backup.getContext("2d");
		backupContext.drawImage(mainCanvas,0,0);
		this.#history.push(backup);
	}

	popHistory(mainCanvas)
	{
		if(this.#history.length == 0)
		{
			console.log("wall");
			return;
		}
		const backup = this.#history.pop();
		const mainContext = mainCanvas.getContext("2d");
		mainContext.clearRect(0,0, mainCanvas.width, mainCanvas.height);
		mainContext.drawImage(backup, 0, 0);
	}
}
export class Sketchbook
{
	#canvas;
	#context;
	#page;
	constructor()
	{
		this.#canvas = document.querySelector("canvas");
		this.#context = this.#canvas.getContext("2d");
		this.#page = new Page();
		this.loadOutline();
	}

	get canvas(){
		return this.#canvas;
	}

	pushHistory()
	{
		this.#page.pushHistory(this.#canvas);
	}

	popHistory()
	{
		this.#page.popHistory(this.#canvas);
	}

	loadOutline()
	{
		console.log("Loading...");
		const image = new Image();
		image.src = SANTA_SRC;
		console.log(SANTA_SRC);
		return new Promise(res=>{
			image.onload = ()=>{
				this.#context.drawImage(image, 0,0, this.#canvas.width, this.#canvas.height);
				console.log("LOADED");
				res(true);
			}
		});
	}
}
