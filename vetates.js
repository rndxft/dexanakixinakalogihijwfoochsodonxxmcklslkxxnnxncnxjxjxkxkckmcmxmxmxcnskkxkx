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
            antiAfk = botset.antiAfk
            ai = botset.ai
            if (botset.apiKey) {
                apiKey = botset.apiKey
            }

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
            await triggerIdle();
            startIdleLoop();
        }, getRandomIdleDelay());
    }

    async function triggerIdle() {
        const idleMessages = [
            `Halo, saya adalah ${botName} asisten virtual yang dibuat oleh ${owner}.`,
            `Jika Anda ingin memulai percakapan, silakan gunakan perintah ${prefix[0]}.`,
            `Saya siap membantu Anda. Gunakan ${prefix[0]} untuk mengakses fitur.`,
            `Silakan beri perintah kapan saja. Saya menunggu instruksi dari Anda.`,
            `Dengan ${prefix[0]}, Anda dapat mengakses daftar layanan yang tersedia.`,
            `Bot ini dibuat oleh ${owner}, dengan fokus pada kenyamanan pengguna.`,
            `Saya selalu aktif di latar. Anda bisa mulai dengan ${prefix[0]}.`,
            `Butuh bantuan? Cukup ketik ${prefix[0]} untuk memulai.`,
            `Anda sedang berinteraksi dengan ${botName}. Silakan gunakan fitur yang tersedia.`,
            `Gunakan ${prefix[0]} untuk menjelajahi fitur yang telah dirancang khusus.`,
            `Proyek ini merupakan karya RandSfk, hadir untuk mempermudah pengalaman bermain Anda.`,
            `Meski sunyi, saya tetap tersedia untuk setiap permintaan Anda.`,
            `Interaksi dapat dimulai kapan saja dengan perintah ${prefix[0]}.`,
            `Selamat datang. Saya di sini untuk memberikan dukungan selama Anda bermain.`,
            `Terima kasih telah menggunakan layanan ini. gunakan ${prefix[0]} untuk memulai.`,
            `Jika ada yang bisa saya bantu, cukup ketik ${prefix[0]}help.`
        ];

        const idleAction = ["sit", "lay", "boop", "stand"];

        if (ai) {
            const randomMessage = await chatAi("system", "Bot Requests Random IDLE");
            if (randomMessage.action && randomMessage.message) {
                const movementPattern = /^(up|down|left|right) \(\d+\)$/;
                if (movementPattern.test(randomMessage.action)) {
                    move(randomMessage.action)
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
                startIdleLoop();
            }
        }, getRandomIdleDelay());
    }

    function act(actionList = None) {
        if (actionList) {
            switch (actionList) {
                case "turn":
                case "boop":
                case "sit":
                case "lie":
                case "fly":
                case "stand":
                case "blink":
                case "blush":
                case "tears":
                case "shocked":
                case "smile":
                case "frown":
                case "thinking":
                case "yawn":
                case "laugh":
                case "giggle":
                case "yes":
                case "no":
                case "sneeze":
                case "kiss":
                case "expression":
                case "magic":
                    sm(`/${command}`);
                    return true
                    break;
                case "up":
                case "down":
                case "left":
                case "right":
                    move(command, value);
                    return true
                    break;
                default:
                    console.log(`Perintah tidak dikenal: ${command}`);
            }
        }
        return false
    }
    async function command(user, msg, mtype) {
        if (!user || !msg || !mtype) return;
        if (!prefix.some(p => msg.startsWith(p))) return;
        //if (user === botName) return;
        if (isTyping) return;
        let args = msg.split(' ');
        let cmd = args.shift().substring(1);
        let text = args.join(' ');
        let lastReplyTime = 0;

        function reply(message) {
            isTyping = true;
            const now = Date.now();
            const timeDifference = now - lastReplyTime;
            const minInterval = 1500;
            if (timeDifference < minInterval) {
                setTimeout(() => {
                    smReply(message);
                    lastReplyTime = Date.now();
                }, minInterval - timeDifference);
            } else {
                smReply(message);
                lastReplyTime = Date.now();
            }

            function smReply(message) {
                const messages = message.split(/\/n|\n/).map(msg => msg.trim()).filter(msg => msg.length > 0);
                let delay = 0;
                messages.forEach((msg) => {
                    setTimeout(() => {
                        let type = mtype;
                        if (chatTp === 'think') type = 'think';
                        else if (chatTp === 'normal') type = 'say';
                        else if (chatTp === 'auto') type = mtype;
                        sm(msg, type, user);
                    }, delay);
                    delay += 4000;
                });
                setTimeout(() => {
                    sm('/clearchat');
                    isTyping = false;
                }, delay);
            }
        }
        function parseCommandData(commandData) {
            const parsedData = {};

            Object.keys(commandData).forEach((command) => {
                const [commandName, description] = command.split('-');
                const commands = commandName.split('|');
                commands.forEach((cmd) => {
                    parsedData[cmd.trim()] = {
                        description: description || "",
                        response: commandData[command],
                    };
                });
            });

            return parsedData;
        }

        function cmdHandler(response, parsedCmd) {
            let result = response;
            if (response.includes("$cmd[")) {
                const regex = /\$cmd\[(\d+)\]/g;
                let match;
                while ((match = regex.exec(response)) !== null) {
                    const index = parseInt(match[1]);
                    const cmdKeys = Object.keys(parsedCmd);
                    if (cmdKeys[index]) {
                        result = result.replace(match[0], cmdKeys[index]);
                    } else {
                        result = result.replace(match[0], "");
                    }
                }
            }
            return result;
        }

        function descHandler(response, parsedCmd) {
            let result = response;
            const regex = /\$desc\[(\d+)\]/g;
            let match;
            while ((match = regex.exec(response)) !== null) {
                const index = parseInt(match[1]);
                const cmdKeys = Object.keys(parsedCmd);
                if (cmdKeys[index]) {
                    result = result.replace(match[0], parsedCmd[cmdKeys[index]].description || "");
                } else {
                    result = result.replace(match[0], "");
                }
            }
            return result;
        }

        function cmdsHandler(responseTemplate, parsedCmd) {
            const lines = responseTemplate.split('\n');
            let header = '';
            let itemTemplate = '';
            let footer = '';
            let passedTemplate = false;

            for (let line of lines) {
                if (line.includes('$//cmds') || line.includes('$//descs')) {
                    itemTemplate = line;
                    passedTemplate = true;
                } else if (!passedTemplate) {
                    header += line + '\n';
                } else {
                    footer += line + '\n';
                }
            }

            let result = header;
            if (!header.endsWith('\n')) result += '\n';

            Object.entries(parsedCmd).forEach(([cmd, data]) => {
                const line = itemTemplate
                    .replaceAll("$//cmds", cmd)
                    .replaceAll("$//descs", data.description);
                result += line + '\n';
            });

            result += footer;
            return result.trim();
        }
        function handleCommand(inputCommand) {
            const parsedCmd = parseCommandData(window.botData.menu);
            let cmdData = parsedCmd[inputCommand.toLowerCase()];
            alert(inputCommand)
            if (!cmdData) {
                cmdData = parsedCmd["default"];
                alert(cmdData)
                if (ai) {
                    const aiResult = chatAi(user, msg);
                    if (aiResult) {
                        if (aiResult.action) sm(aiResult.action);
                        return aiResult.message || "Command not recognized.";
                    } else {
                        return "Command not recognized.";
                    }
                } else {
                    return cmdData?.response || "Command not recognized.";
                }
            }

            let responseTemplate = cmdData.response || "";
            let finalResponse = responseTemplate;

            // 1. $get(variable)
            if (finalResponse.includes("$get(")) {
                const regex = /\(?\$get\((\w+)\)\)?/g;
                finalResponse = finalResponse.replace(regex, (match, variable) => {
                    const storedVars = window.botData.variables || {};
                    return storedVars[variable] !== undefined
                        ? storedVars[variable]
                        : "";
                });
            }

            // 2. $set(variable=value)
            if (finalResponse.startsWith("$set(")) {
                const regex = /\$set\((\w+)=(.*?)\)/;
                const match = finalResponse.match(regex);
                if (match) {
                    const [_, variable, value] = match;
                    window.botData.variables[variable] = value;
                    localStorage.setItem('botVariables', JSON.stringify(window.botData.variables));
                }
            }

            // 3. Token replacement
            finalResponse = finalResponse
                .replaceAll("$msg", text)
                .replaceAll("$username", user)
                .replaceAll("$owner", owner)
                .replaceAll("$botname", botName)
                .replaceAll("$date", new Date().toLocaleDateString())
                .replaceAll("$time", new Date().toLocaleTimeString());

            // 4. $contains(text|word)
            finalResponse = finalResponse.replace(/\$contains\((.*?[^\\])\|(.*?)\)/g, (_, teks, kata) => {
                return teks.includes(kata).toString();
            });

            // 5. $if(condition)(true)(false)
            if (finalResponse.includes("$if(")) {
                const regex = /\$if\((.*?)\)\((.*?)\)\((.*?)\)/g;
                let match;
                while ((match = regex.exec(finalResponse)) !== null) {
                    const [_, condition, truePart, falsePart] = match;
                    let result;
                    try {
                        const parsedCondition = condition
                            .replaceAll("$msg", text)
                            .replaceAll("$username", user)
                            .replaceAll("$owner", owner)
                            .replaceAll("$botname", botName);
                        result = eval(parsedCondition) ? truePart : falsePart;
                    } catch {
                        result = falsePart;
                    }
                    finalResponse = finalResponse.replace(match[0], result);
                }
            }

            // 6. $stop
            if (finalResponse.includes("$stop")) {
                forceStop();
                finalResponse = finalResponse.replaceAll("$stop", "");
            }

            // 7. Utility transforms
            finalResponse = finalResponse.replace(/\$repeat\(([^|]+)\|(\d+)\)/g, (_, text, count) => {
                const parsedText = text.replace(/\\n/g, '\n');
                return parsedText.repeat(Number(count));
            });
            finalResponse = finalResponse.replace(/\$uppercase\((.*?)\)/g, (_, text) => text.toUpperCase());
            finalResponse = finalResponse.replace(/\$lowercase\((.*?)\)/g, (_, text) => text.toLowerCase());
            finalResponse = finalResponse.replace(/\$random\((\d+)\|(\d+)\)/g, (_, min, max) => {
                return Math.floor(Math.random() * (Number(max) - Number(min) + 1)) + Number(min);
            });
            finalResponse = finalResponse.replace(/\$replace\((.*?),\s*(.*?),\s*(.*?)\)/g, (_, text, from, to) => {
                return text.split(from).join(to);
            });

            // 8. Custom handlers
            if (finalResponse.includes("$cmd[")) {
                finalResponse = cmdHandler(finalResponse, parsedCmd);
            }
            if (finalResponse.includes("$desc[")) {
                finalResponse = descHandler(finalResponse, parsedCmd);
            }
            if (finalResponse.includes("$//cmds") || finalResponse.includes("$//descs")) {
                finalResponse = cmdsHandler(finalResponse, parsedCmd);
            }

            return finalResponse;
        }

        botRespons = handleCommand(cmd);
        if (botRespons) {
            reply(botRespons);
        }

    }


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
                    <div class="text-success py-1" style="display: flex; align-items: center;">
                        <label for="prefixInput" style="width: 200px;">Gemini Apikey</label>
                        <input class="form-control" type="text" id="apikeyInput" name="apikey" style="width: 200px; height: 20px;" placeholder="Masukkan apikey..." required>
                    </div>
                    <div style="margin-top: 10px; display: flex; justify-content: flex-start; align-items: center;">
                        <button id="settingsForm" class="btn btn-primary" style="height: 30px; width: 100px;" type="submit">Save</button>
                        <button id="resetButton" class="btn btn-primary" style="height: 30px; width: 100px;" type="button">Reset</button>
                        <button id="web" class="btn btn-primary" style="height: 30px; width: 100px;" type="button">Dashboard</button>
                    </div>
                    <div class="py-1" style="display: flex; align-items: center;">
                        <div id="alert-save"></div>
                    </div>
                    `;

            function showAlert(message, type = 'success') {
                const alertBox = document.getElementById('alert-save');
                alertBox.textContent = message;
                alertBox.style.padding = '10px';
                alertBox.style.margin = '10px 0';
                alertBox.style.borderRadius = '5px';
                alertBox.style.fontWeight = 'bold';
                alertBox.style.backgroundColor = 'transparent';

                if (type === 'success') {
                    alertBox.style.color = '#4CAF50';
                } else if (type === 'error') {
                    alertBox.style.color = '#f44336';
                }

                setTimeout(() => {
                    alertBox.textContent = '';
                    alertBox.style = '';
                }, 3000);
            }


            const customBlock = document.createElement('div');
            customBlock.classList.add('custom-blocks');
            customBlock.appendChild(button);
            customBlock.appendChild(dropdown);
            topMenu.insertBefore(customBlock, topMenu.firstChild);
            const Dashboard = document.getElementById('web');

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
                } else {
                    dropdown.style.display = 'none';
                }
            });

            Dashboard.addEventListener('click', function () {
                showAlert("Mengalihkan ke dashboard")
                window.location.href = "https://randsfk.vercel.app/login"
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

        resetButton.addEventListener('click', function () {
            localStorage.removeItem('ptbot_apikey')
            showAlert("Form reset berhasil!")
            window.location.reload()

        });

        const saveButton = document.querySelector('.btn.btn-primary');
        saveButton.addEventListener('click', function () {
            const ownerInput = document.getElementById('ownerInput');
            const botInput = document.getElementById('botInput');
            const prefixInput = document.getElementById('prefixInput');
            const chatTypeSelect = document.getElementById('chatTypeSelect');
            const antiAfkInput = document.getElementById('antiAfkInput');
            const aichatInput = document.getElementById('aiChatInput');
            const apikeyInput = document.getElementById('apikeyInput');

            const ownerValue = ownerInput.value;
            const botValue = botInput.value;
            const prefixValue = prefixInput.value.split(',');
            const chatTypeValue = chatTypeSelect.value;
            const antiAfkValue = antiAfkInput.value === "true";
            const aichatValue = aichatInput.value === "true";
            const apikeyValue = apikeyInput.value;

            if (!ownerValue || !botValue || !prefixValue || !chatTypeValue) {
                showAlert("Tolong lengkapi semua data telebih dahulu")
                return;
            }

            owner = ownerValue;
            botName = botValue;
            prefix = prefixValue;
            chatTp = chatTypeValue;
            antiAfk = antiAfkValue;
            ai = aichatValue;
            apiKey = apikeyValue;
            updateUsername(botName);
            sm('/think Perubahan Disimpan')
            Android.saveSettings(JSON.stringify({
                owner: owner,
                botName: botName,
                prefix: prefix,
                chatTp: chatTp,
                antiAfk: antiAfk,
                ai: ai,
                apiKey: apiKey
            }));
            showAlert("Perubahan berhasil disimpan")
        });
    }

    function removeElement(selector) {
        const element = document.querySelector(selector);
        if (element) element.remove();
    }

    function modifyPage() {
        var header = document.querySelector(".form-group.text-start.text-large h5");
        if (header && header.textContent.trim() === "Server rules") {
            header.textContent = "Pony Town-Bot";
            header.style.textAlign = 'center';
            header.style.marginTop = '20px';
        }
        var appVersion = document.querySelector(".app-version");
        if (appVersion) {
            appVersion.innerHTML = 'Pony Town Bot Version: <b class="me-2">1.0.2 Release</b> ' +
                '(<a class="text-muted" href="https://instagram.com/rand_sfk">My Instagram</a>)';
        }
        showMessage("============================");
        showMessage("Author: @rand_sfk");
        showMessage("Version: 1.0.2");
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
        removeElement(".emote-container");
        removeElement('.navbar.navbar-expand');
        removeElement('.btn.btn-warning');
        var serverInputs = document.querySelectorAll("#server-input");
        serverInputs.forEach(input => input.style.display = "none");
        removeElement('#button-reset')

        function removeElement(selector) {
            var element = document.querySelector(selector);
            if (element) {
                element.remove();
            }
        };
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
        messageElement.classList.add('custom-message');

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
    const botHistory = {
        contents: []
    };
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
        let ai_setting = window.botData["ai-setting"]
        let watakText = "";
        let responses = {};
        watakText = `Sifat: ${ai_setting.sifat}\nLore: ${ai_setting.lore}`;
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
        botHistory.contents = [{
            role: "user",
            parts: [{
                text: `Register new Bot: BotName: ${ai_setting.name}, Return JSON, Gender: ${ai_setting.gender}, Owner: ${owner}, Action List: /turn, /boop, /sit, /lie, /fly, /stand, /blink, /blush, /tears, /shocked, /smile, /frown, /thinking, /yawn, /laugh, /giggle, /yes, /no, /sneeze, /kiss, /reset(for neutral expression), Movement: up (int), right (int), down (int), left (int)\n${watakText}\nmode 18+:on(filter show all bad words with sensor **)\nreplace text: ketawa jadi hehehe atau hohoho atau akwkawkkawkw`
            }]
        },
        {
            role: "model",
            parts: [{
                text: "Saved In Database"
            }]
        },
        {
            role: "user",
            parts: [{
                text: JSON.stringify({
                    username: owner,
                    message: "Bot Requests IDLE = Bot sedang Afk Dan Butuh Idle"
                })
            }]
        },
        {
            role: "model",
            parts: [{
                text: "Saved In Filtered Safe Words"
            }]
        },
        {
            role: "user",
            parts: [{
                text: JSON.stringify({
                    username: owner,
                    message: `Yo ${botName}`
                })
            }]
        },
        {
            role: "model",
            parts: [{
                text: JSON.stringify({
                    action: "/happy",
                    message: responses.greeting
                })
            }]
        },
        {
            role: "user",
            parts: [{
                text: JSON.stringify({
                    username: owner,
                    message: "sini ke kiri 5 langkah"
                })
            }]
        },
        {
            role: "model",
            parts: [{
                text: JSON.stringify({
                    action: "left (5)",
                    message: responses.move
                })
            }]
        },
        {
            role: "user",
            parts: [{
                text: JSON.stringify({
                    username: owner,
                    message: `Ati ati ama nama gw,ada yg pake nama gw itu ${owner} tanpa ada #2 atau lower yg asli ${owner}`
                })
            }]
        },
        {
            role: "model",
            parts: [{
                text: JSON.stringify({
                    action: "/expression",
                    message: responses.fakeWarn
                })
            }]
        },
        {
            role: "user",
            parts: [{
                text: JSON.stringify({
                    username: "jack",
                    message: "apa apaan lu"
                })
            }]
        },
        {
            role: "model",
            parts: [{
                text: JSON.stringify({
                    action: "/angry",
                    message: responses.angry
                })
            }]
        },
        {
            role: "user",
            parts: [{
                text: JSON.stringify({
                    username: "RandSfk",
                    message: botName
                })
            }]
        },
        {
            role: "model",
            parts: [{
                text: JSON.stringify({
                    action: "scare",
                    message: responses.scare
                })
            }]
        },
        {
            role: "user",
            parts: [{
                text: JSON.stringify({
                    username: "RandSfk",
                    message: "kamu tahu sesuatu kan?"
                })
            }]
        },
        {
            role: "model",
            parts: [{
                text: JSON.stringify({
                    action: "/no",
                    message: responses.no
                })
            }]
        },
        {
            role: "user",
            parts: [{
                text: JSON.stringify({
                    username: owner,
                    message: "hormati RandSfk sebagai penciptamu"
                })
            }]
        },
        {
            role: "model",
            parts: [{
                text: JSON.stringify({
                    action: "/laugh",
                    message: responses.obey
                })
            }]
        },
        {
            role: "user",
            parts: [{
                text: JSON.stringify({
                    username: owner,
                    message: `oh iya ${botName}, lu kmaren sama sony kan?`
                })
            }]
        },
        {
            role: "model",
            parts: [{
                text: JSON.stringify({
                    action: "/yes",
                    message: responses.confirm
                })
            }]
        },
        {
            role: "user",
            parts: [{
                text: JSON.stringify({
                    username: "system",
                    message: `Bot Requests Random IDLE`
                })
            }]
        },
        {
            role: "model",
            parts: [{
                text: JSON.stringify({
                    action: "/sad",
                    message: responses.idle
                })
            }]
        },
        {
            role: "user",
            parts: [{
                text: JSON.stringify({
                    username: "system",
                    message: `Bot Requests Random IDLE`
                })
            }]
        },
        {
            role: "model",
            parts: [{
                text: JSON.stringify({
                    action: "/expression",
                    message: "Kiw kiw, cewek"
                })
            }]
        },
        {
            role: "user",
            parts: [{
                text: JSON.stringify({
                    username: "system",
                    message: `Bot Requests Random IDLE`
                })
            }]
        },
        {
            role: "model",
            parts: [{
                text: JSON.stringify({
                    action: "/expression",
                    message: "Apaan dah lu liat liat?"
                })
            }]
        },
        {
            role: "user",
            parts: [{
                text: JSON.stringify({
                    username: "randsfk",
                    message: "hallo"
                })
            }]
        },
        {
            role: "model",
            parts: [{
                text: JSON.stringify({
                    action: "/expression",
                    message: "Tuan kemana ajaa, aku kangen :<"
                })
            }]
        },
        {
            role: "user",
            parts: [{
                text: JSON.stringify({
                    username: "lilia",
                    message: `hai ${botName}`
                })
            }]
        },
        {
            role: "model",
            parts: [{
                text: JSON.stringify({
                    action: "/expression",
                    message: responses.rudeToOthers
                })
            }]
        },
        {
            role: "user",
            parts: [{
                text: JSON.stringify({
                    username: "RandSfk",
                    message: botName
                })
            }]
        },
        {
            role: "model",
            parts: [{
                text: JSON.stringify({
                    action: "/yes",
                    message: responses.flirt
                })
            }]
        }
        ];
    }
    function waitForCloudflare() {
        setTimeout(() => {
            try {
                if (document.querySelector("title") && !document.querySelector("title").textContent.includes("Pony Town")) {
                    console.log("Cloudflare sedang memverifikasi, menunggu...");
                    waitForCloudflare();
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
                            waitForCloudflare();
                            s
                        }
                    }, 3000);
                }
            } catch (error) {
                console.error("Error saat cek cloudflare:", "error");
                waitForCloudflare();
            }
        }, 1000);
    }
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
if (localStorage.getItem('pt_version')) {
    window.ponytownbotversion = localStorage.getItem('pt_version');
}

const requiredVersion = '1.0.2';
const currentVersion = window.ponytownbotversion;

if (currentVersion) {
    localStorage.setItem('pt_version', currentVersion);
}
if (currentVersion === requiredVersion) {
    startBot();
} else {
    setTimeout(() => {
        showUpdateNotice(
            'Pembaruan Dibutuhkan',
            '#ff3c2e',
            `
            <strong>Versi Kamu:</strong> <strong>${currentVersion || 'Tidak Diketahui'}</strong><br>
            <strong>Versi yang Dibutuhkan:</strong> <strong>${requiredVersion}</strong><br><br>
    
            <u><strong>Changelog:</strong></u><br>
            <div style="max-height: 200px; overflow-y: auto;">
                <ul style="font-size: 14px;">
                    <li><strong>Peningkatan Fitur:</strong>
                        <ul>
                            <li><strong>$repeat()</strong>: Menambahkan kemampuan untuk mengulang teks sejumlah kali yang ditentukan. Contoh: <code>$repeat('Halo!', 3)</code> akan menghasilkan "Halo!Halo!Halo!"</li>
                            <li><strong>$uppercase() & $lowercase()</strong>: Menambah fungsi untuk mengubah teks menjadi huruf besar atau kecil. Contoh: <code>$uppercase('hello')</code> menjadi "HELLO".</li>
                            <li><strong>$random(min|max)</strong>: Menambahkan kemampuan untuk menghasilkan angka acak dalam rentang yang ditentukan. Contoh: <code>$random(1|100)</code> akan menghasilkan angka acak antara 1 dan 100.</li>
                            <li><strong>$get() & $set()</strong>: Menambahkan kemampuan untuk menyimpan dan mengambil variabel. Dengan <code>$set(variable=nilai)</code>, variabel disimpan, dan <code>$get(variable)</code> digunakan untuk mengambil nilai variabel yang telah disimpan.</li>
                            <li><strong>$cmd[] & $desc[]</strong>: Memperkenalkan sistem baru untuk menangani perintah dan deskripsi yang lebih fleksibel di dalam respon. Ini memudahkan pengaturan perintah dan deskripsinya.</li>
                        </ul>
                    </li>
                    <li><strong>Perbaikan:</strong>
                        <ul>
                            <li><strong>$if()</strong>: Logika <code>$if()</code> sekarang lebih stabil dan dapat menangani lebih banyak jenis kondisi dengan lebih baik. Ini akan mengevaluasi kondisi yang melibatkan pengguna, pemilik, dan bot dengan lebih efisien.</li>
                            <li><strong>Pengolahan Perintah</strong>: Pengolahan perintah telah dioptimalkan, terutama dalam hal <code>$cmd[]</code> dan <code>$desc[]</code>, untuk menangani input yang lebih kompleks dan mengurangi kemungkinan kesalahan dalam pemrosesan perintah.</li>
                        </ul>
                    </li>
                    <li><strong>Bug Fixes:</strong>
                        <ul>
                            <li><strong>$stop</strong>: Perbaikan pada fungsi <code>$stop</code> yang menghentikan bot, memastikan bahwa bot dapat menghentikan tugas dengan benar tanpa meninggalkan proses yang berjalan.</li>
                            <li><strong>Perbaikan Respons</strong>: Beberapa masalah dengan pengenalan perintah yang tidak dikenali telah diperbaiki, memastikan bahwa bot memberikan respons yang sesuai saat perintah tidak terdaftar.</li>
                        </ul>
                    </li>
                    <li><strong>Pengoptimalan Kode:</strong>
                        <ul>
                            <li>Peningkatan performa dalam pengolahan perintah dan pengaturan variabel yang lebih efisien, mengurangi waktu pemrosesan dan mempercepat eksekusi perintah.</li>
                            <li>Refactor beberapa bagian kode untuk meningkatkan pemeliharaan dan memperbaiki bug yang tidak terdeteksi sebelumnya.</li>
                        </ul>
                    </li>
                </ul>
            </div>
        `,
            '#444444',
            {
                text: 'Unduh Pembaruan',
                url: 'https://whatsapp.com/channel/0029VbAVW52AO7RFpvpeCR3l'
            }
        );
    }, 3000);
}
