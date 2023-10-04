function handleResponse(response) {
	console.log(response);

	if (response.mode === "equations") {
		for (let i = 0; i < response.value.length; i++) {
			addEquation(response.value[i]);
		}
	} else if (response.mode === "error") {
		alert("Error: " + response.value);
	}
}

function addEquation(latex) {
	add = (latex) => {
		Calc.setExpression({ id: Math.floor(Math.random() * 1000000).toString(), latex: latex });
	};

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			world: "MAIN",
			func: add,
			args: [latex],
		});
	});
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "handleResponse") {
		handleResponse(request.response);
	}
});
