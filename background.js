async function getCookie() {
  const cookie = (await chrome.cookies.getAll({ url: 'https://chat.openai.com/' }))
    .map((cookie) => {
      return `${cookie.name}=${cookie.value}`
    })
    .join('; ')
  return cookie;
}

async function getToken() {
  const resp = await fetch('https://chat.openai.com/api/auth/session', {
    headers: {
      Cookie: await getCookie(),
    },
  })
  if (resp.status === 403) {
    throw new Error('CLOUDFLARE')
  }
  const data = await resp.json().catch(() => ({}))
  if (!data.accessToken) {
    throw new Error('UNAUTHORIZED')
  }
  return data.accessToken
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getToken') {
    getToken()
      .then((token) => {
        sendResponse({ token: token });
      })
      .catch((error) => {
        sendResponse({ error: error.message });
      });
    return true;
  } else if (request.action === 'getCookie') {
    getCookie()
      .then((token) => {
        sendResponse({ token: token });
      })
      .catch((error) => {
        sendResponse({ error: error.message });
      });
    return true;
  }
});
