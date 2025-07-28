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
  toggleBtn.style.width = '60px';
  toggleBtn.style.height = '60px';
  toggleBtn.style.background = '#2d6cdf';
  toggleBtn.style.borderRadius = '50%';
  toggleBtn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)';
  toggleBtn.style.display = 'flex';
  toggleBtn.style.alignItems = 'center';
  toggleBtn.style.justifyContent = 'center';
  toggleBtn.style.color = '#fff';
  toggleBtn.style.fontSize = '32px';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.zIndex = '99998';
  toggleBtn.style.border = 'none';
  toggleBtn.style.outline = 'none';
  toggleBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#2d6cdf"/><path d="M7 17v-2a4 4 0 0 1 8 0v2" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="9" r="2" fill="#fff"/></svg>';
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
          body {
            margin: 0;
            font-family: 'Segoe UI', Arial, sans-serif;
            background: transparent;
          }
          #botify-chat-widget {
            width: 100%;
            height: 100%;
            background: #fff;
            border-radius: 16px 16px 0 0;
            box-shadow: 0 4px 24px rgba(0,0,0,0.18);
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          #botify-chat-header {
            background: #2d6cdf;
            color: #fff;
            padding: 14px 16px;
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            position: relative;
          }
          #botify-chat-header-left {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          #botify-chat-question {
            background: none;
            border: none;
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin-right: 8px;
            margin-left: 0;
            padding: 0 4px;
            display: flex;
            align-items: center;
          }
          #botify-chat-close {
            background: none;
            border: none;
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            margin-left: 8px;
          }
          #botify-chat-body {
            flex: 1;
            padding: 16px;
            background: #f7f9fb;
            overflow-y: auto;
            max-height: 350px;
            min-height: 180px;
          }
          .botify-msg {
            margin-bottom: 12px;
            display: flex;
            flex-direction: column;
          }
          .botify-msg-user {
            align-items: flex-end;
          }
          .botify-msg-bot {
            align-items: flex-start;
          }
          .botify-bubble {
            display: inline-block;
            padding: 10px 14px;
            border-radius: 16px;
            max-width: 80%;
            font-size: 15px;
            line-height: 1.5;
            margin-bottom: 2px;
          }
          .botify-bubble-user {
            background: #2d6cdf;
            color: #fff;
            border-bottom-right-radius: 4px;
          }
          .botify-bubble-bot {
            background: #e6eaf1;
            color: #222;
            border-bottom-left-radius: 4px;
          }
          #botify-chat-input-area {
            display: flex;
            border-top: 1px solid #e6eaf1;
            background: #fff;
            padding: 8px;
          }
          #botify-chat-input {
            flex: 1;
            border: none;
            outline: none;
            padding: 10px 12px;
            border-radius: 8px;
            font-size: 15px;
            background: #f2f4f8;
            margin-right: 8px;
          }
          #botify-chat-send {
            background: #2d6cdf;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 0 18px;
            font-size: 15px;
            cursor: pointer;
            transition: background 0.2s;
          }
          #botify-chat-send:active {
            background: #1a4fa0;
          }
          #botify-chat-info-dialog {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            color: #222;
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.18);
            padding: 28px 24px 20px 24px;
            z-index: 100000;
            min-width: 260px;
            max-width: 90vw;
            font-size: 16px;
          }
          #botify-chat-info-dialog button {
            margin-top: 18px;
            background: #2d6cdf;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 8px 22px;
            font-size: 15px;
            cursor: pointer;
            float: right;
          }
          #botify-chat-info-dialog h3 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 18px;
            color: #2d6cdf;
          }
        </style>
      </head>
      <body>
        <audio id="botify-chat-incoming" src="https://ik.imagekit.io/esdata1/botify/sounds/chat-incoming.mp3?updatedAt=1753703776973" preload="auto"></audio>
        <div id="botify-chat-widget">
          <div id="botify-chat-header">
            <div id="botify-chat-header-left">
              <button id="botify-chat-question" title="Info" aria-label="Info">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="white" stroke-width="2" fill="none"/>
                  <text x="10" y="15" text-anchor="middle" font-size="13" fill="white" font-family="Arial, sans-serif">?</text>
                </svg>
              </button>
              Botify Chat
            </div>
            <button id="botify-chat-close" title="Close">&times;</button>
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
            const chatWidget = document.getElementById('botify-chat-widget');
            const chatBody = document.getElementById('botify-chat-body');
            const chatInput = document.getElementById('botify-chat-input');
            const chatForm = document.getElementById('botify-chat-input-area');
            const closeBtn = document.getElementById('botify-chat-close');
            const chatIncoming = document.getElementById('botify-chat-incoming');
            const infoBtn = document.getElementById('botify-chat-question');
            const infoDialog = document.getElementById('botify-chat-info-dialog');
            const infoClose = document.getElementById('botify-chat-info-close');

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
              const bubble = document.createElement('div');
              bubble.className = 'botify-bubble ' + (from === 'user' ? 'botify-bubble-user' : 'botify-bubble-bot');
              bubble.textContent = text;
              msg.appendChild(bubble);
              chatBody.appendChild(msg);
              chatBody.scrollTop = chatBody.scrollHeight;
              if (from === 'bot' && playSound) playIncomingSound();
            }

            async function getBotReply(message) {
              // Replace this with your backend API call if needed
              await new Promise(r => setTimeout(r, 700));
              return "You said: " + message;
            }

            chatForm.onsubmit = async function(e) {
              e.preventDefault();
              const text = chatInput.value.trim();
              if (!text) return;
              addMessage(text, 'user');
              chatInput.value = '';
              addMessage('...', 'bot', false); // No sound for loading
              const botMsgDiv = chatBody.querySelectorAll('.botify-msg-bot .botify-bubble');
              const loadingBubble = botMsgDiv[botMsgDiv.length - 1];
              try {
                const reply = await getBotReply(text);
                loadingBubble.textContent = reply;
                playIncomingSound();
              } catch {
                loadingBubble.textContent = "Sorry, I couldn't process your message.";
                playIncomingSound();
              }
              chatBody.scrollTop = chatBody.scrollHeight;
            };

            function greet() {
              chatBody.innerHTML = '';
              addMessage("Hi! 👋 I'm Botify. How can I help you today?");
            }
            greet();
          })();
        </script>
      </body>
      </html>
    `);
    doc.close();
  }

  // Inject chat UI when iframe loads
  iframe.onload = injectChat;
  // For some browsers, onload may not fire if iframe is already loaded, so call directly as well
  setTimeout(() => {
    if (iframe.contentDocument && iframe.contentDocument.body.childNodes.length === 0) {
      injectChat();
    }
  }, 100);

  // Optional: open with Enter if focused on page
  window.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement === document.body) {
      toggleBtn.click();
      e.preventDefault();
    }
  });
})();
