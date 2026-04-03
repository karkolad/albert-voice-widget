import { Conversation } from "https://cdn.jsdelivr.net/npm/@elevenlabs/client@latest/+esm";

const btn = document.getElementById("callBtn");
const status = document.getElementById("status");
const label = document.getElementById("callLabel");

let conversation = null;

function setUI(state) {
  switch (state) {
    case "ready":
      status.textContent = "Připraveno";
      status.className = "status";
      btn.className = "call-btn";
      btn.disabled = false;
      label.textContent = "Zavolat Albertovi";
      break;
    case "connecting":
      status.textContent = "Připojuji se...";
      status.className = "status active";
      btn.className = "call-btn connecting";
      btn.disabled = true;
      label.textContent = "Čekejte...";
      break;
    case "active":
      status.textContent = "Probíhá hovor...";
      status.className = "status active";
      btn.className = "call-btn active";
      btn.disabled = false;
      label.textContent = "Ukončit hovor";
      break;
    case "ended":
      status.textContent = "Hovor ukončen";
      status.className = "status ended";
      btn.className = "call-btn";
      btn.disabled = false;
      label.textContent = "Zavolat znovu";
      break;
  }
}

async function startCall() {
  setUI("connecting");

  try {
    const res = await fetch("/api/signed-url");
    if (!res.ok) throw new Error("Nepodařilo se získat signed URL");
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
        setUI("ended");
        status.textContent = "Chyba spojení";
      },
    });
  } catch (err) {
    console.error("Start call error:", err);
    setUI("ended");
    status.textContent = "Nepodařilo se připojit";
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
