const tooltip = document.getElementById("tooltip");

let topPos=0, leftPos=0;
function showTooltip(element)
{
	if(!element)
		throw new Error("No element given");
	
	const rect = element.getBoundingClientRect();
	topPos = rect.top+50;
	leftPos = rect.left+50;

	tooltip.style=`top:${topPos}px;left:${leftPos}px;opacity:90%;`
	tooltip.textContent =  element.dataset.tooltip;
}

function hideTooltip()
{
	tooltip.style=`top:${topPos}px;left:${leftPos}px;opacity:0%;`
}
hideTooltip();

let timeoutId = null;

const buttons = document.querySelectorAll(".tool-button");
for(const button of buttons)
{
	button.addEventListener("mouseover", (e)=>{
		timeoutId = setTimeout(showTooltip.bind(null, e.currentTarget), 1000);
	});

	button.addEventListener("mouseout", (e)=>{
		clearTimeout(timeoutId);
		hideTooltip();
	});

	button.addEventListener("click", (e)=>{
		clearTimeout(timeoutId);
		hideTooltip();
	});
}
