# Albert AI – Hlasový widget

WebRTC voice interface pro hands-free komunikaci s Albert AI přes ElevenLabs Conversational AI.

## Spuštění

```bash
cp .env.example .env
# Vyplň ELEVENLABS_API_KEY a ELEVENLABS_AGENT_ID v .env

npm install
npm start
```

Otevři `http://localhost:3000` v prohlížeči.

## Nastavení ElevenLabs

1. Vytvoř agenta na [elevenlabs.io/conversational-ai](https://elevenlabs.io/conversational-ai)
2. Zkopíruj Agent ID a API key do `.env`

## Použití

Klikni **Zavolat Albertovi** a mluv. Prohlížeč požádá o přístup k mikrofonu.
Funguje na iPhone / CarPlay – stačí otevřít URL a klepnout.
