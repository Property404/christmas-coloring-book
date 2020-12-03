/*
 * This file contains all the drawing logic
 *
 * Each block of drawing logic is separated out into a
 * Mode child class*/
import {absoluteToCanvas} from "./utils.js";

class Color
{
	constructor(r,g,b,a=255)
	{
		if(typeof r == "string" && g == null && b == null)
		{
			if(r[0]!=="#")
				throw("String input to Color constructor should be #hex value");

			const hexToRgb = hex =>
				hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
					,(m, r, g, b) => '#' + r + r + g + g + b + b)
					.substring(1).match(/.{2}/g)
					.map(x => parseInt(x, 16))

			const arr = hexToRgb(r);
			[r, g,b] = arr;
		}
		else
		{
			const list = [r,g,b,a];
			for(let i=0;i<4;i++)
			{
				if(
					list[i] === null ||
					list[i] === undefined ||
					list[i] > 255 || 
					list[i] < 0
				)
					throw new Error("Invalid constructor arguments for Color");
			}
		}
		this.red = r;
		this.green = g;
		this.blue = b;
		this.alpha = a;
	}

	asCSS(){
		return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
	}

	equals(color)
	{
		if(
			color.red === this.red &&
			color.green === this.green &&
			color.blue === this.blue &&
			color.alpha === this.alpha)
		{
			return true;
		}
		return false;
	}
}

class Mode
{
	constructor(sketchbook)
	{
		this.sketchbook = sketchbook;
		this.canvas = sketchbook.canvas;
		this.context = this.canvas.getContext("2d");
		
		this.color = new Color(255,0,0);
		if(!this.canvas)
		{
			alert("What the fuck is wrong with you");
		}
	}

	setColor(color_description)
	{
		this.color =  new Color(color_description);
	}

	deactivate()
	{
		this.canvas.onmouseup = null;
		this.canvas.onmousedown = null;
		this.canvas.onclick = null;
		this.canvas.onmousemove = null;
		this.context = null;
	}

	activate() { }
}

// Erase with a block
export class FillMode extends Mode
{
	constructor(sketchbook)
	{
		super(sketchbook);
	}
	
	activate()
	{
		Mode.prototype.activate.call(this);
		this.canvas.onclick = this.#fill.bind(this);
	}

	#getColorAt(color_layer, x,y)
	{
		const index = (y*this.canvas.width + x)*4;
		if(!Number.isInteger(index))
		{
			throw("Fuck all");
		}

		return new Color(
			color_layer.data[index+0],
			color_layer.data[index+1],
			color_layer.data[index+2],
			color_layer.data[index+3]
		);
	}

	#fill(e)
	{
		let [start_x, start_y] = absoluteToCanvas(this.canvas, e.clientX,e.clientY);
		start_x = Math.round(start_x);
		start_y = Math.round(start_y);

		const color_layer = this.context.getImageData(0,0,this.canvas.width,this.canvas.height);
		const old_color = this.#getColorAt(color_layer, start_x,start_y)

		// Sanity check
		if(old_color.equals(this.color))
		{
			return;
		}

		this.sketchbook.pushHistory();

		const canvas_width = this.canvas.width;
		const canvas_height = this.canvas.height;
		
		const stack = [[start_x, start_y]];

		while(stack.length)
		{
			const new_position = stack.pop();
			let x = new_position[0];
			let y = new_position[1];

			let pixel_index = (y*canvas_width + x) *4;
			while(y-- >= 0 && this.matchStartColor(color_layer, pixel_index, old_color))
			{
				pixel_index -= canvas_width * 4;
			}
			pixel_index += canvas_width * 4;
			y++;

			let reach_left = false;
			let reach_right = false;

			while(y++ < canvas_height - 1 && this.matchStartColor(color_layer, pixel_index, old_color))
			{
				this.colorPixel(color_layer, pixel_index);
				
				if(x>0)
				{
					if(this.matchStartColor(color_layer, pixel_index - 4, old_color))
					{
						if(!reach_left)
						{
							stack.push([x-1,y]);
							reach_left = true;
						}
					}
					else if(reach_left)
					{
						reach_left = false;
					}
				}

				if(x< canvas_width - 1)
				{
					if(this.matchStartColor(color_layer, pixel_index + 4, old_color))
					{
						if(!reach_right)
						{
							stack.push([x+1,y]);
							reach_right = true;
						}
					}
					else if(reach_right)
					{
						reach_right = false;
					}
				}

				pixel_index += canvas_width * 4;
			}
		}

		this.context.putImageData(color_layer, 0, 0);
	}

	matchStartColor(color_layer, pixel_index, old_color)
	{
		const red = color_layer.data[pixel_index];
		const green = color_layer.data[pixel_index+1];
		const blue = color_layer.data[pixel_index+2];
		const alpha = color_layer.data[pixel_index+3];
		if(red == old_color.red &&
			green == old_color.green &&
			blue == old_color.blue &&
			alpha == old_color.alpha
		)
		{
			return true;
		}
		return false;
	}

	colorPixel(color_layer, pixel_index)
	{
		color_layer.data[pixel_index] = this.color.red;
		color_layer.data[pixel_index+1] = this.color.green;
		color_layer.data[pixel_index+2] = this.color.blue;
		color_layer.data[pixel_index+3] = this.color.alpha;
	}
}
