async function GetCmd() {
    if (!localStorage.getItem('ptbot_apikey')) {
        function removeElements(selector) {
            const element = document.querySelector(selector);
            if (element) element.remove();
        }

        function showMessage(message, status = 'success') {
            const header = document.querySelector(".form-group.custom");
            if (!header) return;
            const msg = document.createElement('div');
            msg.className = 'alerts';
            msg.textContent = message;
            msg.style.color = status === 'error' ? 'red' : '#0f0';
            msg.style.fontFamily = 'monospace';
            msg.style.margin = '4px';
            header.appendChild(msg);
            setTimeout(() => {
                msg.remove();
            }, 3000);
        }
        function updatePonyTownLogos() {
            const img = document.querySelector('img.pixelart.home-logo');
            if (!img) return console.warn('Logo tidak ditemukan.');
            img.src = 'https://raw.githubusercontent.com/jelianakhfjakjxllwuufoplakj927hfoks/dexanakixinakalogihijwfoochsodonxxmcklslkxxnnxncnxjxjxkxkckmcmxmxmxcnskkxkx/refs/heads/main/ptbot.png';
            img.alt = 'Pony Town Bot Logo';
            img.style.height = '170px';
            img.style.imageRendering = 'pixelated';
            img.marginLeft = '10px';
            img.style.display = 'block';

            const parent = img.parentElement;
            if (parent) {
                parent.style.display = 'flex';
                parent.style.justifyContent = 'center';
                parent.style.alignItems = 'center';
            }
        }
        function additionalModifications() {
            removeElements(".emote-container");
            removeElements(".navbar.navbar-expand");
            removeElements(".btn.btn-warning");
            removeElements("#button-reset");

            const serverInputs = document.querySelectorAll("#server-input");
            serverInputs.forEach(input => input.style.display = "none");
        }

        function modifyPage() {
            const header = document.querySelector(".form-group.text-start.text-large h5");
            if (header && header.textContent.trim() === "Server rules") {
                header.textContent = "Pony Town-Bot";
                header.style.textAlign = 'center';
                header.style.marginTop = '20px';
            }

            const appVersion = document.querySelector(".app-version");
            if (appVersion) {
                appVersion.innerHTML = 'Pony Town Bot Version: <b class="me-2">1.0.2 Release</b> ' +
                    '(<a class="text-muted" href="https://instagram.com/rand_sfk">My Instagram</a>)';
            }

            removeElements(".btn.btn-lg.btn-outline-patreon.d-block.mb-2");
            removeElements(".btn.btn-default.rounded-0");
            removeElements(".form-group .btn.btn-default[aria-label='Edit character']");
            removeElements(".emote-container");
            removeElements(".mx-auto.text-start.text-large");
            removeElements(".list-rules");
            removeElements(".text-end");
            removeElements(".alert.alert-warning");
            additionalModifications();
            updatePonyTownLogos();
        }

        function injectApikeyForm() {
            const formGroups = document.querySelectorAll('.form-group');
            if (formGroups.length > 0) {
                const container = formGroups[0].parentElement;
                container.querySelectorAll('.form-group').forEach(el => el.remove());

                const formGroup = document.createElement("div");
                formGroup.className = "form-group custom";
                formGroup.style.marginTop = "70px";

                const input = document.createElement("input");
                input.type = "text";
                input.className = "form-control";
                input.placeholder = "Masukan APIKEY pony town bot anda";
                input.setAttribute("aria-label", "Masukan APIKEY pony town bot anda");
                input.maxLength = 100;
                input.id = "ptbot-apikey";

                const submitBtn = document.createElement("button");
                submitBtn.className = "btn";
                submitBtn.textContent = "Submit";
                submitBtn.setAttribute("aria-label", "Simpan APIKEY ke localStorage");
                submitBtn.style.display = "block";
                submitBtn.style.margin = "10px auto 0";
                submitBtn.style.backgroundColor = "#333";
                submitBtn.style.color = "#fff";
                submitBtn.style.border = "1px solid #fff";
                submitBtn.style.padding = "10px 20px";
                submitBtn.style.borderRadius = "5px";

                submitBtn.onclick = () => {
                    const value = input.value.trim();
                    if (value) {
                        showMessage("Berhasil menyimpan APIKEY", "error");
                        localStorage.setItem('ptbot_apikey', value);
                        window.location.reload()
                    } else {
                        showMessage("Mohon masukkan API Key terlebih dahulu.", "error");
                    }
                };
                const msg = document.createElement('div');
                msg.className = 'custom-message';
                msg.style.color = '#fff';
                msg.style.fontFamily = 'monospace';
                msg.style.margin = '4px';
                msg.textContent = "Belum punya APIKEY? buat disini: ";
                const link = document.createElement('a');
                link.href = "https://randsfk.vercel.app/login";
                link.textContent = "Dashboard";
                link.style.color = '#cc6600';
                link.style.marginLeft = '4px';
                link.style.textDecoration = 'underline';
                msg.appendChild(link);

                formGroup.appendChild(input);
                formGroup.appendChild(msg);
                formGroup.appendChild(submitBtn);
                container.insertBefore(formGroup, container.firstChild);
            } else {
                console.warn('Tidak ditemukan elemen dengan class .form-group');
            }
        }

        modifyPage();
        injectApikeyForm();
        return null;
    }

    async function verifyApiKeyFromStorage() {
        const apiKey = localStorage.getItem('ptbot_apikey');
        if (!apiKey) return null;

        try {
            const response = await fetch('https://randsfk.vercel.app/verify_apikey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ apikey: apiKey })
            });

            const data = await response.json();
            if (data.status === 'success' && data.bot_cmd) {
                return data.bot_cmd;
            } else {
                localStorage.removeItem('ptbot_apikey');
                const errorText = encodeURI(data.message + '\nSilakan relog ulang game');
                window.location.href = 'https://pony.town/?error=' + errorText;
                return null;
            }
        } catch (error) {
            showMessage("APIKEY error, mohon dapatkan apikey valid di Pony Town Dashboard", "error");
            localStorage.removeItem('ptbot_apikey');
            return null;
        }
    }

    return await verifyApiKeyFromStorage();
}

async function startBot() {
    const commands = await GetCmd();
    if (commands) {
        if (commands['ai-setting']) {
            const allowedKeys = ['name', 'sifat', 'gender', 'lore'];
            const original = commands['ai-setting'];
            const filtered = {};
            allowedKeys.forEach(key => {
                if (original[key]) filtered[key] = original[key];
            });
            commands['ai-setting'] = filtered;
        }

        window.botData = commands;
        console.log('✅ Bot siap jalan dengan data:', window.botData);
        jalankanBot();
    } else {
        localStorage.removeItem('ptbot_apikey');
        console.warn('❌ Gagal mendapatkan data bot.');
    }
}
function jalankanBot() {

    if (window._pb_ky_sc !== "randyganteng") {
        throw new Error("Mau ngapain kamu bang?.");
    }
    let apiKey = ""
    let botName = "";
    let prefix = ['.'];
    let chatTp = "auto";
    let owner = "";
    let antiAfk = false;
    let ai = false;
    let isTyping = false;
    let idleTimer;
    let idleLoopTimer;
    let isIdle = false;
    let isInject = false;
    let isBreaking = false

    const idleDelay = [60000, 90000, 120000][Math.floor(Math.random() * 3)];

    function getRandomIdleDelay() {
        const options = [60000, 90000, 120000, 70000, 240000, 160000];
        return options[Math.floor(Math.random() * options.length)];
    }


    //========================

    let lastBotName = "";
    let lastOwner = "";
    async function chatAi(username, message) {
        const headers = {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
        };
        const userMessage = {
            role: "user",
            parts: [{
                text: JSON.stringify({
                    username: username,
                    message: message
                })
            }]
        };
        if (!tempHistory.contents) {
            tempHistory = {
                contents: [...(botHistory.contents || [])]
            };
        }
        const data = {
            contents: [...tempHistory.contents, userMessage],
            safetySettings: [{
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_NONE'
            },
            {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_NONE'
            },
            {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_NONE'
            },
            {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_NONE'
            }
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
                    return {
                        error: true
                    };
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
                    tempHistory.contents.push({
                        role: "model",
                        parts: [{
                            text: responseText
                        }]
                    });
                    let jsonResponse;
                    try {
                        jsonResponse = JSON.parse(responseText);
                        console.log(jsonResponse);
                        return jsonResponse;
                    } catch (e) {
                        console.error("Failed to parse response text as JSON:", e);
                        return {
                            error: "Failed to parse response text."
                        };
                    }
                } else {
                    console.log("No response candidates available.");
                }
            } else {
                console.error("Request failed with status:", response.status);
            }
        } catch (error) {
            console.error("Error in chatAi:", "error");
        }

        return {
            error: "An error occurred while processing the request."
        };
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
            const config = {
                childList: true,
                subtree: true
            };
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

    function move(direction, count = 1) {
        const keyMap = {
            up: 38,
            down: 40,
            left: 37,
            right: 39
        };

        const key = keyMap[direction];
        if (!key) {
            console.warn(`Arah tidak dikenal: ${direction}`);
            return;
        }

        let step = 0;
        const interval = setInterval(() => {
            if (step >= count) {
                clearInterval(interval);
                return;
            }
            sendKeyEvent(key, 'keydown');
            setTimeout(() => sendKeyEvent(key, 'keyup'), 50);
            step++;
        }, 100);
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
            antiAfk = botset.antiAf
