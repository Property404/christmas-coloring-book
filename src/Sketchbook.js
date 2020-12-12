const rc = require.context("./images", true, /^\.\/.*\.png$/)
const imageList = rc.keys().map(rc).map(x=>x.default)

class Page
{
	#history=[];
	#imagePromise;
	constructor(imageSource)
	{
		const image = new Image();
		this.#imagePromise = new Promise((res, rej)=>{
			image.onload = ()=>{
				res(image);
			}
			image.onerror = (e)=>{
				rej("Image load failed");
			}
		});
		image.src = imageSource;
	}


	getImage()
	{
		return this.#imagePromise;
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
			return false;
		}
		const backup = this.#history.pop();
		const mainContext = mainCanvas.getContext("2d");
		mainContext.clearRect(0,0, mainCanvas.width, mainCanvas.height);
		mainContext.drawImage(backup, 0, 0);
		return true;
	}
}
export class Sketchbook
{
	#canvas;
	#context;
	#pages = [];
	#page_number = 0;
	constructor()
	{
		this.#canvas = document.querySelector("canvas");
		this.#context = this.#canvas.getContext("2d");
		imageList.forEach(url=>this.#pages.push(new Page(url)));
		this.loadOutline();
	}

	get canvas(){
		return this.#canvas;
	}

	get #page(){
		return this.#pages[this.#page_number];
	}

	nextPage(){
		this.pushHistory();
		if(this.#page_number < this.#pages.length-1)
			this.#page_number++;
		else
			this.#page_number = 0;
		this.clear();
		if(!this.popHistory())
			this.loadOutline();
	}
	prevPage(){
		this.pushHistory();
		if(this.#page_number > 0)
			this.#page_number--;
		else
			this.#page_number = this.#pages.length - 1;
		this.clear();
		if(!this.popHistory())
			this.loadOutline();
	}

	pushHistory()
	{
		this.#page.pushHistory(this.#canvas);
	}

	popHistory()
	{
		return this.#page.popHistory(this.#canvas);
	}

	clear()
	{
		const width = this.#canvas.width;
		const height = this.#canvas.height;
		this.#context.clearRect(0,0, width, height);
	}

	// Draw outline of base B&W image
	loadOutline()
	{
		this.#page.getImage().then(image=>
			{
				const canvasWidth = this.#canvas.width;
				const canvasHeight = this.#canvas.height;

				// Keep track of original
				const originalPixels = this.#context.getImageData(0,0, canvasWidth, canvasHeight);

				// Draw image, but take aspect ratio into account
				const height = image.height * canvasWidth/image.width;
				this.#context.drawImage(image, 0, canvasHeight/2-height/2, canvasWidth, height);

				// Normalize color values
				const pixels = this.#context.getImageData(0,0, canvasWidth, canvasHeight);
				for(let i=0;i<pixels.data.length;i+=4)
				{
					for(let j=0;j<4;j++)
					{
						if(pixels.data[i+j]<128)
							pixels.data[i+j] = 0;
						if(pixels.data[i+j]>=128)
							pixels.data[i+j] = 255;
					}
					if(pixels.data[i] || pixels.data[i+1] || pixels.data[i+2])
					{
						for(let j=0;j<4;j++)
							pixels.data[i+j] = originalPixels.data[i+j];
					}
				}
				this.#context.putImageData(pixels, 0, 0);
			}
		);
	}
}
