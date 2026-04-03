import { Conversation } from "https://cdn.jsdelivr.net/npm/@elevenlabs/client@latest/+esm";

const btn = document.getElementById("callBtn");
const status = document.getElementById("status");
const label = document.getElementById("callLabel");

let conversation = null;

function setUI(state, msg) {
  switch (state) {
    case "ready":
      status.textContent = "Připraveno";
      status.className = "status";
      btn.className = "call-btn";
      btn.disabled = false;
      label.textContent = "🎙️ Zavolat Albertovi";
      break;
    case "connecting":
      status.textContent = "Připojuji se...";
      status.className = "status active";
      btn.className = "call-btn connecting";
      btn.disabled = true;
      label.textContent = "Čekejte...";
      break;
    case "active":
      status.textContent = "🔴 Probíhá hovor — mluvte";
      status.className = "status active";
      btn.className = "call-btn active";
      btn.disabled = false;
      label.textContent = "⏹ Ukončit hovor";
      break;
    case "ended":
      status.textContent = msg || "Hovor ukončen";
      status.className = "status ended";
      btn.className = "call-btn";
      btn.disabled = false;
      label.textContent = "🎙️ Zavolat znovu";
      break;
    case "error":
      status.textContent = msg || "Chyba";
      status.className = "status ended";
      btn.className = "call-btn";
      btn.disabled = false;
      label.textContent = "🎙️ Zkusit znovu";
      break;
  }
}

async function startCall() {
  setUI("connecting");

  // Nejdřív požádat o mikrofon
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    setUI("error", "❌ Přístup k mikrofonu zamítnut");
    return;
  }

  try {
    const res = await fetch("/api/signed-url");
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const { signed_url } = await res.json();

    conversation = await Conversation.startSession({
      signedUrl: signed_url,
      onConnect: () => setUI("active"),
      onDisconnect: () => {
        conversation = null;
        setUI("ended");
      },
      onError: (err) => {
        console.error("Conversation error:", err);
        conversation = null;
        setUI("error", "❌ Chyba: " + (err?.message || err));
      },
    });
  } catch (err) {
    console.error("Start call error:", err);
    setUI("error", "❌ " + err.message);
  }
}

async function endCall() {
  if (conversation) {
    await conversation.endSession();
    conversation = null;
  }
  setUI("ended");
}

btn.addEventListener("click", () => {
  if (conversation) {
    endCall();
  } else {
    startCall();
  }
});

// Inicializace
setUI("ready");
