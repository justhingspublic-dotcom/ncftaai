// ==================== State Management ====================
const state = {
    isListening: false,
    textSize: 'medium', // 'small', 'medium', 'large'
    isVoiceEnabled: true,
    currentLang: 'zh-TW',
    recognition: null,
    finalTranscript: '' // 保存已確定的語音識別結果
};

// ==================== DOM Elements ====================
const elements = {
    chatContainer: document.getElementById('chatContainer'),
    messageInput: document.getElementById('messageInput'),
    voiceButton: document.getElementById('voiceButton'),
    suggestionCards: document.getElementById('suggestionCards'),
    textSizeToggle: document.getElementById('textSizeToggle'),
    voiceToggle: document.getElementById('voiceToggle'),
    langToggle: document.getElementById('langToggle'),
    scrollToBottomBtn: document.getElementById('scrollToBottomBtn'),
    infoButton: document.getElementById('infoButton')
};

// ==================== Content Data ====================
const contentData = {
    'zh-TW': {
        tickets: {
            title: '票價與地圖',
            response: '全票 150 元，優待票 120 元。可於現場購票或透過官網線上訂票。持電子票券可快速入園，無需排隊。園區地圖可在服務中心索取。'
        },
        traffic: {
            title: '交通資訊',
            response: '搭乘國道客運或台鐵至羅東站，轉乘 621、621A 公車可直達園區。自行開車請導航「宜蘭傳藝園區」，園區備有停車場。'
        },
        facilities: {
            title: '設施時間',
            response: '園區開放時間：每日 9:00-18:00。各展館與設施開放時間可能不同，詳情請洽服務中心。'
        },
        performance1: {
            title: '齊天大聖鬧龍宮',
            response: '《齊天大聖鬧龍宮》是園區經典表演劇目，結合傳統戲曲與現代舞台技術，精彩呈現孫悟空大鬧龍宮的故事。演出時間請參考當期節目表。'
        },
        performance2: {
            title: '接班人好戲台',
            response: '「接班人好戲台」培育新生代表演人才，展現傳統技藝的傳承與創新。每週末定期演出，歡迎蒞臨欣賞。'
        },
        performance3: {
            title: '臺鼓晨鐘',
            response: '「臺鼓晨鐘」為園區晨間儀式表演，以傳統鼓樂揭開一天的序幕，展現傳統藝術的莊嚴與活力。'
        },
        renovation: {
            title: '全聯善美的建築整修計畫',
            response: '全聯善美的建築整修計畫致力於保存與修復園區內具有歷史價值的傳統建築，讓文化資產得以永續傳承。'
        },
        craftsman: {
            title: '小小職人展-工藝上菜',
            response: '「小小職人展-工藝上菜」展覽以食物為主題，結合傳統工藝技法，呈現台灣飲食文化與工藝美學的完美結合。'
        },
        scholar: {
            title: '舉人之力',
            response: '「舉人之力」展覽介紹科舉制度與傳統文人文化，透過文物與互動展示，讓觀眾了解古代讀書人的奮鬥歷程。'
        }
    },
    'en': {
        tickets: {
            title: 'Tickets & Map',
            response: 'Regular ticket: NT$150, Concession: NT$120. Purchase on-site or online. E-tickets allow fast entry. Maps available at service center.'
        },
        traffic: {
            title: 'Transportation',
            response: 'Take bus 621 or 621A from Luodong Station. By car, navigate to "Yilan Traditional Arts Center". Parking available.'
        },
        facilities: {
            title: 'Facility Hours',
            response: 'Park hours: 9:00-18:00 daily. Individual facility hours may vary. Please check with service center for details.'
        },
        performance1: {
            title: 'Monkey King Havoc',
            response: 'Classic performance combining traditional opera with modern stage technology, presenting the story of Monkey King. Check program schedule for show times.'
        },
        performance2: {
            title: 'Rising Stars Stage',
            response: 'Platform for nurturing new generation performers, showcasing traditional arts heritage and innovation. Weekend performances available.'
        },
        performance3: {
            title: 'Morning Drum Ceremony',
            response: 'Traditional morning drum ceremony that opens the day with traditional music, displaying the solemnity and vitality of traditional arts.'
        },
        renovation: {
            title: 'Building Restoration Project',
            response: 'Dedicated to preserving and restoring historically valuable traditional buildings in the park for cultural heritage sustainability.'
        },
        craftsman: {
            title: 'Little Craftsman Exhibition',
            response: 'Exhibition combining food themes with traditional craftsmanship, presenting the perfect fusion of Taiwanese cuisine and craft aesthetics.'
        },
        scholar: {
            title: 'Scholar Power',
            response: 'Exhibition introducing the imperial examination system and traditional literati culture through artifacts and interactive displays.'
        }
    }
};

// ==================== Initialization ====================
function init() {
    setupEventListeners();
    setupSpeechRecognition();
    loadPreferences();
}

// ==================== Event Listeners ====================
function setupEventListeners() {
    // Voice button
    elements.voiceButton.addEventListener('click', toggleListening);
    
    // Text size toggle
    elements.textSizeToggle.addEventListener('click', toggleTextSize);
    
    // Voice toggle
    elements.voiceToggle.addEventListener('click', toggleVoiceEnabled);
    
    // Language toggle
    elements.langToggle.addEventListener('click', toggleLanguage);
    
    // Scroll to bottom button
    elements.scrollToBottomBtn.addEventListener('click', () => {
        scrollToBottom();
    });
    
    // Info button - add suggestion cards to chat
    elements.infoButton.addEventListener('click', () => {
        addSuggestionCardsToChat();
    });
    
    // Scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Option buttons
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const content = contentData[state.currentLang][action];
            if (content) {
                handleCardClick(content.title, content.response);
            }
        });
    });
}

// ==================== Speech Recognition ====================
function setupSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('Speech recognition not supported');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    state.recognition = new SpeechRecognition();
    state.recognition.lang = state.currentLang;
    state.recognition.continuous = true;
    state.recognition.interimResults = true;
    
    state.recognition.onstart = () => {
        console.log('Speech recognition started');
        elements.messageInput.placeholder = state.currentLang === 'zh-TW' ? '請說出您的問題...' : 'Please speak your question...';
        elements.messageInput.value = '';
        state.finalTranscript = ''; // 重置已確定的文字
    };
    
    state.recognition.onresult = (event) => {
        let interimTranscript = '';
        
        // 只處理新的結果，從 resultIndex 開始
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                // 已確定的結果累加到 state.finalTranscript
                state.finalTranscript += transcript;
            } else {
                // 臨時結果
                interimTranscript += transcript;
            }
        }
        
        // 即時顯示：已確定的文字 + 臨時識別的文字
        const fullText = state.finalTranscript + interimTranscript;
        elements.messageInput.value = fullText;
        
        // 如果有辨識到文字，變成綠色發送按鈕
        if (fullText.trim().length > 0) {
            elements.voiceButton.classList.add('listening');
            elements.voiceButton.querySelector('.material-symbols-outlined').textContent = 'send';
        } else {
            elements.voiceButton.classList.remove('listening');
            elements.voiceButton.querySelector('.material-symbols-outlined').textContent = 'stop';
        }
    };
    
    state.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
            stopListening();
            elements.messageInput.placeholder = state.currentLang === 'zh-TW' ? '請清楚說出您的問題' : 'Please speak clearly';
            setTimeout(() => {
                elements.messageInput.placeholder = state.currentLang === 'zh-TW' ? '語音辨識內容將顯示於此' : 'Voice recognition will be displayed here';
            }, 3000);
        }
    };
    
    state.recognition.onend = () => {
        console.log('Speech recognition ended');
        if (state.isListening) {
            // 如果還在聆聽狀態，重新啟動（因為continuous可能會自動結束）
            try {
                state.recognition.start();
            } catch (error) {
                console.error('Error restarting recognition:', error);
            }
        }
    };
}

// ==================== Listening Control ====================
function toggleListening() {
    if (state.isListening) {
        stopListening();
    } else {
        startListening();
    }
}

function startListening() {
    if (!state.recognition) {
        alert(state.currentLang === 'zh-TW' ? '您的瀏覽器不支援語音辨識功能' : 'Your browser does not support speech recognition');
        return;
    }
    
    state.isListening = true;
    // 改變圖標為停止（不變綠色）
    elements.voiceButton.querySelector('.material-symbols-outlined').textContent = 'stop';
    elements.messageInput.value = '';
    elements.messageInput.placeholder = state.currentLang === 'zh-TW' ? '請說出您的問題...' : 'Please speak your question...';
    
    try {
        state.recognition.start();
    } catch (error) {
        console.error('Error starting recognition:', error);
        stopListening();
    }
}

function stopListening() {
    state.isListening = false;
    elements.voiceButton.classList.remove('listening');
    // 改回麥克風圖標
    elements.voiceButton.querySelector('.material-symbols-outlined').textContent = 'mic';
    elements.messageInput.placeholder = state.currentLang === 'zh-TW' ? '語音辨識內容將顯示於此' : 'Voice recognition will be displayed here';
    
    if (state.recognition) {
        try {
            state.recognition.stop();
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
    }
    
    // 停止時處理輸入框內容
    const transcript = elements.messageInput.value.trim();
    if (transcript) {
        handleSpeechResult(transcript);
    }
    
    // 清空保存的結果
    state.finalTranscript = '';
}

// ==================== Speech Result Handler ====================
function handleSpeechResult(transcript) {
    console.log('Processing transcript:', transcript);
    
    // Simple keyword matching
    const keywords = {
        'zh-TW': {
            '票價': 'tickets',
            '地圖': 'tickets',
            '門票': 'tickets',
            '購票': 'tickets',
            '交通': 'traffic',
            '設施': 'facilities',
            '時間': 'facilities',
            '齊天': 'performance1',
            '大聖': 'performance1',
            '龍宮': 'performance1',
            '接班': 'performance2',
            '好戲': 'performance2',
            '臺鼓': 'performance3',
            '晨鐘': 'performance3',
            '建築': 'renovation',
            '整修': 'renovation',
            '職人': 'craftsman',
            '工藝': 'craftsman',
            '舉人': 'scholar'
        },
        'en': {
            'ticket': 'tickets',
            'map': 'tickets',
            'price': 'tickets',
            'transport': 'traffic',
            'traffic': 'traffic',
            'facilities': 'facilities',
            'hours': 'facilities',
            'monkey': 'performance1',
            'king': 'performance1',
            'rising': 'performance2',
            'stars': 'performance2',
            'drum': 'performance3',
            'morning': 'performance3',
            'building': 'renovation',
            'restoration': 'renovation',
            'craftsman': 'craftsman',
            'craft': 'craftsman',
            'scholar': 'scholar'
        }
    };
    
    let matchedAction = null;
    const currentKeywords = keywords[state.currentLang];
    
    for (const [keyword, action] of Object.entries(currentKeywords)) {
        if (transcript.includes(keyword)) {
            matchedAction = action;
            break;
        }
    }
    
    if (matchedAction) {
        const content = contentData[state.currentLang][matchedAction];
        addUserMessage(transcript);
        setTimeout(() => {
            addAssistantMessage(content.response, true);
        }, 300);
    } else {
        // Show default response
        addUserMessage(transcript);
        const defaultMsg = state.currentLang === 'zh-TW' 
            ? '我可以協助您了解展覽資訊、交通方式、當期表演等內容，請選擇您想了解的項目。'
            : 'I can help you with exhibitions, transportation, performances, and more. Please select what you\'d like to know.';
        setTimeout(() => {
            addAssistantMessage(defaultMsg, false);
        }, 300);
    }
    
    // Clear input after processing
    setTimeout(() => {
        elements.messageInput.value = '';
    }, 1000);
}

// ==================== Card Click Handler ====================
function handleCardClick(title, response) {
    // 不隱藏 suggestion cards
    
    // Add user message
    addUserMessage(title);
    
    // Add assistant response after a short delay
    setTimeout(() => {
        // 啟用語音，讓打字機效果和語音同時進行
        addAssistantMessage(response, true);
    }, 300);
}

// ==================== Message Management ====================
function addUserMessage(text) {
    const messageGroup = document.createElement('div');
    messageGroup.className = 'message-group user-group';
    
    messageGroup.innerHTML = `
        <div class="message-avatar">
            <span class="material-symbols-outlined">person</span>
        </div>
        <div class="message-content">
            <div class="message-bubble user-bubble">${text}</div>
        </div>
    `;
    
    elements.chatContainer.appendChild(messageGroup);
    scrollToBottom();
}

function addAssistantMessage(text, enableVoice = false) {
    const messageGroup = document.createElement('div');
    messageGroup.className = 'message-group assistant-group';
    
    messageGroup.innerHTML = `
        <div class="message-avatar">
            <img src="3c25cb87ae.png" alt="AI助理" class="avatar-img">
        </div>
        <div class="message-content">
            <div class="message-bubble assistant-bubble">
                <span class="typewriter-text"></span>
                <span class="typewriter-cursor">|</span>
            </div>
        </div>
    `;
    
    elements.chatContainer.appendChild(messageGroup);
    scrollToBottom();
    
    // 先顯示思考動畫
    const textElement = messageGroup.querySelector('.typewriter-text');
    const cursorElement = messageGroup.querySelector('.typewriter-cursor');
    
    showThinkingAnimation(textElement, cursorElement, () => {
        // 思考動畫結束後開始打字機效果
        if (enableVoice && state.isVoiceEnabled) {
            speakText(text);
        }
        typewriterEffect(textElement, cursorElement, text);
    });
}

function showThinkingAnimation(textElement, cursorElement, onComplete) {
    // 隱藏游標，顯示思考動畫
    cursorElement.style.display = 'none';
    
    textElement.innerHTML = `
        <div class="thinking-dots">
            <div class="thinking-dot"></div>
            <div class="thinking-dot"></div>
            <div class="thinking-dot"></div>
        </div>
    `;
    
    // 思考動畫持續 1.5 秒
    setTimeout(() => {
        textElement.innerHTML = '';
        cursorElement.style.display = 'inline';
        if (onComplete) {
            onComplete();
        }
    }, 1500);
}

// ==================== Typewriter Effect ====================
function typewriterEffect(textElement, cursorElement, text, speed = 50) {
    let index = 0;
    
    // 顯示游標閃爍動畫
    cursorElement.style.animation = 'blink 1s infinite';
    
    function typeChar() {
        if (index < text.length) {
            textElement.textContent += text.charAt(index);
            index++;
            
            // 在打字過程中持續滾動到底部
            scrollToBottom();
            
            setTimeout(typeChar, speed);
        } else {
            // 打字完成後隱藏游標
            setTimeout(() => {
                cursorElement.style.display = 'none';
            }, 1000);
        }
    }
    
    typeChar();
}

function scrollToBottom() {
    // 確保 DOM 更新完成後再滾動
    setTimeout(() => {
        // 滾動整個視窗到最底部
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
}

// ==================== Add Suggestion Cards to Chat ====================
function addSuggestionCardsToChat() {
    const cardsHTML = `
        <div class="category-cards-container" style="animation: fadeInUp 0.4s ease;">
            <!-- 展覽資訊 -->
            <div class="category-card">
                <div class="card-image" style="background: #C94A47;">
                    <img src="展覽.png" alt="展覽" class="card-image-icon">
                </div>
                <h3 class="card-category-title">展覽訊息</h3>
                <div class="card-options">
                    <button class="option-btn" data-action="renovation">全聯善美的建築整修計畫</button>
                    <button class="option-btn" data-action="craftsman">小小職人展-工藝上菜</button>
                    <button class="option-btn" data-action="scholar">舉人之力</button>
                </div>
            </div>

            <!-- 參觀資訊 -->
            <div class="category-card">
                <div class="card-image" style="background: #C94A47;">
                    <img src="參觀資訊.png" alt="參觀資訊" class="card-image-icon">
                </div>
                <h3 class="card-category-title">參觀資訊</h3>
                <div class="card-options">
                    <button class="option-btn" data-action="tickets">票價與地圖</button>
                    <button class="option-btn" data-action="traffic">交通資訊</button>
                    <button class="option-btn" data-action="facilities">設施時間</button>
                </div>
            </div>

            <!-- 當期演出 -->
            <div class="category-card">
                <div class="card-image" style="background: #C94A47;">
                    <img src="表演.png" alt="表演" class="card-image-icon">
                </div>
                <h3 class="card-category-title">當期演出</h3>
                <div class="card-options">
                    <button class="option-btn" data-action="performance1">齊天大聖鬧龍宮</button>
                    <button class="option-btn" data-action="performance2">接班人好戲台</button>
                    <button class="option-btn" data-action="performance3">臺鼓晨鐘</button>
                </div>
            </div>
        </div>
    `;
    
    // 將卡片插入到聊天容器中
    const cardsContainer = document.createElement('div');
    cardsContainer.innerHTML = cardsHTML;
    elements.chatContainer.appendChild(cardsContainer.firstElementChild);
    
    // 重新綁定按鈕事件
    const newButtons = elements.chatContainer.querySelectorAll('.option-btn');
    newButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const content = contentData[state.currentLang][action];
            if (content) {
                handleCardClick(content.title, content.response);
            }
        });
    });
    
    scrollToBottom();
}

// ==================== Handle Scroll ====================
function handleScroll() {
    // 檢查是否接近底部
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    
    // 如果距離底部超過 200px，顯示按鈕
    if (distanceFromBottom > 200) {
        elements.scrollToBottomBtn.classList.remove('hidden');
    } else {
        elements.scrollToBottomBtn.classList.add('hidden');
    }
}

// ==================== Text Size Toggle ====================
function toggleTextSize() {
    const sizes = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(state.textSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    state.textSize = sizes[nextIndex];
    
    // 移除所有尺寸類別
    elements.chatContainer.classList.remove('text-small', 'text-medium', 'text-large');
    // 添加新的尺寸類別
    elements.chatContainer.classList.add(`text-${state.textSize}`);
    
    savePreferences();
}

// ==================== Voice Toggle ====================
function toggleVoiceEnabled() {
    state.isVoiceEnabled = !state.isVoiceEnabled;
    
    const icon = elements.voiceToggle.querySelector('.material-symbols-outlined');
    icon.textContent = state.isVoiceEnabled ? 'volume_up' : 'volume_off';
    
    if (!state.isVoiceEnabled && 'speechSynthesis' in window) {
        speechSynthesis.cancel();
    }
    
    savePreferences();
}

// ==================== Language Toggle ====================
function toggleLanguage() {
    state.currentLang = state.currentLang === 'zh-TW' ? 'en' : 'zh-TW';
    
    // Update speech recognition language
    if (state.recognition) {
        state.recognition.lang = state.currentLang;
    }
    
    // Update UI text
    updateUILanguage();
    savePreferences();
}

function updateUILanguage() {
    if (state.currentLang === 'zh-TW') {
        elements.messageInput.placeholder = '語音辨識內容將顯示於此';
    } else {
        elements.messageInput.placeholder = 'Voice recognition will be displayed here';
    }
}

// ==================== Text-to-Speech ====================
function speakText(text) {
    if (!state.isVoiceEnabled || !('speechSynthesis' in window)) {
        return;
    }
    
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = state.currentLang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    speechSynthesis.speak(utterance);
}

// ==================== Preferences ====================
function savePreferences() {
    localStorage.setItem('aiAssistantPrefs', JSON.stringify({
        textSize: state.textSize,
        isVoiceEnabled: state.isVoiceEnabled,
        currentLang: state.currentLang
    }));
}

function loadPreferences() {
    const saved = localStorage.getItem('aiAssistantPrefs');
    if (saved) {
        const prefs = JSON.parse(saved);
        
        if (prefs.textSize) {
            state.textSize = prefs.textSize;
            elements.chatContainer.classList.add(`text-${state.textSize}`);
        }
        
        if (prefs.isVoiceEnabled !== undefined) {
            state.isVoiceEnabled = prefs.isVoiceEnabled;
            elements.voiceToggle.querySelector('.material-symbols-outlined').textContent = 
                prefs.isVoiceEnabled ? 'volume_up' : 'volume_off';
        }
        
        if (prefs.currentLang) {
            state.currentLang = prefs.currentLang;
            updateUILanguage();
            if (state.recognition) {
                state.recognition.lang = state.currentLang;
            }
        }
    }
}

// ==================== Initialize App ====================
document.addEventListener('DOMContentLoaded', init);
