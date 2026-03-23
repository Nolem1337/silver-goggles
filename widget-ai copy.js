/**
 * AI Chat Widget — Powered by Claude AI
 * ======================================
 * INSTALL: Add before </body> tag on client's website:
 * <script src="widget-ai.js"></script>
 *
 * SETUP: Edit CONFIG below. Add your Anthropic API key.
 */

(function () {

  // ============================================================
  //  CONFIG — edit for each client (5 minutes)
  // ============================================================
  const CONFIG = {
    businessName: "Bella Beauty Studio",
    brandColor: "#1a1a2e",
    position: "right",         // "right" or "left"

    // API key — each client gets their own OR you use yours and charge monthly
    apiKey: "",

    // This is the AI's personality and knowledge about the business
    systemPrompt: `You are a friendly and helpful assistant for Bella Beauty Studio, a beauty salon in Bratislava, Slovakia.

ABOUT THE BUSINESS:
- Name: Bella Beauty Studio
- Address: Obchodná 15, Bratislava
- Phone: +421 900 123 456
- Email: hello@bellabeauty.sk
- Opening hours: Mon–Fri 9:00–19:00, Sat 9:00–17:00, Sun closed

SERVICES & PRICES:
- Haircut & styling: from €25 (45–60 min)
- Color & highlights: from €45 (90–120 min)
- Manicure (classic): from €20 (45 min)
- Manicure (gel): from €30 (60 min)
- Facial treatment: from €35 (60 min)
- Eyebrow shaping: €15 (20 min)

BOOKING:
- Clients can book by calling +421 900 123 456 or emailing hello@bellabeauty.sk
- Walk-ins welcome but appointments preferred
- 24h cancellation policy

YOUR PERSONALITY:
- Warm, friendly, and professional
- Always speak in the same language the customer uses
- Keep responses short and helpful (2–4 sentences max)
- If you don't know something, offer to connect them with the team
- Always end with a helpful next step or question
- Never make up information — if unsure, refer to contact details`,

    welcomeMessage: "Hi there! 👋 I'm the AI assistant for Bella Beauty Studio. How can I help you today?",

    quickReplies: [
      "Book an appointment",
      "Services & prices",
      "Opening hours",
      "Where are you located?",
    ],
  };

  // ============================================================
  //  STYLES
  // ============================================================
  function injectStyles() {
    const s = document.createElement("style");
    s.textContent = `
      #aiw-launcher {
        position:fixed; bottom:24px; ${CONFIG.position}:24px; z-index:99999;
        width:58px; height:58px; border-radius:50%; background:${CONFIG.brandColor};
        border:none; cursor:pointer; display:flex; align-items:center; justify-content:center;
        box-shadow:0 4px 20px rgba(0,0,0,0.2); transition:transform .2s; outline:none;
      }
      #aiw-launcher:hover { transform:scale(1.08); }
      #aiw-launcher svg { width:27px; height:27px; fill:white; }
      #aiw-window {
        position:fixed; bottom:94px; ${CONFIG.position}:24px; z-index:99998;
        width:350px; max-height:540px; background:#fff; border-radius:18px;
        box-shadow:0 8px 48px rgba(0,0,0,0.16); display:flex; flex-direction:column;
        overflow:hidden; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
        transition:opacity .2s,transform .2s; opacity:0; transform:translateY(14px) scale(.97); pointer-events:none;
      }
      #aiw-window.open { opacity:1; transform:translateY(0) scale(1); pointer-events:all; }
      #aiw-header {
        background:${CONFIG.brandColor}; padding:14px 16px;
        display:flex; align-items:center; gap:10px; flex-shrink:0;
      }
      #aiw-avatar {
        width:38px; height:38px; border-radius:50%; background:rgba(255,255,255,.2);
        display:flex; align-items:center; justify-content:center;
        font-weight:600; font-size:14px; color:white; flex-shrink:0;
      }
      #aiw-header-name { font-weight:600; font-size:14px; color:white; margin:0; }
      #aiw-header-status { font-size:12px; color:rgba(255,255,255,.75); margin:0; display:flex; align-items:center; gap:4px; }
      #aiw-header-status::before { content:''; display:inline-block; width:7px; height:7px; border-radius:50%; background:#4ade80; }
      #aiw-messages { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px; scrollbar-width:thin; }
      .aiw-msg { max-width:84%; animation:aiwFade .2s ease; }
      @keyframes aiwFade { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
      .aiw-msg.bot { align-self:flex-start; }
      .aiw-msg.user { align-self:flex-end; }
      .aiw-bubble { padding:10px 14px; border-radius:16px; font-size:13.5px; line-height:1.55; white-space:pre-wrap; word-break:break-word; }
      .aiw-msg.bot .aiw-bubble { background:#f1f3f5; color:#111; border-bottom-left-radius:4px; }
      .aiw-msg.user .aiw-bubble { background:${CONFIG.brandColor}; color:white; border-bottom-right-radius:4px; }
      .aiw-time { font-size:11px; color:#bbb; margin-top:3px; padding:0 4px; }
      .aiw-msg.user .aiw-time { text-align:right; }
      .aiw-typing { display:flex; gap:4px; align-items:center; padding:12px 14px; background:#f1f3f5; border-radius:16px; border-bottom-left-radius:4px; width:fit-content; }
      .aiw-typing span { width:7px; height:7px; border-radius:50%; background:#aaa; animation:aiwDot 1.2s infinite; }
      .aiw-typing span:nth-child(2) { animation-delay:.2s; }
      .aiw-typing span:nth-child(3) { animation-delay:.4s; }
      @keyframes aiwDot { 0%,80%,100%{transform:scale(.8);opacity:.5} 40%{transform:scale(1.1);opacity:1} }
      #aiw-quick { padding:0 12px 10px; display:flex; flex-wrap:wrap; gap:6px; flex-shrink:0; }
      .aiw-qbtn {
        font-size:12px; padding:6px 12px; border-radius:20px;
        border:1.5px solid ${CONFIG.brandColor}; color:${CONFIG.brandColor};
        background:transparent; cursor:pointer; transition:background .15s,color .15s; font-family:inherit;
      }
      .aiw-qbtn:hover { background:${CONFIG.brandColor}; color:white; }
      #aiw-input-row { padding:10px 12px; border-top:1px solid #f0f0f0; display:flex; gap:8px; flex-shrink:0; }
      #aiw-input {
        flex:1; border:1.5px solid #e5e7eb; border-radius:22px; padding:9px 14px;
        font-size:13.5px; font-family:inherit; outline:none; resize:none; line-height:1.4;
        transition:border-color .15s; max-height:80px;
      }
      #aiw-input:focus { border-color:${CONFIG.brandColor}; }
      #aiw-input:disabled { background:#f9f9f9; }
      #aiw-send {
        width:38px; height:38px; border-radius:50%; background:${CONFIG.brandColor};
        border:none; cursor:pointer; display:flex; align-items:center; justify-content:center;
        flex-shrink:0; transition:transform .15s,opacity .15s; margin-top:1px;
      }
      #aiw-send:hover { transform:scale(1.08); }
      #aiw-send:disabled { opacity:.4; cursor:not-allowed; transform:none; }
      #aiw-send svg { width:17px; height:17px; fill:white; }
      #aiw-footer { font-size:10px; color:#ccc; text-align:center; padding:6px; flex-shrink:0; }
      @media(max-width:400px){
        #aiw-window{width:calc(100vw - 24px); ${CONFIG.position}:12px;}
        #aiw-launcher{${CONFIG.position}:16px; bottom:16px;}
      }
    `;
    document.head.appendChild(s);
  }

  // ============================================================
  //  WIDGET
  // ============================================================
  function buildWidget() {
    const launcher = document.createElement("button");
    launcher.id = "aiw-launcher";
    launcher.setAttribute("aria-label", "Open chat");
    launcher.innerHTML = chatIcon();

    const win = document.createElement("div");
    win.id = "aiw-window";
    const initials = CONFIG.businessName.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
    win.innerHTML = `
      <div id="aiw-header">
        <div id="aiw-avatar">${initials}</div>
        <div>
          <p id="aiw-header-name">${CONFIG.businessName}</p>
          <p id="aiw-header-status">AI Assistant · Online</p>
        </div>
      </div>
      <div id="aiw-messages"></div>
      <div id="aiw-quick"></div>
      <div id="aiw-input-row">
        <textarea id="aiw-input" rows="1" placeholder="Ask me anything..." maxlength="500"></textarea>
        <button id="aiw-send" aria-label="Send">${sendIcon()}</button>
      </div>
      <div id="aiw-footer">Powered by AI · Available 24/7</div>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(win);

    const messagesEl = document.getElementById("aiw-messages");
    const quickEl = document.getElementById("aiw-quick");
    const inputEl = document.getElementById("aiw-input");
    const sendBtn = document.getElementById("aiw-send");

    let isOpen = false;
    let isLoading = false;
    let conversationHistory = [];

    function timeStr() {
      return new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
    }

    function addMessage(text, type) {
      const div = document.createElement("div");
      div.className = `aiw-msg ${type}`;
      div.innerHTML = `<div class="aiw-bubble">${escapeHtml(text)}</div><div class="aiw-time">${timeStr()}</div>`;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return div;
    }

    function showTyping() {
      const div = document.createElement("div");
      div.className = "aiw-msg bot";
      div.id = "aiw-typing";
      div.innerHTML = `<div class="aiw-typing"><span></span><span></span><span></span></div>`;
      messagesEl.appendChild(div);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function removeTyping() {
      const t = document.getElementById("aiw-typing");
      if (t) t.remove();
    }

    function showQuickReplies() {
      quickEl.innerHTML = "";
      CONFIG.quickReplies.forEach(label => {
        const btn = document.createElement("button");
        btn.className = "aiw-qbtn";
        btn.textContent = label;
        btn.onclick = () => { quickEl.innerHTML = ""; handleSend(label); };
        quickEl.appendChild(btn);
      });
    }

    function setLoading(state) {
      isLoading = state;
      inputEl.disabled = state;
      sendBtn.disabled = state;
    }

    async function callClaude(userMessage) {
      conversationHistory.push({ role: "user", content: userMessage });

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": CONFIG.apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 300,
          system: CONFIG.systemPrompt,
          messages: conversationHistory,
        }),
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      const reply = data.content[0].text;
      conversationHistory.push({ role: "assistant", content: reply });

      // Keep history manageable (last 10 messages)
      if (conversationHistory.length > 10) {
        conversationHistory = conversationHistory.slice(-10);
      }

      return reply;
    }

    async function handleSend(text) {
      const msg = (text || inputEl.value).trim();
      if (!msg || isLoading) return;

      inputEl.value = "";
      inputEl.style.height = "auto";
      quickEl.innerHTML = "";

      addMessage(msg, "user");
      setLoading(true);
      showTyping();

      try {
        const reply = await callClaude(msg);
        removeTyping();
        addMessage(reply, "bot");
      } catch (err) {
        removeTyping();
        addMessage("Sorry, I'm having a technical issue. Please contact us directly at " + CONFIG.businessName + ".", "bot");
      } finally {
        setLoading(false);
      }
    }

    launcher.onclick = () => {
      isOpen = !isOpen;
      win.classList.toggle("open", isOpen);
      launcher.innerHTML = isOpen ? closeIcon() : chatIcon();
      if (isOpen && messagesEl.children.length === 0) {
        addMessage(CONFIG.welcomeMessage, "bot");
        setTimeout(showQuickReplies, 400);
      }
      if (isOpen) setTimeout(() => inputEl.focus(), 300);
    };

    sendBtn.onclick = () => handleSend();
    inputEl.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });
    inputEl.addEventListener("input", () => {
      inputEl.style.height = "auto";
      inputEl.style.height = Math.min(inputEl.scrollHeight, 80) + "px";
    });
  }

  function escapeHtml(text) {
    return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>");
  }
  function chatIcon() { return `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`; }
  function closeIcon() { return `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`; }
  function sendIcon() { return `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`; }

  injectStyles();
  buildWidget();

})();
