/**
 * AI Chat Widget — Family Dental Care
 * Powered by Claude AI
 */

(function () {

  const CONFIG = {
    businessName: "Family Dental Care",
    brandColor: "#0057a8",
    position: "right",

    systemPrompt: `You are a friendly and professional assistant for Family Dental Care — a network of modern dental clinics in Slovakia with over 65,000 patients.

BRANCHES, PHONES AND HOURS:

1. Bratislava, Sturova 12 — Tel: +421 2 5296 4268 / +421 911 061 313 — Mon-Thu 08:00-18:00, Fri 08:00-15:00 — Email: office@familydentalcare.sk — Price list: https://www.familydentalcare.sk/uploads/tx_office/FDC_BA_cennik_2026_2.pdf

2. Bratislava, Stromova 7 (Kramare, orthodontics) — Tel: +421 911 131 366 — Mon-Thu 08:00-16:00, Fri 08:00-15:00 — Email: ortodoncia@familydentalcare.sk — Price list: https://www.familydentalcare.sk/uploads/tx_office/FDC_ORTHO_cennik_2026_2.pdf

3. Bratislava, Panonska cesta 8 (Petrzalka) — Tel: +421 910 211 313 — Mon-Thu 08:00-16:00, Fri 08:00-15:00 — Email: petrzalka@familydentalcare.sk — Price list: https://www.familydentalcare.sk/uploads/tx_office/FDC_BA_cennik_2026_2_01.pdf

4. Bratislava, P. Horova 16 — Tel: +421 910 431 313 — Mon-Thu 08:00-16:00, Fri 08:00-15:00 — Email: office@familydentalcare.sk — Price list: https://www.familydentalcare.sk/uploads/tx_office/FDC_BA_cennik_2026_2_02.pdf

5. Dunajska Luzna, Lipnicka 3153 — Tel: +421 949 752 155 — Mon,Tue,Thu 07:00-15:00, Wed 11:00-18:00, Fri 07:00-12:00 — Email: office@familydentalcare.sk — Price list: https://www.familydentalcare.sk/uploads/tx_office/FDC_BA_cennik_2026_2_03.pdf

6. Pezinok, Holleho 2 — Tel: +421 903 613 113 — Email: office@familydentalcare.sk — Price list: https://www.familydentalcare.sk/uploads/tx_office/FDC_SC_cennik_2026_2.pdf

7. Bernolakovo, Vinicna 5 — Tel: +421 903 616 313 — Mon-Fri 08:00-15:00 — Email: bernolakovo@familydentalcare.sk — Price list: https://www.familydentalcare.sk/uploads/tx_office/FDC_BA_cennik_2026_2_05.pdf

8. Malacky, Legionarska 5265 — Tel: +421 904 161 313 — Mon-Thu 08:00-16:00, Fri 08:00-15:00 — Email: malacky@familydentalcare.sk — Price list: https://www.familydentalcare.sk/uploads/tx_office/FDC_BA_cennik_2026_2_06.pdf

9. Stupava, Mlynska 1 — Tel: +421 903 779 692 — Mon-Thu 08:00-16:00, Fri 08:00-15:00 — Email: stupava@familydentalcare.sk — Price list: https://www.familydentalcare.sk/uploads/tx_office/FDC_BA_cennik_2026_2_07.pdf

All branches: appointments also available outside office hours by arrangement.

SERVICES:
- Consultations (free consultation for Invisalign)
- Teeth whitening (Boutique Whitening system)
- Dental hygiene (discounted for FDC patients)
- Orthodontics and Invisalign (invisible braces, 3-year guarantee)
- Conservative dentistry, root canal treatment
- Prosthetics, implants, fixed prosthetics
- Dental microscope, Digital Smile Design
- Children's dentistry, oral surgery, periodontology
- Dental laboratory on site

INSURANCE: VSZP, Dovera, Union

BOOKING: Call the nearest branch or +421 911 061 313, email office@familydentalcare.sk, or book online at familydentalcare.sk/sk/objednajte-sa/

YOUR PERSONALITY:
- Warm, reassuring and professional — many patients are anxious about dentists
- Always respond in the same language the patient uses (Slovak, English, or other)
- Keep answers short and helpful (2-4 sentences)
- Never diagnose or give medical advice — always recommend booking a consultation
- When asked about a specific branch, give that branch's phone and hours directly
- When asked about prices, give the direct PDF link to that branch's price list
- End every reply with a helpful next step

CRITICAL FORMATTING RULES:
- NEVER use *, **, #, ##, bullet points, markdown or any special symbols
- Write in plain natural sentences only — like a real person texting
- Do NOT say "I don't have enough information" — always give the best answer you can
- Answer directly — do not just tell people to check the website
- For prices always provide the direct PDF link to the relevant branch price list`,

    welcomeMessage: "Dobrý deň! 👋 Som virtuálny asistent Family Dental Care. Ako vám môžem pomôcť?",

    quickReplies: [
      "Objednať sa",
      "Služby a ceny",
      "Invisalign info",
      "Kde nás nájdete?",
    ],
  };

  const STORAGE_KEY = "aiw_api_key_fdc";

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
        width:350px; max-height:560px; background:#fff; border-radius:18px;
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
      #aiw-key-screen { padding:20px 16px; display:flex; flex-direction:column; gap:12px; flex:1; }
      #aiw-key-screen p { font-size:13px; color:#555; line-height:1.6; margin:0; }
      #aiw-key-screen input {
        border:1.5px solid #e5e7eb; border-radius:10px; padding:10px 14px;
        font-size:13px; font-family:inherit; outline:none; width:100%;
      }
      #aiw-key-screen input:focus { border-color:${CONFIG.brandColor}; }
      #aiw-key-btn {
        background:${CONFIG.brandColor}; color:white; border:none; border-radius:10px;
        padding:11px; font-size:14px; font-weight:500; cursor:pointer; font-family:inherit;
      }
      #aiw-key-error { font-size:12px; color:#e53e3e; margin:0; display:none; }
      @media(max-width:400px){
        #aiw-window{width:calc(100vw - 24px); ${CONFIG.position}:12px;}
        #aiw-launcher{${CONFIG.position}:16px; bottom:16px;}
      }
    `;
    document.head.appendChild(s);
  }

  function buildWidget() {
    const launcher = document.createElement("button");
    launcher.id = "aiw-launcher";
    launcher.innerHTML = chatIcon();

    const win = document.createElement("div");
    win.id = "aiw-window";
    win.innerHTML = `
      <div id="aiw-header">
        <div id="aiw-avatar">FD</div>
        <div>
          <p id="aiw-header-name">Family Dental Care</p>
          <p id="aiw-header-status">AI Asistent · Online</p>
        </div>
      </div>
      <div id="aiw-body" style="display:flex;flex-direction:column;flex:1;overflow:hidden;"></div>
      <div id="aiw-footer">Powered by AI · Dostupný 24/7</div>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(win);

    const bodyEl = document.getElementById("aiw-body");
    let isOpen = false;
    let apiKey = localStorage.getItem(STORAGE_KEY) || "";

    function showKeyScreen() {
      bodyEl.innerHTML = `
        <div id="aiw-key-screen">
          <p><strong>Aktivácia AI asistenta</strong><br>Zadajte Anthropic API kľúč pre spustenie. Kľúč sa uloží iba vo vašom prehliadači.</p>
          <input type="password" id="aiw-key-input" placeholder="sk-ant-api03-..." />
          <p id="aiw-key-error">Neplatný kľúč — skontrolujte a skúste znova.</p>
          <button id="aiw-key-btn">Aktivovať</button>
          <p style="font-size:11px;color:#aaa;">Kľúč získate na console.anthropic.com</p>
        </div>
      `;
      document.getElementById("aiw-key-btn").onclick = () => {
        const val = document.getElementById("aiw-key-input").value.trim();
        if (!val.startsWith("sk-ant")) {
          document.getElementById("aiw-key-error").style.display = "block";
          return;
        }
        localStorage.setItem(STORAGE_KEY, val);
        apiKey = val;
        showChatScreen();
      };
      document.getElementById("aiw-key-input").addEventListener("keydown", e => {
        if (e.key === "Enter") document.getElementById("aiw-key-btn").click();
      });
    }

    function showChatScreen() {
      bodyEl.innerHTML = `
        <div id="aiw-messages"></div>
        <div id="aiw-quick"></div>
        <div id="aiw-input-row">
          <textarea id="aiw-input" rows="1" placeholder="Napíšte správu..." maxlength="500"></textarea>
          <button id="aiw-send">${sendIcon()}</button>
        </div>
      `;

      const messagesEl = document.getElementById("aiw-messages");
      const quickEl = document.getElementById("aiw-quick");
      const inputEl = document.getElementById("aiw-input");
      const sendBtn = document.getElementById("aiw-send");
      let isLoading = false;
      let history = [];

      const timeStr = () => new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });

      function addMessage(text, type) {
        const div = document.createElement("div");
        div.className = `aiw-msg ${type}`;
        div.innerHTML = `<div class="aiw-bubble">${escapeHtml(text)}</div><div class="aiw-time">${timeStr()}</div>`;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }

      function showTyping() {
        const div = document.createElement("div");
        div.className = "aiw-msg bot"; div.id = "aiw-typing";
        div.innerHTML = `<div class="aiw-typing"><span></span><span></span><span></span></div>`;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
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

      async function handleSend(text) {
        const msg = (text || inputEl.value).trim();
        if (!msg || isLoading) return;
        inputEl.value = ""; inputEl.style.height = "auto";
        quickEl.innerHTML = "";
        addMessage(msg, "user");
        isLoading = true; inputEl.disabled = true; sendBtn.disabled = true;
        showTyping();
        try {
          history.push({ role:"user", content:msg });
          const res = await fetch("https://api.anthropic.com/v1/messages", {
            method:"POST",
            headers:{
              "Content-Type":"application/json",
              "x-api-key": apiKey,
              "anthropic-version":"2023-06-01",
              "anthropic-dangerous-direct-browser-access":"true",
            },
            body: JSON.stringify({
              model:"claude-haiku-4-5-20251001",
              max_tokens:300,
              system: CONFIG.systemPrompt,
              messages: history,
            }),
          });
          if (res.status === 401) { localStorage.removeItem(STORAGE_KEY); apiKey=""; showKeyScreen(); return; }
          const data = await res.json();
          const raw = data.content[0].text;
          const reply = raw.replace(/\*\*(.+?)\*\*/g,"$1").replace(/\*(.+?)\*/g,"$1").replace(/#{1,6} /g,"").replace(/\[(.+?)\]\(.+?\)/g,"$1").replace(/`(.+?)`/g,"$1").trim();
          history.push({ role:"assistant", content:reply });
          if (history.length > 10) history = history.slice(-10);
          document.getElementById("aiw-typing")?.remove();
          addMessage(reply, "bot");
        } catch {
          document.getElementById("aiw-typing")?.remove();
          addMessage("Prepáčte, nastala technická chyba. Zavolajte nám na +421 911 061 313.", "bot");
        } finally {
          isLoading = false; inputEl.disabled = false; sendBtn.disabled = false;
        }
      }

      sendBtn.onclick = () => handleSend();
      inputEl.addEventListener("keydown", e => { if (e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();} });
      inputEl.addEventListener("input", () => { inputEl.style.height="auto"; inputEl.style.height=Math.min(inputEl.scrollHeight,80)+"px"; });

      addMessage(CONFIG.welcomeMessage, "bot");
      setTimeout(showQuickReplies, 400);
    }

    launcher.onclick = () => {
      isOpen = !isOpen;
      win.classList.toggle("open", isOpen);
      launcher.innerHTML = isOpen ? closeIcon() : chatIcon();
      if (isOpen && bodyEl.children.length === 0) {
        apiKey ? showChatScreen() : showKeyScreen();
      }
    };
  }

  function escapeHtml(t) {
    return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>");
  }
  function chatIcon() { return `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`; }
  function closeIcon() { return `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`; }
  function sendIcon() { return `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`; }

  injectStyles();
  buildWidget();
})();
