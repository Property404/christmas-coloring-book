const ALPHANUMERICBET =
		"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";

export function cloneFromTemplate(template_query, container_query)
{
	const template = document.querySelector(template_query);
	const container = document.querySelector(container_query);
	const element = template.cloneNode(true);
	element.removeAttribute("id");
	element.removeAttribute("hidden");
	container.appendChild(element);
	return element;
}

/* Max and min are inclusive */
export function randomInteger(min, max)
{
	return Math.floor(Math.random()*(1+max-min))+min;
}

/* Gives about 192 bit ids */
export function randomId()
{
	let id = "uniqueid_";
	for(let i=0;i<32;i++)
	{
		const c = ALPHANUMERICBET[
			randomInteger(0, ALPHANUMERICBET.length-1)];
		id+=c;
	}
	return id;
}

// Convert absolute coordinates to canvas coordinates
export function absoluteToCanvas(canvas, absolute_x, absolute_y)
{
	if(absolute_y == null)
		alert("FUCK");
	const bbox = canvas.getBoundingClientRect();
	const width_ratio = 1*canvas.width/(bbox.right-bbox.left)
	const height_ratio = 1*canvas.height/(bbox.bottom-bbox.top)
	console.log(width_ratio);
	return [(absolute_x-bbox.left) * width_ratio, (absolute_y-bbox.top)*height_ratio];
}
