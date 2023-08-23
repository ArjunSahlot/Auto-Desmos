document.addEventListener("DOMContentLoaded", () => {
	const saveButton = document.getElementById("save");
	const resetButton = document.getElementById("reset");
	const apiKeyInput = document.getElementById("apikey");

	chrome.storage.sync.get(["apiKey"], (result) => {
		if (result.apiKey) {
			apiKeyInput.value = result.apiKey;
		}
	});

	saveButton.addEventListener("click", () => {
		const apiKey = apiKeyInput.value;
		if (apiKey) {
			chrome.storage.sync.set({ apiKey }, () => {
				console.log("API key saved");
			});
		}
	});

	resetButton.addEventListener("click", () => {
		chrome.storage.sync.set({ apiKey: "" }, () => {
			console.log("API key saved");
			apiKeyInput.value = "";
		});
	});
});
