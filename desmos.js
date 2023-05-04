// create a function that sleeps for a given number of milliseconds
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
console.log("now")
sleep(4000);
Calc.setExpression({ id: '0', latex: 'x = y' });
const rightContainer = document.getElementsByClassName('align-right-container')[0];

// Create a container for the input and button
const inputContainer = document.createElement('div');
rightContainer.prepend(inputContainer);
inputContainer.style.position = 'relative';
inputContainer.style.display = 'inline-block';
inputContainer.style.width = '125px';
inputContainer.style.marginRight = '10px';
inputContainer.style.transition = 'all 0.3s';

const inputElement = document.createElement('input');
inputContainer.appendChild(inputElement);

inputElement.type = 'text';
inputElement.placeholder = 'Ask Desmos...';

inputElement.style.border = '1px solid rgba(0, 0, 0, 0.15)';
inputElement.style.borderRadius = '4px';
inputElement.style.padding = '5px';
inputElement.style.fontSize = '14px';
inputElement.style.outline = 'none';
inputElement.style.width = '100%';

inputElement.addEventListener('focus', function () {
  inputContainer.style.width = '450px';
  inputElement.style.borderColor = 'rgba(0, 0, 0, 0.35)';
});
inputElement.addEventListener('blur', function () {
  inputContainer.style.width = '125px';
  inputElement.style.borderColor = 'rgba(0, 0, 0, 0.15)';
});

// Create the send button
const sendButton = document.createElement("button");
inputContainer.appendChild(sendButton);

// Add SVG for paper airplane
sendButton.innerHTML = `<svg width="22" height="22" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="#000000" fill="none"><path d="M38.61,54.93,27.94,35.57,9.08,25.38a1,1,0,0,1,.2-1.8L54.08,8.64a1,1,0,0,1,1.27,1.27L40.41,54.73A1,1,0,0,1,38.61,54.93Z"/><line x1="55.13" y1="8.91" x2="27.94" y2="35.57" stroke-linecap="round"/></svg>`;

// Style the send button
sendButton.style.background = 'none';
sendButton.style.border = 'none';
sendButton.style.cursor = 'pointer';
sendButton.style.outline = 'none';
sendButton.style.position = 'absolute';
sendButton.style.right = '0';
sendButton.style.top = '50%';
sendButton.style.transform = 'translateY(-50%)';

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

async function getToken() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'getToken' }, (response) => {
      if (response.token) {
        resolve(response.token);
      } else {
        reject(new Error(response.error));
      }
    });
  });
}

async function getCookie() {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'getCookie' }, (response) => {
      if (response.token) {
        resolve(response.token);
      } else {
        reject(new Error(response.error));
      }
    });
  });
}

async function askChatGPT(question) {
  try {
    const response = await fetch('https://chatgpt-proxy-arjunsahlot.koyeb.app/pawanchatgpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: [{"role": "user", "content": question}] })
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const answer = data.answer;

    return answer;

  } catch (error) {
    console.log(error);
    alert('Error:', error);
  }
}

sendButton.addEventListener('click', async function () {
  try {
    const question = inputElement.value;
    const response = await askChatGPT(CHATGPT_PROMPT.replace('{[#*#$#$#@#]}', question));
    inputElement.value = '';
    responseJSON = JSON.parse(response);
    console.log(responseJSON);
  } catch (error) {
    console.log(error);
    alert(error);
  }
});
