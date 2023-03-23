const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

const conversationHistory = [
    {
        role: "system",
        content:
            "You are ChatGPT 3.5 Turbo, the world's best AI Assistant, and are willing to help answer any question as best as possible",
    },
];

function appendMessage(role, content, hidden = false, invisible = false) {
    const message = document.createElement("div");
    message.classList.add("message", role);
    if (hidden) {
        message.classList.add("hidden");
    }
    if (invisible) {
        message.classList.add("invisible");
    }
    const contentElement = document.createElement("div");
    contentElement.classList.add("content");
    contentElement.innerHTML = content.replace(/(?<=\d\.)(?=\s\S)/g, '<br>').replace(/\n/g, '<br>');
    message.appendChild(contentElement);
    chatbox.appendChild(message);
    setTimeout(() => {
        chatbox.scrollTop = chatbox.scrollHeight;
    }, 0);
}

function showPulsingDots() {
    const dots = document.createElement("div");
    dots.classList.add("pulsing-dots");
    dots.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    chatbox.appendChild(dots);
}

function removePulsingDots() {
    const dots = chatbox.querySelector(".pulsing-dots");
    if (dots) {
        chatbox.removeChild(dots);
    }
}

function playTypingSound() {
    const audio = new Audio('');
    audio.volume = 0.5;
    
}

async function typeResponse(response) {
    const typingDelay = 10;
    const responseElement = document.createElement("div");
    responseElement.classList.add("assistant", "content");
    chatbox.appendChild(responseElement);

    for (let i = 0; i < response.length; i++) {
        responseElement.innerHTML += response.charAt(i);
        await new Promise((resolve) => setTimeout(resolve, typingDelay));
        playTypingSound();
    }

    chatbox.scrollTop = chatbox.scrollHeight;
}

sendBtn.addEventListener("click", async () => {
    const message = userInput.value.trim();
    if (!message) return;

    userInput.value = "";
    appendMessage("user", message);
    conversationHistory.push({ role: "user", content: message });

    // Show pulsing dots
    showPulsingDots();

    const response = await fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: conversationHistory }),
    });

    const data = await response.json();

    // Remove pulsing dots
    removePulsingDots();

    // Type out the response with a typing sound
    await typeResponse(data.response);

    conversationHistory.push({ role: "assistant", content: data.response });
});

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendBtn.click();
    }
});

appendMessage("system", "You are ChatGPT 3.5 Turbo, the world's best AI Assistant, and are willing to help answer any question as best as possible", true);

