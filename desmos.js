const rightContainer = document.getElementsByClassName("align-right-container")[0];

// Create a container for the input and button
const inputContainer = document.createElement("div");
rightContainer.prepend(inputContainer);
inputContainer.style.position = "relative";
inputContainer.style.display = "inline-block";
inputContainer.style.width = "125px";
inputContainer.style.marginRight = "10px";
inputContainer.style.transition = "all 0.3s";

const inputElement = document.createElement("input");
inputContainer.appendChild(inputElement);

inputElement.type = "text";
inputElement.placeholder = "Ask Desmos...";

inputElement.style.border = "1px solid rgba(0, 0, 0, 0.15)";
inputElement.style.borderRadius = "4px";
inputElement.style.padding = "5px";
inputElement.style.fontSize = "14px";
inputElement.style.outline = "none";
inputElement.style.width = "100%";

inputElement.addEventListener("focus", function () {
	inputContainer.style.width = "450px";
	inputElement.style.borderColor = "rgba(0, 0, 0, 0.35)";
});
inputElement.addEventListener("blur", function () {
	inputContainer.style.width = "125px";
	inputElement.style.borderColor = "rgba(0, 0, 0, 0.15)";
});

// Create the send button
const sendButton = document.createElement("button");
inputContainer.appendChild(sendButton);

// Add SVG for paper airplane
sendButton.innerHTML = `<svg width="22" height="22" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="#000000" fill="none"><path d="M38.61,54.93,27.94,35.57,9.08,25.38a1,1,0,0,1,.2-1.8L54.08,8.64a1,1,0,0,1,1.27,1.27L40.41,54.73A1,1,0,0,1,38.61,54.93Z"/><line x1="55.13" y1="8.91" x2="27.94" y2="35.57" stroke-linecap="round"/></svg>`;

// Style the send button
sendButton.style.background = "none";
sendButton.style.border = "none";
sendButton.style.cursor = "pointer";
sendButton.style.outline = "none";
sendButton.style.position = "absolute";
sendButton.style.right = "0";
sendButton.style.top = "50%";
sendButton.style.transform = "translateY(-50%)";

function handleResponse(response) {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage({ action: "handleResponse", response: response });
	});
}

sendButton.addEventListener("click", async function () {
	try {
		const question = inputElement.value;
		const response = await askChatGPT(CHATGPT_PROMPT.replace("{[#*#$#$#@#]}", question));
		console.log(response);
		handleResponse(response);
		inputElement.value = "";
	} catch (error) {
		console.log(error);
		alert(error);
	}
});
