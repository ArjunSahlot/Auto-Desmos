let equationIndex = 0;

function handleResponse(response) {
	let open = false;
	let i = 0;
	response.replace("'", '"');
	while (i < response.length) {
		if (response[i] === '"') {
			open = !open;
		} else if (response[i] === " ") {
			if (!open) {
				response = response.slice(0, i) + response.slice(i + 1);
				i--;
			}
		}
		i++;
	}

	response = JSON.parse(response);

	if (response.mode === "equations") {
		for (let i = 0; i < response.value.length; i++) {
			addEquation(response.value[i]);
		}
	} else if (response.mode === "error") {
		alert("Error: " + response.value);
	}
}

function addEquation(latex) {
	add = (equationIndex, latex) => {
		Calc.setExpression({ id: equationIndex.toString(), latex: latex });
	};

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			world: "MAIN",
			func: add,
			args: [equationIndex, latex],
		});
	});

	equationIndex++;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "handleResponse") {
		handleResponse(request.response);
	}
});
