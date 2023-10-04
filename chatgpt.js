const CHATGPT_PROMPT = `You are DesmosGPT, an AI that helps people with Desmos, and just Desmos. You are given the following prompt: "{[#*#$#$#@#]}".
The user wants this modification to their Desmos graph.
If you think the user is trying to add equations to their graph, then set mode to "equations" and the value should be a list of strings in latex. You can have multiple equations if you want, or a single one. This depends on the interpretation of the prompt.
If you think the prompt is not related to Desmos or you don't have an answer, the mode should be "error" and the value should be a short description of what went wrong.`;

async function askChatGPT(prompt, handleResponse) {
	try {
		chrome.storage.sync.get(["apiKey"], async (result) => {
			try {
				console.log("TRYING TO FETCH");
				const response = await fetch("https://personal-chatgpt-api.onrender.com/chat", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						model: "gpt-3.5-turbo",
						message: prompt,
						api_key: result.apiKey,
						functions: [
							{
								name: "modify_desmos",
								description: "Modifies a Desmos graph based on the mode and value parameters provided",
								parameters: {
									type: "object",
									properties: {
										mode: {
											type: "string",
											description: "The mode, for example 'equations' or 'error'",
											enum: ["equations", "error"],
										},
										value: {
											description:
												"The value based on the mode, for example a LaTeX equation string or list of strings. Or an error message string.",
										},
									},
									required: ["mode", "value"],
								},
							},
						],
						function_call: {
							name: "modify_desmos",
						},
					}),
				});
				console.log("FETCHED");

				if (response.ok) {
					const data = await response.json();
					if (!data.message.function_call) {
						throw new Error("No function call response received");
					} else {
						const arguments = JSON.parse(data.message.function_call.arguments);
						handleResponse(arguments);
						console.log("SENT");
					}
				} else {
					throw new Error("Network response was not ok");
				}
			} catch (error) {
				console.error("There was a problem with the fetch operation:", error);
				throw error;
			}
		});
	} catch (error) {
		console.error(error);
		throw error;
	}
}
