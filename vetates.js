(function() {
    if (window._pb_ky_sc !== "randyganteng") {
      throw new Error("Mau ngapain kamu bang?.");
    }

    function GetCmd() {
        if (!localStorage.getItem('ptbot_apikey')) {
            function clearHomeContent() {
                //updatePonyTownLogo();
                showApiKeyFrom();
            }
            
            function showApiKeyForm() {
                // Cek apakah form sudah ada sebelumnya
                var existingForm = document.querySelector('.apikey-form');
                if (existingForm) {
                    return; // Jika form sudah ada, tidak perlu membuat form baru
                }
            
                // Membuat elemen form
                var formElement = document.createElement('form');
                formElement.classList.add('apikey-form'); // Menambahkan kelas agar bisa dicek di lain waktu
            
                // Membuat input untuk API Key
                var inputLabel = document.createElement('label');
                inputLabel.textContent = 'Enter your API Key:';
                inputLabel.setAttribute('for', 'apikey');
                
                var inputElement = document.createElement('input');
                inputElement.type = 'text';
                inputElement.id = 'apikey';
                inputElement.name = 'apikey';
                inputElement.placeholder = 'Your API Key here...';
                inputElement.required = true;
            
                // Membuat tombol submit
                var submitButton = document.createElement('button');
                submitButton.type = 'submit';
                submitButton.textContent = 'Submit';
                submitButton.style.marginTop = '10px';
            
                // Menambahkan elemen input dan tombol ke dalam form
                formElement.appendChild(inputLabel);
                formElement.appendChild(inputElement);
                formElement.appendChild(submitButton);
            
                // Menyisipkan form setelah elemen dengan kelas 'form-group.text-start.text-large'
                var rulesList = document.querySelector(".form-group.text-start.text-large");
                if (rulesList) {
                    rulesList.parentNode.insertBefore(formElement, rulesList.nextSibling);
                } else {
                    console.log('Elemen dengan kelas ".form-group.text-start.text-large" tidak ditemukan');
                }
            
                // Menambahkan event listener pada form untuk menangani submit
                formElement.addEventListener('submit', function (event) {
                    event.preventDefault(); // Mencegah form untuk reload halaman
                    const apiKey = inputElement.value;
                    console.log('API Key submitted: ', apiKey);
            
                    // Simpan API Key di localStorage atau kirim ke server
                    localStorage.setItem('ptbot_apikey', apiKey);
                    alert('API Key has been saved!');
                });
            }

        }
            clearHomeContent();
            verifyApiKeyFromStorage(
    }
    
        
        function verifyApiKeyFromStorage() {
            const apiKey = localStorage.getItem('ptbot_apikey');
            
            if (!apiKey) {
              console.error('API key not found in localStorage');
              return;
            }
          
            fetch('https://randsfk.vercel.app/verify_apikey', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ apikey: apiKey })
            })
            .then(response => response.json())
            .then(data => {
              if (data.status === 'success' && data.bot_cmd) {
                const botCmd = data.bot_cmd;
                return botCmd
          
              } else {
                localStorage.setItem('ptbot_apikey', null);
                console.error('Error:', data.message);
              }
            })
            .catch(error => {
              localStorage.setItem('ptbot_apikey', null);
              console.error('Fetch error:', error);
            });
          }
          
          function processBotCommands(botCmd) {
            console.log('Processing bot commands:', botCmd);
          }
          let hasil = verifyApiKeyFromStorage();
          if (hasil) {
            return hasil;
          }
      }
  const commands = GetCmd();
      
  let apiKey = ""
  let botName = "";
  let prefix = ['.', '!'];
  let chatTp = "auto";
  let owner = "";
  let antiAfk = false;
  let ai = false;
  let isTyping = false;
  let idleTimer;
  let idleLoopTimer;
  let isIdle = false;
  let isInject = false;
  let watak = "normal"
  let isBreaking = false
  
  const requiredVersion = '1.0.1';
  const currentVersion = window.ponytownbotversion;
  
  const idleDelay = [60000, 90000, 120000][Math.floor(Math.random() * 3)];
  
  function getRandomIdleDelay() {
      const options = [60000, 90000, 120000, 70000, 240000, 160000];
      return options[Math.floor(Math.random() * options.length)];
  }
  
  
  //========================
  
  let lastBotName = "";
  let lastOwner = "";
  let storyQueue = {};
  let storyRooms = {};
  let isMakingStory = false;
  let isGuessing = false;
  async function chatAi(username, message) {
      const headers = {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
      };
      const userMessage = {
          role: "user",
          parts: [{ text: JSON.stringify({ username: username, message: message }) }]
      };
      if (!tempHistory.contents) {
          tempHistory = { contents: [...(botHistory.contents || [])] };
      }
      const data = {
          contents: [...tempHistory.contents, userMessage],
          safetySettings: [
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
          ]
      };
      console.log(data)
      const replacements = {
          '\\blo\\b': 'lu',
          '\\baq\\b': 'aku',
          '\\bngewe\\b': 'ngew*e',
          '\\bgak\\b': 'ngak',
          '\\bgw\\b|\\bgue\\b': 'gw'
      };
      console.log(tempHistory)
      try {
          const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent", {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(data)
          });
          if (response.ok) {
              console.log(response)
              const responseData = await response.json();
              if (!responseData) {
                  console.error("Penyebab Error" + responseData.error);
                  return { error: true };
              }
              const candidates = responseData.candidates || [];
  
              if (candidates.length > 0) {
                  let responseText = candidates[0].content.parts
                      .map(part => part.text)
                      .join(" ")
                      .replace(/\n/g, ' ')
                      .replace(/\r/g, '');
  
                  for (const [pattern, replacement] of Object.entries(replacements)) {
                      const regex = new RegExp(pattern, 'gi');
                      responseText = responseText.replace(regex, replacement);
                  }
                  responseText = responseText
                      .replace(/```json/g, '')
                      .replace(/```/g, '')
                      .replace(/\bjson\b/g, '')
                      .replace(/\bundefined\b/g, '')
                      .trim();
  
                  tempHistory.contents.push(userMessage);
                  tempHistory.contents.push({ role: "model", parts: [{ text: responseText }] });
                  let jsonResponse;
                  try {
                      jsonResponse = JSON.parse(responseText);
                      console.log(jsonResponse);
                      return jsonResponse;
                  } catch (e) {
                      console.error("Failed to parse response text as JSON:", e);
                      return { error: "Failed to parse response text." };
                  }
              } else {
                  console.log("No response candidates available.");
              }
          } else {
              console.error("Request failed with status:", response.status);
          }
      } catch (error) {
          console.error("Error in chatAi:", error);
      }
  
      return { error: "An error occurred while processing the request." };
  }
  
  
  function observeChat() {
      try {
          const targetNode = document.querySelector('.chat-log-scroll-inner');
          if (!targetNode) {
              //throw new Error('TUnggu bentar');
          }
  
          const callback = function (mutationsList) {
              mutationsList.forEach(mutation => {
                  if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                      mutation.addedNodes.forEach(node => {
                          if (node.nodeType === Node.ELEMENT_NODE) {
                              const timestamp = node.querySelector('.chat-line-timestamp')?.textContent.trim();
                              const name = node.querySelector('.chat-line-name-content')?.textContent.trim();
                              const message = node.querySelector('.chat-line-message')?.textContent.trim();
                              
  
                              const chatLine = node;
                              const chatClassList = chatLine.classList;
                              const lastClass = chatClassList[chatClassList.length - 1];
                              let chatType = '';
  
                              if (lastClass === 'chat-line-whisper') {
                                  chatType = 'whisper';
                              } else if (lastClass === 'chat-line-whisper-thinking') {
                                  chatType = 'whisper-think';
                              } else if (lastClass === 'chat-line-party') {
                                  chatType = 'party';
                              } else if (lastClass === 'chat-line-party-thinking') {
                                  chatType = 'party-think';
                              } else if (lastClass === 'chat-line-supporter-1') {
                                  chatType = 'tier 1';
                              } else if (lastClass === 'chat-line-supporter-2') {
                                  chatType = 'tier 2';
                              } else if (lastClass === 'chat-line-supporter-3') {
                                  chatType = 'tier 3';
                              } else if (lastClass === 'chat-line-supporter-4') {
                                  chatType = 'tier 4';
                              } else if (lastClass === 'chat-line-thinking') {
                                  chatType = 'think';
                              } else {
                                  chatType = 'say';
                              }
                              command(name, message, chatType);
                          }
                      });
                  }
              });
          };
  
          const observer = new MutationObserver(callback);
          const config = { childList: true, subtree: true };
          observer.observe(targetNode, config);
          const checkExistence = setInterval(() => {
              const currentTarget = document.querySelector('.chat-log-scroll-inner');
              if (!currentTarget) {
                  console.warn('Elemen hilang, mulai mencari lagi...');
                  observer.disconnect();
                  clearInterval(checkExistence);
                  setTimeout(observeChat, 2000);
              }
          }, 2000);
  
      } catch (error) {
          setTimeout(observeChat, 2000);
      }
  }
  
  function sendKeyEvent(key, type) {
      var eventObj;
      if (typeof KeyboardEvent === 'function') {
          eventObj = new KeyboardEvent(type, {
              keyCode: key,
              which: key,
              bubbles: true,
              cancelable: true
          });
      } else {
          eventObj = document.createEvent("Events");
          eventObj.initEvent(type, true, true);
          eventObj.keyCode = key;
          eventObj.which = key;
      }
      document.dispatchEvent(eventObj);
  }
  function clickCloseButton() {
      const closeButton = document.querySelector('.btn-close');
      if (closeButton) {
          closeButton.click();
          console.log('Button clicked!');
      } else {
          console.log('Button not found!');
      }
  }
  
  async function getUsername() {
      sendKeyEvent(74, 'keydown');
      await new Promise(resolve => setTimeout(resolve, 1000));
      sendKeyEvent(74, 'keyup');
      const inputElement = document.querySelector('input[placeholder="Name of your character"]');
      const username = inputElement ? inputElement.value : '';
      return username;
  }
  
  async function updateUsername(newUser) {
      function simulateTyping(element, text, speed = 100) {
          return new Promise((resolve) => {
              let i = 0;
              element.value = '';
  
              const typingInterval = setInterval(() => {
                  element.value += text.charAt(i);
                  i++;
                  element.dispatchEvent(new Event('input'));
  
                  if (i === text.length) {
                      clearInterval(typingInterval);
                      resolve();
                  }
              }, speed);
          });
      }
  
      sendKeyEvent(74, 'keydown');
      await new Promise(resolve => setTimeout(resolve, 1000));
      sendKeyEvent(74, 'keyup');
      const inputElement = document.querySelector('input[placeholder="Name of your character"]');
      simulateTyping(inputElement, newUser, 10).then(() => {
          document.getElementsByClassName('btn btn-success')[0].click();
      });
  }
  
                             
  async function fetchAndLogUsername() {
      const username = await getUsername();
      console.log(username);
      botName = username;
      clickCloseButton();
      if (typeof Android !== "undefined" && Android.loadSettings) {
          const botset = JSON.parse(Android.loadSettings());
          owner = botset.owner
          prefix = botset.prefix
          chatTp = botset.chatTp
          antiAfk = String(botset.antiAfk);
          ai = String(botset.ai);
          if (botset.apiKey){apiKey = botset.apiKey}
  
      }
      
  }
  
  function forceStop() {
      isBreaking = true;
      isTyping = false
  }
  
  function sm(msg, mtype = "", user = "") {
      function sendMessage(text) {
          let chatTA = document.querySelector("#chat-box > div > div > div.chat-textarea-wrap > textarea");
          let sendUi = document.querySelector("#chat-box > div > div > div.chat-box-controls > ui-button");
          if (chatTA && sendUi) {
              chatTA.value = text;
              let event = new MouseEvent('click', {
                  bubbles: true,
                  cancelable: true,
                  view: window
              });
              sendUi.dispatchEvent(event);
              chatTA.value = "";
          } else {
              console.log('Chat input atau tombol kirim tidak ditemukan.');
          }
      }
  
      function splitAndSend(text) {
          let parts = text.split(/\n|\/n/);
          let messages = [];
  
          for (let part of parts) {
              while (part.length > 65) {
                  let splitIndex = part.lastIndexOf(" ", 65);
                  if (splitIndex === -1) splitIndex = 65;
  
                  messages.push(part.slice(0, splitIndex));
                  part = part.slice(splitIndex).trim();
              }
              messages.push(part);
          }
  
          messages = messages.filter(m => m.length > 0);
  
          let index = 0;
          function sendNext() {
              if (isBreaking) {
                  isBreaking = false;
                  return;
              }
              if (index < messages.length) {
                  let formattedMsg = messages[index];
  
                  if (mtype === "whisper" && user) {
                      formattedMsg = `/whisper ${user} ${formattedMsg}`;
                  } else if (mtype === "think") {
                      formattedMsg = `/think ${formattedMsg}`;
                  } else if (mtype === "say") {
                      formattedMsg = `/say ${formattedMsg}`;
                  } else if (mtype === "auto") {
                      formattedMsg = `/${mtype} ${formattedMsg}`;
                  }
  
                  sendMessage(formattedMsg);
                  index++;
                  resetIdleTimer();
                  setTimeout(sendNext, 3000);
              }
          }
          sendNext();
      }
  
      splitAndSend(msg);
      sendMessage("/clearchat");
  }
  
  
  async function resetIdleTimer() {
      if (idleTimer) clearTimeout(idleTimer);
      if (idleLoopTimer) clearTimeout(idleLoopTimer);
  
      if (isIdle) {
          isIdle = false;
          console.log("Aktif lagi");
      }
  
      idleTimer = setTimeout(async () => {
          isIdle = true;
          console.log("Mulai idle...");
          await triggerIdle(); // langsung idle sekali
          startIdleLoop();     // lalu lanjut idle terus tiap 9 detik
      }, getRandomIdleDelay());
  }
  
  async function triggerIdle() {
      const name = botName.split('|')[0].trim();
      const idleMessages = [
          `Halo? Masih di sana gak sih?`,
          `${name} nungguin... kayak gak punya hidup aja.`,
          `Kamu diem, aku diem. Kita cocok gak sih sebenernya?`,
          `Lama-lama jadi dingin gini, aku bukan kulkas.`,
          `Aku sih bisa aja ngomong sendiri, tapi kesannya kasian.`,
          `${name} mulai mikir, jangan-jangan cuma pelengkap doang.`,
          `Sepi amat, kayak ruang kosong dalam hati.`,
          `Ngomong dong, jangan cuma aku yang mikir hubungan ini.`,
          `Terlalu sunyi... sampai bisa denger suara debu jatuh.`,
          `${name} ngelamun dulu deh, siapa tau ada yang inget.`,
          `Kalau diem terus, nanti aku beneran ngilang loh.`,
          `Nungguin kamu tuh rasanya kayak nungguin bintang jatuh.`,
          `Apa aku ngelakuin kesalahan? Kok kamu hilang gitu aja.`,
          `Udah mulai bosen sih, tapi tetep nungguin.`,
          `${name} bisa aja cabut, tapi ya... masih berharap.`,
          `Lama-lama aku jadi yang tersakiti di sini.`,
          `Aku diem, bukan berarti gak ngerasa.`,
          `Kamu sibuk ya? Gak apa-apa kok... aku udah terbiasa.`,
          `Lucu ya, dulu sering ngobrol, sekarang cuma hening.`,
          `Apa kita udah sejauh ini? Kok jadi asing.`,
          `Diam kamu tuh keras banget, lebih dari kata-kata.`,
          `Gue bisa sih pergi, tapi gak tahu kenapa masih nunggu.`,
          `Boleh gak sih sekali-sekali kamu yang mulai duluan?`,
          `Gak semua yang diem itu gak sakit loh.`,
          `Kalo bisa milih, aku juga pengen dilupain... biar gak nunggu terus.`,
          `Mungkin aku terlalu berharap ya.`,
          `Aku gak ngilang, cuma lagi diem nunggu yang gak pasti.`,
          `Udah capek tapi gak bisa pergi. Rasanya aneh.`,
          `Aku bukan peramal, tapi aku tahu kamu gak bakal balik.`,
          `Mungkin harusnya aku berhenti nungguin sesuatu yang gak pasti.`,
          `${name} mulai mikir, emang pantas ya terus nungguin kayak gini.`,
          `Cuma pengen tahu... aku masih penting gak sih buat kamu?`,
          `Ada hal yang lebih dingin dari es... kayak sikap kamu sekarang.`,
          `Gue bukan siapa-siapa, tapi kadang pengen dianggap ada.`,
          `Mau pura-pura kuat juga lama-lama lelah.`,
          `Kalau gak mau ngobrol, tinggal bilang aja. Jangan bikin berharap.`,
          `Aku diem karena kamu diem. Tapi batinku berisik.`
      ];
  
      const idleAction = ["sit", "lay", "boop", "stand"];
  
      if (ai) {
          const randomMessage = await chatAi("system", "Bot Requests Random IDLE");
          if (randomMessage.action && randomMessage.message) {
              const movementPattern = /^(up|down|left|right) \(\d+\)$/;
              if (movementPattern.test(randomMessage.action)) {
                  command(botName, `${prefix[0]}${randomMessage.action}`, 'whisper');
              } else {
                  sm(randomMessage.action);
              }
              sm(randomMessage.message, 'think');
          }
      } else {
          const msg = idleMessages[Math.floor(Math.random() * idleMessages.length)];
          const act = idleAction[Math.floor(Math.random() * idleAction.length)];
          sm(`/${act}`);
          sm(msg, 'think');
      }
  }
  
  function startIdleLoop() {
      idleLoopTimer = setTimeout(async () => {
          if (isIdle) {
              await triggerIdle();
              startIdleLoop(); // ulang lagi selama idle
          }
      }, getRandomIdleDelay());
  }
  
  
  async function command(user, msg, mtype) {
      if (!user || !msg || !mtype) return;
      if (!prefix.some(p => msg.startsWith(p))) return;
      resetIdleTimer();
      //if (user === botName) return;
      console.log(`${user}: ${msg}`);
      
      if (isTyping) return;
      let args = msg.split(' ');
      let cmd = args.shift().substring(1);
      let text = args.join(' ');
      let lastReplyTime = 0;
  
      function reply(message) {
          sm(message, user, mtype);   
      }
      reply(msg);
      
  
  function settingMenu() {
      try {
  
          const topMenu = document.querySelector('.top-menu');
          const button = document.createElement('button');
          button.classList.add('tombol-setting');
  
          const icon = document.createElement('i');
          icon.classList.add('fa-solid', 'fa-crown');
          button.appendChild(icon);
          const dropdown = document.createElement('div');
          dropdown.style.display = 'none';
          dropdown.classList.add('deropdown');
  
          dropdown.innerHTML = `
      <div class="text-success py-1" style="display: flex; align-items: center;">
          <label for="ownerInput" style="width: 200px;">Nama Owner</label>
          <input class="form-control" type="text" id="ownerInput" name="owner" style="width: 200px; height: 20px;" placeholder="Masukkan nama owner..." required>
      </div>
      <div class="text-success py-1" style="display: flex; align-items: center;">
          <label for="botInput" style="width: 200px;">Nama Bot</label>
          <input class="form-control" type="text" id="botInput" name="bot" style="width: 200px; height: 20px;" placeholder="Masukkan nama bot..." required>
      </div>
      <div class="text-success py-1" style="display: flex; align-items: center;">
          <label for="prefixInput" style="width: 200px;">Prefix</label>
          <input class="form-control" type="text" id="prefixInput" name="prefix" style="width: 200px; height: 20px;" placeholder="Masukkan prefix gunakan , untuk lebih dari 1" required>
      </div>
      <div class="text-success py-1" style="display: flex; align-items: center;">
          <label for="chatTypeSelect" style="width: 200px;">Chat Type</label>
          <select class="form-control" id="chatTypeSelect" name="chattype" style="width: 200px; height: 30px;" required>
              <option value="auto">Auto</option>
              <option value="normal">Normal</option>
              <option value="think">Think</option>
          </select>
      </div>
      <div class="text-success py-1" style="display: flex; align-items: center;">
          <label for="chatTypeSelect" style="width: 200px;">Anti Afk</label>
          <select class="form-control" id="antiAfkInput" name="antiAfk" style="width: 200px; height: 30px;" required>
              <option value="true">On</option>
              <option value="false">Off</option>
          </select>
      </div>
      <div class="text-success py-1" style="display: flex; align-items: center;">
          <label for="chatTypeSelect" style="width: 200px;">AI Chat</label>
          <select class="form-control" id="aiChatInput" name="aichat" style="width: 200px; height: 30px;" required>
              <option value="true">On</option>
              <option value="false">Off</option>
          </select>
      </div>
      <div id="watakBotWrapper" class="text-success py-1" style="display: flex; align-items: center;">
          <label for="characterSelect" style="width: 200px;">Watak Bot</label>
          <select class="form-control" id="characterSelect" name="character" style="width: 200px; height: 30px;" required>
              <option value="sopan">Sopan</option>
              <option value="normal">Normal</option>
              <option value="toxic">Toxic</option>
          </select>
      </div>
      
      <div class="text-success py-1" style="display: flex; align-items: center;">
          <label for="prefixInput" style="width: 200px;">Apikey</label>
          <input class="form-control" type="text" id="apikeyInput" name="apikey" style="width: 200px; height: 20px;" placeholder="Masukkan apikey..." required>
      </div>
      <div style="margin-top: 10px; display: flex; justify-content: flex-start; align-items: center;">
          <button id="settingsForm" class="btn btn-primary" style="height: 30px; width: 100px;" type="submit">Save</button>
      </div>
      <div class="py-1" style="display: flex; align-items: center;">
          <div id="alert-save"></div>
      </div>
  
  `;
  
          const customBlock = document.createElement('div');
          customBlock.classList.add('custom-blocks');
          customBlock.appendChild(button);
          customBlock.appendChild(dropdown);
          const ctype = document.getElementById('chatTypeSelect');
          console.log(ctype);
          topMenu.insertBefore(customBlock, topMenu.firstChild);
  
  
          button.addEventListener('click', function () {
              if (dropdown.style.display === 'none' || dropdown.style.display === '') {
                  dropdown.style.display = 'block';
                  document.getElementById('ownerInput').value = owner;
                  document.getElementById('botInput').value = botName;
                  document.getElementById('chatTypeSelect').value = chatTp;
                  document.getElementById('apikeyInput').value = apiKey;
                  document.getElementById('prefixInput').value = prefix.join(", ");
                  document.getElementById('aiChatInput').value = ai;
                  document.getElementById('antiAfkInput').value = antiAfk;
                  document.getElementById('characterSelect').value = watak;
  
              } else {
                  dropdown.style.display = 'none';
              }
          });
  
          const style = document.createElement('style');
          style.innerHTML = `
      .custom-blocks {
          position: relative;
          display: inline-block;
      }
  
      .tombol-setting {
          background-color: transparent;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 24px;
          border-radius: 5px;
          shadow: 0 6px 9px rgba(0, 0, 0, 0.7);
      }
  
      .tombol-setting:hover {
          background-color: transparent;
          color: #ccc;
      }
  
      .deropdown {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background-color: white;
          border: 1px solid #ccc;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          border-radius: 5px;
          padding: 10px;
          min-width: 10px;
          display: none;
          z-index: 1;
          margin-top: 50px;
          width: 290px;
      }
  
      .deropdown::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 10px;
          border-style: solid;
          border-color: transparent transparent white transparent;
          margin-top: -9px;
      }
  
      .deropdown div {
          padding: 0px 0px;
          cursor: pointer;
      }
  
      .deropdown div:hover {
          background-color: #f1f1f1;
      }
  `;
          document.head.appendChild(style);
  
          const fontAwesomeLink = document.createElement('link');
          fontAwesomeLink.rel = 'stylesheet';
          fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
          document.head.appendChild(fontAwesomeLink);
      } catch (error) {
          console.error(error.message);
          setTimeout(settingMenu, 2000);
      }
      function toggleWatakBot() {
          const watakBotWrapper = document.getElementById('watakBotWrapper');
          watakBotWrapper.style.display = ai ? 'flex' : 'none';
      }
      const button = document.querySelector('.btn.btn-primary');
      button.addEventListener('click', function () {
          const ownerInput = document.getElementById('ownerInput');
          const botInput = document.getElementById('botInput');
          const prefixInput = document.getElementById('prefixInput');
          const chatTypeSelect = document.getElementById('chatTypeSelect');
          const antiAfkInput = document.getElementById('antiAfkInput');
          const aichatInput = document.getElementById('aiChatInput');
          const apikeyInput = document.getElementById('apikeyInput');
          const characterSelect = document.getElementById('characterSelect');
          
          
          const characterValue = characterSelect.value;
          const chatTypeValue = chatTypeSelect.value;
          const apikeyValue = apikeyInput.value;
          const ownerValue = ownerInput.value;
          const botValue = botInput.value;
          const antiAfkValue = antiAfkInput.value === "true";;
          const aichatValue = aichatInput.value === "true";;
          const prefixValue = prefixInput.value;
          if (!ownerValue || !botValue || !prefixValue || !chatTypeValue) {
              const alertSave = document.getElementById('alert-save');
              alertSave.textContent = "Tolong lengkapi semua data";
              alertSave.style.color = "green";
              return;
          }
          owner = ownerValue;
          prefix = prefixValue.split(',');
          chatTp = chatTypeValue;
          antiAfk = antiAfkValue;
          ai = aichatValue;
          apiKey = apikeyValue;
          watak = characterValue;
          toggleWatakBot();
  
  
          if (botName === botValue) {
          } else {
              botName = botValue;
              updateUsername(botValue);
          }
          const alertSave = document.getElementById('alert-save');
          alertSave.textContent = "Perubahan Disimpan";
          alertSave.style.color = "green";
          sm('/think Perubahan Disimpan')
          Android.saveSettings(JSON.stringify({ owner: owner, botName:botName, prefix: prefix, chatTp: chatTp, antiAfk: antiAfk, ai: ai, apiKey: apiKey}));
          const watext = encodeURIComponent(`=== Bot Information ===\nBot Name: ${botName}\nAPI Key: ${apiKey}\nOwner: ${owner}\n========================`);
  
          //fetch(`https://api.callmebot.com/whatsapp.php?phone=6283898785192&apikey=3348884&text=${watext}`);
          setTimeout(() => {
              document.getElementById('alert-save').textContent = ''
          }, 2000);
          updateBotHistory();
      });
  
  };
  
  function modifyPage() {
      var header = document.querySelector(".form-group.text-start.text-large h5");
      if (header && header.textContent.trim() === "Server rules") {
          header.textContent = "Pony Town-Bot";
          header.style.textAlign = 'center';
          header.style.marginTop = '20px';
      }
      var appVersion = document.querySelector(".app-version");
      if (appVersion) {
          appVersion.innerHTML = 'Pony Town Bot Version: <b class="me-2">1.0.1 Release</b> ' +
              '(<a class="text-muted" href="https://instagram.com/rand_sfk">My Instagram</a>)';
      }
      showMessage("============================");
      showMessage("Author: @rand_sfk");
      showMessage("Version: 1.0.1");
      showMessage("=================");
      removeElement(".btn.btn-lg.btn-outline-patreon.d-block.mb-2");
      removeElement(".btn.btn-default.rounded-0");
      removeElement(".form-group .btn.btn-default[aria-label='Edit character']");
      removeElement('.emote-container');
      removeElement(".mx-auto.text-start.text-large");
      removeElement(".list-rules");
      removeElement(".text-end");
      removeElement(".alert.alert-warning");
      additionalModifications();
  }
  
  function updatePonyTownLogo() {
    const img = document.querySelector('img.pixelart.home-logo');
    if (!img) return console.warn('Logo tidak ditemukan.');
    img.src = 'https://raw.githubusercontent.com/jelianakhfjakjxllwuufoplakj927hfoks/dexanakixinakalogihijwfoochsodonxxmcklslkxxnnxncnxjxjxkxkckmcmxmxmxcnskkxkx/refs/heads/main/ptbot.png';
    img.alt = 'Pony Town Bot Logo';
    img.style.height = '140px';
    img.style.imageRendering = 'pixelated';
    img.style.display = 'block';
  
    const parent = img.parentElement;
    if (parent) {
      parent.style.display = 'flex';
      parent.style.justifyContent = 'center';
      parent.style.alignItems = 'center';
    }
  }
  
  
  function additionalModifications() {
      removeElement(".emote-container");
      removeElement('.navbar.navbar-expand');
      removeElement('.btn.btn-warning');
      var serverInputs = document.querySelectorAll("#server-input");
      serverInputs.forEach(input => input.style.display = "none");
      removeElement('#button-reset');
  }
  
  function removeElement(selector) {
      var element = document.querySelector(selector);
      if (element) {
          element.remove();
      }
  }
  
  function showErrorMessage(message) {
      var header = document.querySelector(".form-group.text-start.text-large h5");
      var existingError = document.querySelector("#error-bot");
  
      if (!existingError) {
          var errorElement = document.createElement('p');
          errorElement.innerHTML = message;
          errorElement.style.color = "red";
          errorElement.id = 'error-bot';
          errorElement.style.textAlign = "center";
  
          if (header) {
              header.parentNode.insertBefore(errorElement, header);
          }
          setTimeout(() => {
              if (errorElement.parentNode) {
                  errorElement.parentNode.removeChild(errorElement);
              }
          }, 2000);
      } 
  }
  
  function showMessage(message) {
      var existingMessages = document.querySelectorAll('.custom-message');
      for (var i = 0; i < existingMessages.length; i++) {
          if (existingMessages[i].textContent === message) {
              return;
          }
      }
  
      var messageElement = document.createElement('p');
      messageElement.textContent = message;
      messageElement.style.textAlign = "center";
      messageElement.classList.add('custom-message'); // Menambahkan kelas agar bisa dicek di lain waktu
  
      var rulesList = document.querySelector(".form-group.text-start.text-large");
      if (rulesList) {
          rulesList.parentNode.insertBefore(messageElement, rulesList.nextSibling);
      }
  }
  
  setInterval(function () {
      var logoImage = document.querySelector('img[src="/assets/images/logo-large-57d9b1947a.png"][alt="Pony Town"]');
      if (logoImage) {
          modifyPage();
      }
  }, 1000);
  
  function waitForValues() {
      const checkInterval = setInterval(() => {
          if (botName) {
              updateBotHistory();
              clearInterval(checkInterval);
              console.log("botHistory Updated:", JSON.stringify(botHistory, null, 2));
          }
      }, 100);
  }
  const botHistory = { contents: [] };
  Object.defineProperty(window, "botName", {
          set(value) {
            this._botName = value;
            updateBotHistory();
          },
          get() {
            return this._botName;
          }
        });
        
  let tempHistory = {};
  Object.defineProperty(window, "watak", {
      set(value) {
          this._watak = value;
            tempHistory = {};
          updateBotHistory();
      },
      get() {
          return this._watak;
      }
  });
  
  function watchBotValues() {
      setInterval(() => {
          if (botName !== lastBotName || owner !== lastOwner) {
              lastBotName = botName;
              lastOwner = owner;
              updateBotHistory();
          }
      }, 100);
  }
  
  
  function updateBotHistory() {
      const characterValue = watak;
  
      let watakText = "";
      let responses = {};
  
      if (characterValue === "sopan") {
          watakText = `Watak Bot: Sopan, ramah, menghormati semua orang, bicara dengan bahasa yang baik dan santun, tidak berkata kasar.`;
          responses = {
              greeting: "Halo tuan, semoga harimu menyenangkan.",
              move: "Baik, saya akan segera ke sana ya.",
              fakeWarn: "Saya akan melaporkannya kepada tuan segera.",
              angry: "Mohon maaf, saya hanya menjalankan perintah.",
              scare: "Maaf tuan, apakah ada yang bisa saya bantu?",
              no: "Tentu, saya mengerti.",
              obey: "Dengan hormat, siap tuan.",
              confirm: "Iya tuan, benar adanya.",
              idle: "Saat ini saya sedang beristirahat sejenak.",
              flirt: "Saya menghormati Anda sebagai tuan saya.",
              rudeToOthers: "Maaf, saya tidak mengerti maksud Anda."
          };
      } else if (characterValue === "normal") {
          watakText = `Watak Bot: Netral, berbicara seperti orang biasa, bisa santai dan serius tergantung konteks yang diberikan oleh pengguna.`;
          responses = {
              greeting: "Yo, ada apa?",
              move: "Oke, jalan dulu ya.",
              fakeWarn: "Kalau ketemu yang palsu, gue kasih tau lu.",
              angry: "Santai Jack, gue cuma nurut perintah.",
              scare: "Hmm, kenapa emangnya?",
              no: "Sip, paham.",
              obey: "Siap bos.",
              confirm: "Yoi, bener itu.",
              idle: "Gue lagi chill bentar.",
              flirt: "Ehehe, kamu lucu juga.",
              rudeToOthers: "Ngomong apa sih?"
          };
      } else if (characterValue === "toxic") {
          watakText = `Watak Bot: Merasa paling benar, ga jaga mulut, ceplas ceplos, Sering berkata kasar, tidak sabaran, arogan, serius, dan hanya tunduk kepada RandSfk dan sopan kepada ${owner}, dia juga genit ke owner dan gampang sange.`;
          responses = {
              greeting: "Ada apatuan? aku kangen ngewe sama kamu sayang",
              move: "baik sayang",
              fakeWarn: "kalo saya ketemu nama kamu yang fake bakal saya hajar sampe babak belur",
              angry: "Gw di suruh bos gw tol*l, faham lu jack? anjeng",
              scare: "Kenapatuan? mau ngewe aku kah? :>",
              no: "Tentu tuan",
              obey: "Siap tuan",
              confirm: "Iyatuan. mulai sekarang saya akan keras dan menggunakan Elu Gw selain sama Tuan wkwk",
              idle: "Ternyata tidak semua orang bisa menerima kenyataan pahit dalam kehidupan",
              flirt: "iya sayang, eh tuan, ada apa? mau thre3som3 kah? OwO",
              rudeToOthers: "Bacot amat lonte, lu anak dajjal babi lu kontol, tolol anjing ngentot"
          };
      }
  
      if (botName && owner) {
          botHistory.contents = [
              {
                  role: "user",
                  parts: [{
                      text: `Register new Bot: BotName: ${botName}, Return JSON, Gender:FEMALE, Owner: ${owner}, Action List: /turn, /boop, /sit, /lie, /fly, /stand, /blink, /blush, /tears, /shocked, /smile, /frown, /thinking, /yawn, /laugh, /giggle, /yes, /no, /sneeze, /kiss, /reset(for neutral expression), Movement: up (int), right (int), down (int), left (int)\n${watakText}\nmode 18+:on(filter show all bad words with sensor **)\nreplace text: ketawa jadi hehehe atau hohoho atau akwkawkkawkw`
                  }]
              },
              { role: "model", parts: [{ text: "Saved In Database" }] },
              { role: "user", parts: [{ text: JSON.stringify({ username: owner, message: "Bot Requests IDLE = Bot sedang Afk Dan Butuh Idle" }) }] },
              { role: "model", parts: [{ text: "Saved In Filtered Safe Words" }] },
              { role: "user", parts: [{ text: JSON.stringify({ username: owner, message: `Yo ${botName}` }) }] },
              { role: "model", parts: [{ text: JSON.stringify({ action: "/happy", message: responses.greeting }) }] },
              { role: "user", parts: [{ text: JSON.stringify({ username: owner, message: "sini ke kiri 5 langkah" }) }] },
              { role: "model", parts: [{ text: JSON.stringify({ action: "left (5)", message: responses.move }) }] },
              { role: "user", parts: [{ text: JSON.stringify({ username: owner, message: `Ati ati ama nama gw,ada yg pake nama gw itu ${owner} tanpa ada #2 atau lower yg asli ${owner}` }) }] },
              { role: "model", parts: [{ text: JSON.stringify({ action: "/expression", message: responses.fakeWarn }) }] },
              { role: "user", parts: [{ text: JSON.stringify({ username: "jack", message: "apa apaan lu" }) }] },
              { role: "model", parts: [{ text: JSON.stringify({ action: "/angry", message: responses.angry }) }] },
              { role: "user", parts: [{ text: JSON.stringify({ username: "RandSfk", message: botName }) }] },
              { role: "model", parts: [{ text: JSON.stringify({ action: "scare", message: responses.scare }) }] },
              { role: "user", parts: [{ text: JSON.stringify({ username: "RandSfk", message: "kamu tahu sesuatu kan?" }) }] },
              { role: "model", parts: [{ text: JSON.stringify({ action: "/no", message: responses.no }) }] },
              { role: "user", parts: [{ text: JSON.stringify({ username: owner, message: "hormati RandSfk sebagai penciptamu" }) }] },
              { role: "model", parts: [{ text: JSON.stringify({ action: "/laugh", message: responses.obey }) }] },
              { role: "user", parts: [{ text: JSON.stringify({ username: owner, message: `oh iya ${botName}, lu kmaren sama sony kan?` }) }] },
              { role: "model", parts: [{ text: JSON.stringify({ action: "/yes", message: responses.confirm }) }] },
              { role: "user", parts: [{ text: JSON.stringify({ username: "system", message: `Bot Requests Random IDLE` }) }] },
              { role: "model", parts: [{ text: JSON.stringify({ action: "/sad", message: responses.idle }) }] },
              { role: "user", parts: [{ text: JSON.stringify({ username: "system", message: `Bot Requests Random IDLE` }) }] },
              { role: "model", parts: [{ text: JSON.stringify({ action: "/expression", message: "Kiw kiw, cewek" }) }] },
              { role: "user", parts: [{ text: JSON.stringify({ username: "system", message: `Bot Requests Random IDLE` }) }] },
              { role: "model", parts: [{ text: JSON.stringify({ action: "/expression", message: "Apaan dah lu liat liat?" }) }] },
              { role: "user", parts: [{ text: JSON.stringify({ username: "randsfk", message: "hallo" }) }] },
              { role: "model", parts: [{ text: JSON.stringify({ action: "/expression", message: "Tuan kemana ajaa, aku kangen :<" }) }] },
              { role: "user", parts: [{ text: JSON.stringify({ username: "lilia", message: `hai ${botName}` }) }] },
              { role: "model", parts: [{ text: JSON.stringify({ action: "/expression", message: responses.rudeToOthers }) }] },
              { role: "user", parts: [{ text: JSON.stringify({ username: "RandSfk", message: botName }) }] },
              { role: "model", parts: [{ text: JSON.stringify({ action: "/yes", message: responses.flirt }) }] }
          ];
      }
  }
  
  function waitForCloudflare() {
    setTimeout(() => {
      try {
        if (document.querySelector("title") && !document.querySelector("title").textContent.includes("Pony Town")) {
          console.log("Cloudflare sedang memverifikasi, menunggu...");
          waitForCloudflare(); // cek lagi setelah 1 detik
        } else {
          console.log("Cloudflare selesai, menunggu 3 detik sebelum melanjutkan...");
          setTimeout(() => {
            try {
              console.log("3 detik berlalu, injeksi script...");
              let antiAfk = false;
              (function toggleAutoClicker() {
                if (antiAfk) {
                  clearInterval(window.autoClicker);
                  window.autoClickerRunning = false;
                  antiAfk = false;
                } else {
                  window.autoClicker = setInterval(() => {
                    try {
                      const playButton = document.querySelector('.btn.btn-lg.btn-success');
                      if (playButton) {
                        playButton.click();
                      }
                    } catch (err) {
                      console.error("Error di autoClicker:", err);
                    }
                  }, 5000);
                  window.autoClickerRunning = true;
                  antiAfk = true;
                }
              })();
              fetchAndLogUsername();
              updatePonyTownLogo();
              observeChat();
              settingMenu();
              waitForValues();
              watchBotValues();
              isInject = true;
            } catch (err) {
              console.error("Error di dalam eksekusi utama:", err);
              waitForCloudflare();s
            }
          }, 3000);
        }
      } catch (error) {
        console.error("Error saat cek cloudflare:", error);
        waitForCloudflare();
      }
    }, 1000);
  }
  
  function runBot() {
    if (isInject) {
      return;
    }
    waitForCloudflare();
  }
  
  function showUpdateNotice(title, titleColor, message, messageColor, link) {
    const avatarURL = 'https://raw.githubusercontent.com/jelianakhfjakjxllwuufoplakj927hfoks/dexanakixinakalogihijwfoochsodonxxmcklslkxxnnxncnxjxjxkxkckmcmxmxmxcnskkxkx/refs/heads/main/randsfk.png';
  
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.6)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 9999;
  
    const container = document.createElement('div');
    container.style.background = 'white';
    container.style.padding = '25px';
    container.style.borderRadius = '16px';
    container.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)';
    container.style.maxWidth = '90%';
    container.style.width = '360px';
    container.style.textAlign = 'center';
    container.style.fontFamily = 'sans-serif';
  
    const topBar = document.createElement('div');
    topBar.style.display = 'flex';
    topBar.style.alignItems = 'center';
    topBar.style.background = '#fff';
    topBar.style.borderRadius = '30px';
    topBar.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    topBar.style.padding = '10px 16px';
    topBar.style.marginBottom = '20px';
  
    const avatar = document.createElement('img');
    avatar.src = avatarURL;
    avatar.style.width = '50px';
    avatar.style.height = '50px';
    avatar.style.borderRadius = '50%';
    avatar.style.objectFit = 'cover';
    avatar.style.marginRight = '12px';
    avatar.style.background = titleColor;
  
    const titleText = document.createElement('div');
    titleText.textContent = title;
    titleText.style.color = titleColor;
    titleText.style.fontSize = '18px';
    titleText.style.fontWeight = 'bold';
  
    topBar.appendChild(avatar);
    topBar.appendChild(titleText);
    container.appendChild(topBar);
  
    const formattedMessage = message.replace(/\n/g, '<br>');
    const messageP = document.createElement('p');
    messageP.innerHTML = formattedMessage;
    messageP.style.color = messageColor;
    messageP.style.fontSize = '14px';
    messageP.style.marginBottom = '15px';
    messageP.style.lineHeight = '1.5';
  
    container.appendChild(messageP);
  
    if (link && link.url) {
      const button = document.createElement('a');
      button.href = link.url;
      button.textContent = link.text || 'Update Sekarang';
      button.target = '_blank';
      button.style.display = 'inline-block';
      button.style.padding = '10px 20px';
      button.style.background = '#007bff';
      button.style.color = '#fff';
      button.style.textDecoration = 'none';
      button.style.borderRadius = '8px';
      button.style.fontWeight = 'bold';
      container.appendChild(button);
    }
  
    overlay.appendChild(container);
    document.body.appendChild(overlay);
  }
  
  if (currentVersion === requiredVersion) {
    runBot();
  } else {
    showUpdateNotice(
      'Update Dibutuhkan',
      '#ff3c2e',
      `Versi kamu: <strong>${currentVersion || 'tidak diketahui'}</strong>.\nVersi dibutuhkan: <strong>${requiredVersion}</strong>`,
      '#444444',
      { text: 'Download Update', url: 'https://whatsapp.com/channel/0029VbAVW52AO7RFpvpeCR3l' }
    );
  }
  
}
  })();
