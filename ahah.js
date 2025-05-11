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
