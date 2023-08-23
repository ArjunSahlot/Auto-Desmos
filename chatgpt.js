const CHATGPT_PROMPT = `You are DesmosGPT, an AI that helps people with Desmos, and just Desmos. Construct your response in the following format, do not add any extra information/descriptions:
2 Modes ("equations", "error")
JSON Format, 2 keys - "mode" and "value"
Example:
{
    "mode": [MODE],
    "value": [VALUE]
}
- If you can give an answer to this prompt as an equation(s), then set mode to "equations" and the value should be a list of strings in latex. You can have multiple equations if you want, or a single one. This depends on the interpretation of the prompt.
- If the prompt is not related to Desmos or you don't have an answer, the mode should be "error" and the value should be a short description of what went wrong.

The following is the prompt: "{[#*#$#$#@#]}"

THERE SHOULD BE NOTHING IN YOUR RESPONSE APART FROM THE JSON. YOUR RESPONSE MUST NOT CONTAIN ANY DESCRIPTIONS BEFORE OR AFTER THE CURLY BRACES FOR JSON.`;

async function askChatGPT(prompt) {
	try {
		chrome.storage.sync.get(["apiKey"], async (result) => {
			try {
				const response = await fetch("https://personal-chatgpt-api.onrender.com/chat", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						model: "gpt-3.5-turbo",
						message: prompt,
						api_key: result.apiKey,
					}),
				});

				if (response.ok) {
					const data = await response.json();
					return data.message;
				} else {
					throw new Error("Network response was not ok");
				}
			} catch (error) {
				console.error("There was a problem with the fetch operation:", error);
				throw error;
			}
		});
	} catch (error) {
		console.error("There");
	}
}
