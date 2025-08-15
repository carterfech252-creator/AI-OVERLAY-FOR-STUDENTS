document.addEventListener('DOMContentLoaded', () => {
    const promptForm = document.getElementById('prompt-form');
    const promptInput = document.getElementById('prompt-input');
    const loadingIndicator = document.getElementById('loading-indicator');

    promptForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const prompt = promptInput.value.trim();
        if (prompt) {
            loadingIndicator.style.display = 'block';
            callGeminiAPI(prompt);
        }
    });
});

async function callGeminiAPI(prompt) {
    // IMPORTANT: Storing API keys in client-side code is insecure and not recommended for production applications.
    // This is included as per the user's request for a personal-use-only extension.
    const apiKey = 'AIzaSyBgLiTT6JDYtf1IxVAtVkqhPUfIFtNTZhQ';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    // Add the "humanize" instruction to the prompt
    const fullPrompt = `${prompt}\n\nPlease write the response in a way that sounds as human as possible.`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }]
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData.error.message}`);
        }

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "typeText", text: text }, () => {
                window.close(); // Close the popup after sending the message
            });
        });

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        loadingIndicator.innerText = `Error: ${error.message}`;
        // Don't hide the indicator on error, so the user can see the message
    }
}
