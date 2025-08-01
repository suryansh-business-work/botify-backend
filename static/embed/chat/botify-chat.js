(function () {
  // --- Create iframe ---
  const iframe = document.createElement('iframe');
  iframe.id = 'botify-chat-iframe';
  iframe.style.position = 'fixed';
  iframe.style.bottom = '24px';
  iframe.style.right = '24px';
  iframe.style.width = '360px';
  iframe.style.height = '480px';
  iframe.style.border = 'none';
  iframe.style.zIndex = '99999';
  iframe.style.background = 'transparent';
  iframe.style.borderRadius = '16px';
  iframe.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
  iframe.style.transition = 'box-shadow 0.2s';
  iframe.style.display = 'none';

  document.body.appendChild(iframe);

  // --- Toggle Button ---
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'botify-chat-toggle';
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.bottom = '24px';
  toggleBtn.style.right = '24px';
  toggleBtn.style.width = '160px';
  toggleBtn.style.height = '160px';
  // toggleBtn.style.background = '#fff';
  toggleBtn.style.borderRadius = '50%';
  // toggleBtn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)';
  toggleBtn.style.display = 'flex';
  toggleBtn.style.alignItems = 'center';
  toggleBtn.style.justifyContent = 'center';
  toggleBtn.style.color = '#fff';
  toggleBtn.style.fontSize = '32px';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.zIndex = '99998';
  toggleBtn.style.border = 'none';
  toggleBtn.style.outline = 'none';
  toggleBtn.innerHTML = `
    <div class="botify-toggle-svg">
      <img src="https://ik.imagekit.io/esdata1/botify/bot-image.svg" alt="Botify Bot" style="width:100%;height:100%;object-fit:contain;">
    </div>
  `;
  document.body.appendChild(toggleBtn);

  toggleBtn.onclick = () => {
    iframe.style.display = 'block';
    toggleBtn.style.display = 'none';
    iframe.contentWindow.focus();
  };

  let injected = false;
  function injectChat() {
    if (injected) return; // Prevent double injection
    injected = true;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
      <head>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Inter', Arial, sans-serif;
            background: #f4f4f9;
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          #botify-chat-widget {
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 0 0 12px 0;
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 8px 32px rgba(44, 108, 223, 0.12);
            border: 1px solid #e3e9ff;
          }
          #botify-chat-header {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 16px 18px 12px 18px;
            border-bottom: 1px solid #e3e9ff;
            background: #e3e9ff;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            min-height: 56px;
          }
          #botify-chat-header-title {
            flex: 1;
            font-weight: 700;
            color: #2d6cdf;
            font-size: 20px;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          #botify-chat-header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          #botify-chat-question {
            background: none;
            border: none;
            color: #2d6cdf;
            font-size: 22px;
            cursor: pointer;
            transition: color 0.2s;
            padding: 0;
            margin: 0;
          }
          #botify-chat-question svg {
            width: 22px;
            height: 22px;
          }
          #botify-chat-close {
            background: none;
            border: none;
            color: #2d6cdf;
            font-size: 28px;
            cursor: pointer;
            transition: color 0.2s;
            font-weight: 700;
            margin-left: 0;
          }
          #botify-chat-close:hover,
          #botify-chat-question:hover {
            color: #1f5bb5;
          }
          #botify-chat-body {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 14px;
            padding: 18px;
            background: #f7f9fc;
            border-radius: 12px;
            border: 1px solid #e3e9ff;
          }
          #botify-chat-input-area {
            display: flex;
            border-top: 1px solid #e3e9ff;
            padding: 10px 18px 0 18px;
            background: #fff;
            border-radius: 12px;
          }
          #botify-chat-input {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid #e3e9ff;
            border-radius: 16px;
            font-size: 16px;
            outline: none;
            background: #f7f9fc;
          }
          #botify-chat-input:focus {
            border-color: #2d6cdf;
            background: #fff;
          }
          #botify-chat-send {
            background: #2d6cdf;
            color: #fff;
            border: none;
            border-radius: 16px;
            padding: 12px 22px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-left: 10px;
            box-shadow: 0 2px 8px rgba(44, 108, 223, 0.08);
            transition: background 0.2s;
          }
          #botify-chat-send:hover {
            background: #1f5bb5;
          }
          .botify-msg {
            display: flex;
            margin-bottom: 14px;
            align-items: flex-end;
          }
          .botify-msg-user {
            justify-content: flex-end;
          }
          .botify-bubble {
            max-width: 80%;
            padding: 12px 18px;
            border-radius: 18px;
            position: relative;
            line-height: 1.5;
            font-size: 15px;
            box-shadow: 0 2px 8px rgba(44, 108, 223, 0.06);
            opacity: 0;
            transform: translateY(20px);
            animation: botifyFadeIn 0.5s cubic-bezier(.4,0,.2,1) forwards;
          }
          @keyframes botifyFadeIn {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .botify-bubble-user {
            background: #2d6cdf;
            color: #fff;
            border-bottom-right-radius: 6px;
            border-top-right-radius: 18px;
            border-top-left-radius: 18px;
            border-bottom-left-radius: 18px;
          }
          .botify-bubble-bot {
            background: #fff;
            color: #2d6cdf;
            border-bottom-left-radius: 6px;
            border-top-right-radius: 18px;
            border-top-left-radius: 18px;
            border-bottom-right-radius: 18px;
            border: 1px solid #e3e9ff;
            margin-left: 8px;
            position: relative;
          }
          .botify-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #e3e9ff;
            margin-right: 8px;
            box-shadow: 0 2px 8px rgba(44, 108, 223, 0.08);
            object-fit: cover;
            border: 1px solid #e3e9ff;
          }
          /* Info dialog styles unchanged */
          #botify-chat-info-dialog {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            padding: 28px 24px;
            border-radius: 18px;
            box-shadow: 0 8px 32px rgba(44, 108, 223, 0.12);
            z-index: 999999;
            max-width: 400px;
            width: 90%;
            border: 1px solid #e3e9ff;
          }
          #botify-chat-info-dialog h3 {
            margin-bottom: 18px;
            font-size: 20px;
            color: #2d6cdf;
            font-weight: 600;
          }
          #botify-chat-info-dialog ul {
            list-style: disc;
            padding-left: 22px;
            margin-bottom: 18px;
          }
          #botify-chat-info-dialog button {
            background: #2d6cdf;
            color: #fff;
            border: none;
            border-radius: 16px;
            padding: 12px 22px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }
          #botify-chat-info-dialog button:hover {
            background: #1f5bb5;
          }
          .botify-toggle-svg {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: botifyBotJump 1.2s cubic-bezier(.4,0,.2,1) infinite;
          }
          @keyframes botifyBotJump {
            0%   { transform: translateY(0); }
            10%  { transform: translateY(-8px); }
            20%  { transform: translateY(-16px); }
            30%  { transform: translateY(-8px); }
            40%  { transform: translateY(0); }
            100% { transform: translateY(0); }
          }
          .botify-loader-spinner {
            width: 38px;
            height: 38px;
            border: 4px solid #e3e9ff;
            border-top: 4px solid #2d6cdf;
            border-radius: 50%;
            animation: botifySpin 0.8s linear infinite;
            background: none;
          }
          @keyframes botifySpin {
            100% { transform: rotate(360deg); }
          }
          .botify-loader-typing {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 6px;
            height: 32px;
          }
          .botify-loader-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #2d6cdf;
            opacity: 0.6;
            animation: botifyTyping 1.2s infinite;
          }
          .botify-loader-dot:nth-child(2) { animation-delay: 0.2s; }
          .botify-loader-dot:nth-child(3) { animation-delay: 0.4s; }
          @keyframes botifyTyping {
            0% { opacity: 0.3; transform: translateY(0);}
            20% { opacity: 1; transform: translateY(-6px);}
            40% { opacity: 0.6; transform: translateY(0);}
            100% { opacity: 0.3; transform: translateY(0);}
          }
        </style>
      </head>
      <body>
        <audio id="botify-chat-incoming" src="https://ik.imagekit.io/esdata1/botify/sounds/chat-incoming.mp3?updatedAt=1753703776973" preload="auto"></audio>
        <div id="botify-chat-widget">
          <div id="botify-chat-header">
            <div id="botify-chat-header-title">
              <img src="https://ik.imagekit.io/esdata1/sibera/avatar/default-profile.png?updatedAt=1717599456712" alt="Botify" style="width:28px;height:28px;border-radius:50%;margin-right:8px;">
              Botify Chat
            </div>
            <div id="botify-chat-header-actions">
              <button id="botify-chat-question" title="Info" aria-label="Info">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="#2d6cdf" stroke-width="2" fill="none"/>
                  <text x="10" y="15" text-anchor="middle" font-size="13" fill="#2d6cdf" font-family="Arial, sans-serif">?</text>
                </svg>
              </button>
              <button id="botify-chat-close" title="Close">&times;</button>
            </div>
          </div>
          <div id="botify-chat-body"></div>
          <form id="botify-chat-input-area" autocomplete="off">
            <input id="botify-chat-input" type="text" placeholder="Type your message..." autocomplete="off" />
            <button id="botify-chat-send" type="submit">Send</button>
          </form>
        </div>
        <div id="botify-chat-info-dialog">
          <h3>About Botify Chat</h3>
          <div>
            This is a demo chat widget. You can ask questions and get instant replies.<br>
            <br>
            <b>Features:</b>
            <ul>
              <li>Easy integration</li>
              <li>Modern UI</li>
              <li>Customizable</li>
            </ul>
          </div>
          <button id="botify-chat-info-close">Close</button>
        </div>
        <script>
          (function(){
            const chatBody = document.getElementById('botify-chat-body');
            const chatInput = document.getElementById('botify-chat-input');
            const chatForm = document.getElementById('botify-chat-input-area');
            const closeBtn = document.getElementById('botify-chat-close');
            const chatIncoming = document.getElementById('botify-chat-incoming');
            const infoBtn = document.getElementById('botify-chat-question');
            const infoDialog = document.getElementById('botify-chat-info-dialog');
            const infoClose = document.getElementById('botify-chat-info-close');

            let chatBotId = 'ea7d9c6d-a969-407b-80fd-5f3e9bc79b7f'; // You can set this dynamically if needed

            closeBtn.onclick = function() {
              parent.document.getElementById('botify-chat-iframe').style.display = 'none';
              parent.document.getElementById('botify-chat-toggle').style.display = 'flex';
            };

            infoBtn.onclick = function(e) {
              e.preventDefault();
              infoDialog.style.display = 'block';
            };
            infoClose.onclick = function() {
              infoDialog.style.display = 'none';
            };

            function playIncomingSound() {
              if (chatIncoming) {
                chatIncoming.currentTime = 0;
                chatIncoming.play();
              }
            }

            function addMessage(text, from = 'bot', playSound = true) {
              const msg = document.createElement('div');
              msg.className = 'botify-msg ' + (from === 'user' ? 'botify-msg-user' : 'botify-msg-bot');
              if (from === 'bot') {
                // Add avatar for bot
                const avatar = document.createElement('img');
                avatar.src = "https://ik.imagekit.io/esdata1/sibera/avatar/default-profile.png?updatedAt=1717599456712";
                avatar.alt = "Bot";
                avatar.className = "botify-avatar";
                msg.appendChild(avatar);
                removeLoader(); // <-- Remove loader when bot replies
              }
              const bubble = document.createElement('div');
              bubble.className = 'botify-bubble ' + (from === 'user' ? 'botify-bubble-user' : 'botify-bubble-bot');
              bubble.textContent = text;
              msg.appendChild(bubble);
              chatBody.appendChild(msg);
              chatBody.scrollTop = chatBody.scrollHeight;
              if (from === 'bot' && playSound) playIncomingSound();
            }

            function addLoader() {
              const oldLoader = document.getElementById('botify-chat-loader');
              if (oldLoader) oldLoader.remove();

              const loader = document.createElement('div');
              loader.id = 'botify-chat-loader';
              loader.innerHTML = '<div class="botify-loader-typing"> <div class="botify-loader-dot"></div> <div class="botify-loader-dot"></div> <div class="botify-loader-dot"></div> </div>';
              loader.style.position = 'absolute';
              loader.style.left = '0';
              loader.style.right = '0';
              loader.style.bottom = '18px';
              loader.style.height = '32px';
              loader.style.display = 'flex';
              loader.style.alignItems = 'center';
              loader.style.justifyContent = 'flex-start';
              loader.style.background = 'rgba(255,255,255,0.0)';
              loader.style.zIndex = '999999';
              loader.style.borderRadius = '12px';
              loader.style.pointerEvents = 'none';
              document.getElementById('botify-chat-body').appendChild(loader);
            }

            function removeLoader() {
              const loader = document.getElementById('botify-chat-loader');
              if (loader) loader.remove();
            }

            // SSE Integration
            let eventSource;
            function connectSSE() {
              if (eventSource) eventSource.close();
              eventSource = new window.EventSource('http://localhost:4001/chat-sse/events/' + chatBotId);

              eventSource.addEventListener('history', function(event) {
                try {
                  const history = JSON.parse(event.data);
                  chatBody.innerHTML = '';
                  history.forEach(msg => {
                    addMessage(msg.content, msg.role, false);
                  });
                } catch {}
              });

              eventSource.onmessage = function(event) {
                try {
                  const msg = JSON.parse(event.data);
                  addMessage(msg.content, msg.role, true);
                } catch {
                  addMessage(event.data, 'bot', true);
                }
              };

              eventSource.onerror = function() {
                // Optionally show disconnected status
              };
            }

            connectSSE();

            chatForm.onsubmit = async function(e) {
              e.preventDefault();
              const text = chatInput.value.trim();
              if (!text) return;
              addMessage(text, 'user', false);
              chatInput.value = '';
              addLoader(); // Show loader
              // Send user message to backend
              fetch('http://localhost:4001/chat-sse/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chatBotId: "ea7d9c6d-a969-407b-80fd-5f3e9bc79b7f",
                  userInput: text,
                  userContext: {
                    timezone: "Asia/Kolkata",
                    profileImage: "https://ik.imagekit.io/esdata1/sibera/avatar/avatar-1.jpg?updatedAt=1709531408817",
                    firstName: "Suryansh",
                    lastName: "Srivastava",
                    email: "suryansh@exyconn.com",
                    isUserVerified: true,
                    role: "general",
                    userId: "a401375f-f292-4535-a49c-12077bcf1656",
                    createdAt: "2025-07-25T16:34:23.300Z",
                    updatedAt: "2025-07-25T16:34:23.300Z"
                  }
                })
              });
            };

            function greet() {
              chatBody.innerHTML = '';
              addMessage("Hi! 👋 I'm Botify. How can I help you today?");
            }
            // greet(); // history event will handle initial messages
          })();
        </script>
      </body>
      </html>
    `);
    doc.close();
  }

  // Inject chat UI when iframe loads
  iframe.onload = injectChat;
  setTimeout(() => {
    if (iframe.contentDocument && iframe.contentDocument.body.childNodes.length === 0) {
      injectChat();
    }
  }, 100);

  window.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement === document.body) {
      toggleBtn.click();
      e.preventDefault();
    }
  });
})();
