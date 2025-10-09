// ==================== State Management ====================
const state = {
    isListening: false,
    textSize: 'small', // 'small', 'medium', 'large'
    isVoiceEnabled: true,
    currentLang: 'zh-TW',
    isSpeechSupported: true,
    hasShownSpeechFallback: false,
    isTypingEnabled: false,
    recognition: null,
    finalTranscript: '', // 保存已確定的語音識別結果
    overlayHideTimeout: null,
    overlayTranscript: '',
    silenceTimeout: null, // 無語音計時器
    hasRecognizedText: false // 是否已經辨識到文字
};

// ==================== DOM Elements ====================
const elements = {
    chatContainer: document.getElementById('chatContainer'),
    messageInput: document.getElementById('messageInput'),
    voiceButton: document.getElementById('voiceButton'),
    suggestionCards: document.getElementById('suggestionCards'),
    textSizeToggle: document.getElementById('textSizeToggle'),
    voiceToggle: document.getElementById('voiceToggle'),
    typingToggle: document.getElementById('typingToggle'),
    langToggle: document.getElementById('langToggle'),
    scrollToBottomBtn: document.getElementById('scrollToBottomBtn'),
    infoButton: document.getElementById('infoButton'),
    infoButtonText: document.getElementById('infoButtonText'),
    welcomeMessage: document.getElementById('welcomeMessage'),
    languageModal: document.getElementById('languageModal'),
    clearChatBtn: document.getElementById('clearChatBtn'),
    speechOverlay: document.getElementById('speechOverlay'),
    speechOverlayText: document.getElementById('speechOverlayText'),
    speechOverlaySend: document.getElementById('speechOverlaySend')
};

// ==================== Language Icons ====================
const languageIcons = {
    'zh-TW': '中',
    'en': 'A',
    'ja': 'あ',
    'ko': '한'
};

// ==================== Speech Recognition Language Codes ====================
const speechRecognitionLangCodes = {
    'zh-TW': 'zh-TW',
    'en': 'en-US',
    'ja': 'ja-JP',
    'ko': 'ko-KR'
};

// ==================== Category Configuration ====================
const categoryConfig = [
    {
        id: 'exhibitions',
        image: '展覽.png',
        options: ['renovation', 'craftsman', 'scholar']
    },
    {
        id: 'visit',
        image: '參觀資訊.png',
        options: ['tickets', 'traffic', 'facilities']
    },
    {
        id: 'performance',
        image: '表演.png',
        options: ['performance1', 'performance2', 'performance3']
    }
];

// ==================== UI Text ====================
const uiText = {
    'zh-TW': {
        welcome: '歡迎來到宜蘭傳藝園區！我可以協助您了解展覽資訊、交通方式、當期表演等內容。',
        infoButton: '園區資訊',
        infoButtonTitle: '顯示建議',
        inputPlaceholder: {
            idle: '語音辨識內容將顯示於此',
            listening: '說出您的問題',
            typing: '請輸入您的問題'
        },
        clarifyPrompt: '請清楚說出您的問題',
        speechUnsupported: '您的瀏覽器不支援語音辨識功能',
        speechFallbackNotice: '偵測不到語音辨識功能，已自動切換為打字模式。',
        overlaySendTitle: '送出語音內容',
        typingToggle: {
            enable: '開啟打字',
            disable: '關閉打字'
        },
        header: {
            voiceToggle: '語音開關',
            textSizeToggle: '文字大小',
            langToggle: '語言切換',
            clearChat: '清空對話'
        },
        categories: {
            exhibitions: { title: '展覽訊息', imageAlt: '展覽' },
            visit: { title: '參觀資訊', imageAlt: '參觀資訊' },
            performance: { title: '當期演出', imageAlt: '表演' }
        },
        defaultResponse: '我可以協助您了解展覽資訊、交通方式、當期表演等內容，請選擇您想了解的項目。'
    },
    en: {
        welcome: 'Welcome to the National Center for Traditional Arts! I can help with exhibitions, transportation, performances, and more.',
        infoButton: 'Park Info',
        infoButtonTitle: 'Show suggestions',
        inputPlaceholder: {
            idle: 'Voice recognition will be displayed here',
            listening: 'Speak your question',
            typing: 'Type your question here'
        },
        clarifyPrompt: 'Please speak clearly',
        speechUnsupported: 'Your browser does not support speech recognition',
        speechFallbackNotice: 'Speech recognition is unavailable. Switched to typing mode automatically.',
        overlaySendTitle: 'Send recognized text',
        typingToggle: {
            enable: 'Enable typing',
            disable: 'Disable typing'
        },
        header: {
            voiceToggle: 'Voice toggle',
            textSizeToggle: 'Text size',
            langToggle: 'Switch language',
            clearChat: 'Clear chat'
        },
        categories: {
            exhibitions: { title: 'Exhibitions', imageAlt: 'Exhibitions' },
            visit: { title: 'Visitor Info', imageAlt: 'Visitor Information' },
            performance: { title: 'Performances', imageAlt: 'Performances' }
        },
        defaultResponse: 'I can guide you through exhibitions, transportation, performances, and more. Please choose a topic you are interested in.'
    },
    'ja': {
        welcome: '国立伝統芸術センターへようこそ！展覧会、交通、公演などについてご案内いたします。',
        infoButton: '園区情報',
        infoButtonTitle: '提案を表示',
        inputPlaceholder: {
            idle: '音声認識の内容がここに表示されます',
            listening: 'ご質問をお話しください',
            typing: 'ご質問を入力してください'
        },
        clarifyPrompt: 'はっきりとお話しください',
        speechUnsupported: 'お使いのブラウザは音声認識に対応していません',
        speechFallbackNotice: '音声認識が利用できません。入力モードに切り替えました。',
        overlaySendTitle: '認識したテキストを送信',
        typingToggle: {
            enable: '入力を有効',
            disable: '入力を無効'
        },
        header: {
            voiceToggle: '音声切替',
            textSizeToggle: '文字サイズ',
            langToggle: '言語切替',
            clearChat: 'チャットをクリア'
        },
        categories: {
            exhibitions: { title: '展覧会情報', imageAlt: '展覧会' },
            visit: { title: '参観情報', imageAlt: '参観情報' },
            performance: { title: '公演情報', imageAlt: '公演' }
        },
        defaultResponse: '展覧会、交通、公演などについてご案内いたします。興味のある項目をお選びください。'
    },
    'ko': {
        welcome: '국립전통예술센터에 오신 것을 환영합니다! 전시, 교통, 공연 등에 대해 안내해 드리겠습니다.',
        infoButton: '원구정보',
        infoButtonTitle: '제안 표시',
        inputPlaceholder: {
            idle: '음성 인식 내용이 여기에 표시됩니다',
            listening: '질문을 말씀해 주세요',
            typing: '질문을 입력해 주세요'
        },
        clarifyPrompt: '명확하게 말씀해 주세요',
        speechUnsupported: '브라우저가 음성 인식을 지원하지 않습니다',
        speechFallbackNotice: '음성 인식을 사용할 수 없어 입력 모드로 전환했습니다.',
        overlaySendTitle: '인식된 문장 보내기',
        typingToggle: {
            enable: '입력 활성화',
            disable: '입력 비활성화'
        },
        header: {
            voiceToggle: '음성 전환',
            textSizeToggle: '글자 크기',
            langToggle: '언어 전환',
            clearChat: '대화 지우기'
        },
        categories: {
            exhibitions: { title: '전시 정보', imageAlt: '전시' },
            visit: { title: '관람 정보', imageAlt: '관람 정보' },
            performance: { title: '공연 정보', imageAlt: '공연' }
        },
        defaultResponse: '전시, 교통, 공연 등에 대해 안내해 드립니다. 관심 있는 항목을 선택해 주세요.'
    }
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
    },
    'ja': {
        tickets: {
            title: 'チケット・地図',
            response: '一般券150元、優待券120元。現地購入またはオンライン予約可能。電子チケットで迅速入園。地図はサービスセンターで入手できます。'
        },
        traffic: {
            title: '交通情報',
            response: '国道バスまたは台鉄で羅東駅まで行き、621、621Aバスに乗り換えて直接園区へ。車の場合は「宜蘭伝統芸術園区」でナビ設定。駐車場完備。'
        },
        facilities: {
            title: '施設時間',
            response: '園区開放時間：毎日9:00-18:00。各展示館と施設の開放時間は異なる場合があります。詳細はサービスセンターまで。'
        },
        performance1: {
            title: '斉天大聖鬧龍宮',
            response: '伝統演劇と現代舞台技術を組み合わせた園区の名作で、孫悟空が龍宮で大暴れする物語を見事に演出。上演時間は当期プログラムをご参照ください。'
        },
        performance2: {
            title: '後継者舞台',
            response: '新世代の演者を育成し、伝統技芸の継承と革新を披露。週末定期公演を行っています。'
        },
        performance3: {
            title: '台湾太鼓朝の鐘',
            response: '園区の朝の儀式公演で、伝統の太鼓で一日の幕開けを飾り、伝統芸術の荘厳さと活力を示します。'
        },
        renovation: {
            title: '建築修復計画',
            response: '園区内の歴史的価値のある伝統建築の保存と修復に取り組み、文化遺産の持続可能な継承を目指しています。'
        },
        craftsman: {
            title: '小さな職人展',
            response: '食べ物をテーマに、伝統工芸技法を組み合わせ、台湾の飲食文化と工芸美学の完璧な融合を表現。'
        },
        scholar: {
            title: '挙人の力',
            response: '科挙制度と伝統文人文化を紹介する展覧会。文物とインタラクティブ展示を通じて、古代の読書人の奮闘の歴史を理解できます。'
        }
    },
    'ko': {
        tickets: {
            title: '티켓 및 지도',
            response: '일반권 150원, 우대권 120원. 현장 구매 또는 온라인 예약 가능. 전자 티켓으로 빠른 입장. 지도는 서비스 센터에서 받으실 수 있습니다.'
        },
        traffic: {
            title: '교통 정보',
            response: '국도 버스 또는 대만철도로 뤄둥역까지 가서 621, 621A 버스로 환승하여 원구까지 직접 이동. 자차로 오시는 경우 "이란전통예술원구"로 내비게이션 설정. 주차장 완비.'
        },
        facilities: {
            title: '시설 시간',
            response: '원구 개방 시간: 매일 9:00-18:00. 각 전시관과 시설의 개방 시간은 다를 수 있습니다. 자세한 내용은 서비스 센터에 문의하세요.'
        },
        performance1: {
            title: '제천대성요용궁',
            response: '전통 연극과 현대 무대 기술을 결합한 원구의 대표 공연으로, 손오공이 용궁에서 난동을 피우는 이야기를 훌륭하게 연출. 공연 시간은 당기 프로그램을 참조하세요.'
        },
        performance2: {
            title: '후계자 무대',
            response: '신세대 공연자를 육성하고 전통 기예의 계승과 혁신을 선보입니다. 주말 정기 공연 진행.'
        },
        performance3: {
            title: '대만북 아침 종',
            response: '원구의 아침 의식 공연으로, 전통 북으로 하루의 시작을 알리며 전통 예술의 장엄함과 활력을 보여줍니다.'
        },
        renovation: {
            title: '건축 복원 계획',
            response: '원구 내 역사적 가치가 있는 전통 건축의 보존과 복원에 전념하여 문화 유산의 지속 가능한 계승을 도모합니다.'
        },
        craftsman: {
            title: '작은 장인 전시',
            response: '음식을 주제로 전통 공예 기법을 결합하여 대만 음식 문화와 공예 미학의 완벽한 융합을 표현합니다.'
        },
        scholar: {
            title: '거인의 힘',
            response: '과거제도와 전통 문인 문화를 소개하는 전시회. 문물과 인터랙티브 전시를 통해 고대 독서인의 분투 역사를 이해할 수 있습니다.'
        }
    }
};

// ==================== Category Rendering ====================
function attachOptionButtonListener(button) {
    button.onclick = () => {
        const action = button.dataset.action;
        const content = contentData[state.currentLang][action];
        if (content) {
            handleCardClick(content.title, content.response);
        }
    };
}

function createCategoryCard(category, lang) {
    const categoryText = uiText[lang].categories[category.id];
    const card = document.createElement('div');
    card.className = 'category-card';
    card.dataset.category = category.id;

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'card-image';
    imageWrapper.style.background = '#C94A47';

    const image = document.createElement('img');
    image.src = category.image;
    image.alt = categoryText.imageAlt;
    image.className = 'card-image-icon';
    imageWrapper.appendChild(image);

    const title = document.createElement('h3');
    title.className = 'card-category-title';
    title.textContent = categoryText.title;

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'card-options';

    category.options.forEach(action => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.dataset.action = action;
        button.textContent = contentData[lang][action].title;
        attachOptionButtonListener(button);
        optionsContainer.appendChild(button);
    });

    card.appendChild(imageWrapper);
    card.appendChild(title);
    card.appendChild(optionsContainer);

    return card;
}

function populateCategoryCards(container, lang = state.currentLang) {
    if (!container) {
        return;
    }

    const existingCards = new Map();
    container.querySelectorAll('.category-card').forEach(card => {
        if (card.dataset.category) {
            existingCards.set(card.dataset.category, card);
        }
    });

    const configIds = new Set();

    categoryConfig.forEach(category => {
        configIds.add(category.id);
        let card = existingCards.get(category.id);

        if (!card) {
            card = createCategoryCard(category, lang);
            container.appendChild(card);
            return;
        }

        const categoryText = uiText[lang].categories[category.id];

        const title = card.querySelector('.card-category-title');
        if (title) {
            title.textContent = categoryText.title;
        }

        const image = card.querySelector('.card-image img');
        if (image) {
            image.alt = categoryText.imageAlt;
            image.src = category.image;
        }

        let optionsContainer = card.querySelector('.card-options');
        if (!optionsContainer) {
            optionsContainer = document.createElement('div');
            optionsContainer.className = 'card-options';
            card.appendChild(optionsContainer);
        }

        category.options.forEach((action, index) => {
            let button = optionsContainer.children[index];
            if (!button) {
                button = document.createElement('button');
                button.className = 'option-btn';
                optionsContainer.appendChild(button);
            }
            button.dataset.action = action;
            button.textContent = contentData[lang][action].title;
            attachOptionButtonListener(button);
        });

        while (optionsContainer.children.length > category.options.length) {
            optionsContainer.lastElementChild.remove();
        }

        container.appendChild(card);
    });

    existingCards.forEach((card, id) => {
        if (!configIds.has(id)) {
            card.remove();
        }
    });
}

function getPlaceholderKey() {
    if (state.isListening) {
        return 'listening';
    }
    if (state.isTypingEnabled) {
        return 'typing';
    }
    return 'idle';
}

function applyMessagePlaceholder() {
    const placeholders = uiText[state.currentLang].inputPlaceholder;
    elements.messageInput.placeholder = placeholders[getPlaceholderKey()];
}

function setTemporaryPlaceholder(mode) {
    const placeholders = uiText[state.currentLang].inputPlaceholder;
    elements.messageInput.placeholder = placeholders[mode] || placeholders.idle;
}

function updateVoiceButtonAppearance() {
    const icon = elements.voiceButton.querySelector('.material-symbols-outlined');
    if (!icon) {
        return;
    }

    if (!state.isSpeechSupported || state.isTypingEnabled) {
        const hasText = elements.messageInput.value.trim().length > 0;
        elements.voiceButton.classList.add('typing-mode');
        elements.voiceButton.classList.toggle('listening', hasText);
        icon.textContent = hasText ? 'arrow_upward' : 'keyboard';
        return;
    }

    // 麥克風模式：只有「麥克風」和「停止」兩種狀態
    elements.voiceButton.classList.remove('typing-mode');
    if (state.isListening) {
        elements.voiceButton.classList.add('listening');
        icon.textContent = 'stop';
    } else {
        elements.voiceButton.classList.remove('listening');
        icon.textContent = 'mic';
    }
}

function clearOverlayHideTimeout() {
    if (state.overlayHideTimeout) {
        clearTimeout(state.overlayHideTimeout);
        state.overlayHideTimeout = null;
    }
}

function clearSilenceTimeout() {
    if (state.silenceTimeout) {
        console.log('清除靜音計時器');
        clearTimeout(state.silenceTimeout);
        state.silenceTimeout = null;
    }
}

function startSilenceTimeout() {
    clearSilenceTimeout();
    // 只在還沒辨識到文字且正在聆聽時啟動計時器
    if (state.isListening && !state.hasRecognizedText) {
        console.log('啟動10秒無語音計時器');
        state.silenceTimeout = setTimeout(() => {
            console.log('10秒無語音，自動停止聆聽');
            stopListening();
        }, 10000);
    } else {
        console.log('不啟動計時器 - isListening:', state.isListening, 'hasRecognizedText:', state.hasRecognizedText);
    }
}

function getListeningPromptText() {
    return uiText[state.currentLang].inputPlaceholder.listening;
}

function updateSpeechOverlay(text) {
    if (!elements.speechOverlay || !elements.speechOverlayText) {
        return;
    }
    
    const displayText = text && text.trim() ? text : getListeningPromptText();
    const isPlaceholder = displayText === getListeningPromptText();
    
    clearOverlayHideTimeout();
    elements.speechOverlayText.textContent = displayText;
    state.overlayTranscript = displayText;
    
    // 添加或移除 placeholder class
    elements.speechOverlayText.classList.toggle('speech-overlay-placeholder', isPlaceholder);
    
    if (elements.speechOverlaySend) {
        const trimmed = displayText.trim();
        const ready = trimmed.length > 0 && !isPlaceholder;
        elements.speechOverlaySend.disabled = !ready;
        elements.speechOverlaySend.classList.toggle('listening', ready);
    }
    
    if (elements.speechOverlay.classList.contains('hidden')) {
        elements.speechOverlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            elements.speechOverlay.classList.add('speech-overlay-active');
        });
    } else {
        elements.speechOverlay.classList.add('speech-overlay-active');
    }
}

function hideSpeechOverlay({ immediate = false, delay = 600 } = {}) {
    if (!elements.speechOverlay) {
        return;
    }
    
    if (elements.speechOverlay.classList.contains('hidden') && !elements.speechOverlay.classList.contains('speech-overlay-active')) {
        return;
    }
    
    const performHide = () => {
        elements.speechOverlay.classList.remove('speech-overlay-active');
        state.overlayHideTimeout = setTimeout(() => {
            elements.speechOverlay.classList.add('hidden');
            elements.speechOverlayText.textContent = '';
            state.overlayTranscript = '';
            if (elements.speechOverlaySend) {
                elements.speechOverlaySend.disabled = true;
                elements.speechOverlaySend.classList.remove('listening');
            }
            state.overlayHideTimeout = null;
        }, 220);
    };
    
    clearOverlayHideTimeout();
    
    if (immediate) {
        elements.speechOverlay.classList.remove('speech-overlay-active');
        elements.speechOverlay.classList.add('hidden');
        elements.speechOverlayText.textContent = '';
        state.overlayTranscript = '';
        if (elements.speechOverlaySend) {
            elements.speechOverlaySend.disabled = true;
            elements.speechOverlaySend.classList.remove('listening');
        }
        return;
    }
    
    state.overlayHideTimeout = setTimeout(performHide, Math.max(delay, 0));
}

function submitOverlayTranscript() {
    const text = (state.overlayTranscript || '').trim();
    if (!text) {
        return;
    }
    
    if (state.recognition) {
        try {
            state.recognition.stop();
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
    }
    
    state.isListening = false;
    state.finalTranscript = '';
    hideSpeechOverlay({ immediate: true });
    applyMessagePlaceholder();
    updateVoiceButtonAppearance();
    
    handleSpeechResult(text);
    elements.messageInput.value = '';
}

// ==================== Initialization ====================
function init() {
    populateCategoryCards(elements.suggestionCards, state.currentLang);
    setupEventListeners();
    setupSpeechRecognition();
    loadPreferences();
    updateUILanguage();
    updateVoiceButtonAppearance();
    if (elements.speechOverlaySend) {
        elements.speechOverlaySend.disabled = true;
        elements.speechOverlaySend.classList.remove('listening');
    }
    
    // 確保語音列表已載入（某些瀏覽器需要等待）
    if ('speechSynthesis' in window) {
        speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            speechSynthesis.getVoices();
        };
    }
}

// ==================== Event Listeners ====================
function setupEventListeners() {
    // Voice / send button
    elements.voiceButton.addEventListener('click', handleVoiceButtonClick);
    
    // Text size toggle
    elements.textSizeToggle.addEventListener('click', toggleTextSize);
    
    // Voice toggle
    elements.voiceToggle.addEventListener('click', toggleVoiceEnabled);
    
    // Typing toggle
    elements.typingToggle.addEventListener('click', toggleTypingMode);
    
    // Language toggle - open modal
    elements.langToggle.addEventListener('click', openLanguageModal);
    
    // Language modal close on outside click
    elements.languageModal.addEventListener('click', (e) => {
        if (e.target === elements.languageModal) {
            closeLanguageModal();
        }
    });
    
    // Language option clicks
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.dataset.lang;
            selectLanguage(lang);
            closeLanguageModal();
        });
    });
    
    // Clear chat button
    elements.clearChatBtn.addEventListener('click', clearChat);
    
    // Scroll to bottom button
    elements.scrollToBottomBtn.addEventListener('click', () => {
        scrollToBottom();
    });
    
    // Info button - add suggestion cards to chat
    elements.infoButton.addEventListener('click', () => {
        addSuggestionCardsToChat();
    });
    
    if (elements.speechOverlaySend) {
        elements.speechOverlaySend.addEventListener('click', submitOverlayTranscript);
    }
    
    // Manual input events
    elements.messageInput.addEventListener('input', () => {
        if (state.isTypingEnabled) {
            updateVoiceButtonAppearance();
        }
    });
    
    elements.messageInput.addEventListener('keydown', (event) => {
        if (state.isTypingEnabled && event.key === 'Enter') {
            event.preventDefault();
            sendTypedMessage();
        }
    });
    
    // Scroll event listener
    window.addEventListener('scroll', handleScroll);
}

// ==================== Speech Recognition ====================
function setupSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('Speech recognition not supported in this browser.');
        handleSpeechRecognitionUnavailable(true);
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    state.recognition = new SpeechRecognition();
    state.isSpeechSupported = true;
    state.hasShownSpeechFallback = false;
    
    if (elements.typingToggle) {
        elements.typingToggle.disabled = false;
        elements.typingToggle.classList.remove('header-btn-disabled');
    }
    
    state.recognition.lang = speechRecognitionLangCodes[state.currentLang] || state.currentLang;
    state.recognition.continuous = true;
    state.recognition.interimResults = true;
    
    state.recognition.onstart = () => {
        console.log('Speech recognition started');
        setTemporaryPlaceholder('listening');
        // 不在這裡清空文字，因為這可能是自動重啟
        updateVoiceButtonAppearance();
        // 只在沒有文字時更新 overlay
        if (!state.hasRecognizedText) {
            updateSpeechOverlay(getListeningPromptText());
        }
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
        updateVoiceButtonAppearance();
        updateSpeechOverlay(fullText);
        
        // 一旦有辨識到文字，標記為已辨識並清除靜音計時器（不再自動停止）
        if (fullText.trim().length > 0) {
            if (!state.hasRecognizedText) {
                console.log('辨識到文字，設置 hasRecognizedText = true，清除計時器');
                state.hasRecognizedText = true;
            }
            clearSilenceTimeout();
        }
    };
    
    state.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            handleSpeechRecognitionUnavailable(true);
            return;
        }
        
        if (event.error !== 'no-speech') {
            stopListening();
            elements.messageInput.placeholder = uiText[state.currentLang].clarifyPrompt;
            setTimeout(() => {
                applyMessagePlaceholder();
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

function handleSpeechRecognitionUnavailable(showNotice = false) {
    hideSpeechOverlay({ immediate: true });
    state.isSpeechSupported = false;
    state.recognition = null;
    
    if (!state.isTypingEnabled) {
        state.isTypingEnabled = true;
    }
    
    if (elements.typingToggle) {
        elements.typingToggle.disabled = true;
        elements.typingToggle.classList.add('header-btn-disabled');
    }
    
    applyTypingModeState({ preserveValue: true });
    updateVoiceButtonAppearance();
    
    if (showNotice && !state.hasShownSpeechFallback && uiText[state.currentLang]) {
        state.hasShownSpeechFallback = true;
        addAssistantMessage(uiText[state.currentLang].speechFallbackNotice, false);
    }
    
    savePreferences();
}

// ==================== Listening Control ====================
function toggleListening() {
    if (state.isListening) {
        stopListening();
    } else {
        startListening();
    }
}

function handleVoiceButtonClick() {
    if (!state.isSpeechSupported) {
        if (!state.isTypingEnabled) {
            state.isTypingEnabled = true;
            applyTypingModeState({ preserveValue: true });
        }
        sendTypedMessage();
        return;
    }
    
    if (state.isTypingEnabled) {
        sendTypedMessage();
    } else {
        // 麥克風模式：只負責開始/停止錄音
        toggleListening();
    }
}

function toggleTypingMode() {
    if (!state.isSpeechSupported && state.isTypingEnabled) {
        return;
    }
    
    state.isTypingEnabled = !state.isTypingEnabled;

    if (state.isTypingEnabled && state.isListening) {
        stopListening();
    }

    applyTypingModeState({
        focusInput: state.isTypingEnabled
    });

    savePreferences();
}

function applyTypingModeState({ focusInput = false, preserveValue = false } = {}) {
    elements.messageInput.readOnly = !state.isTypingEnabled;

    if (!state.isTypingEnabled && !preserveValue) {
        elements.messageInput.value = '';
        elements.messageInput.blur();
    } else if (state.isTypingEnabled && focusInput) {
        elements.messageInput.focus();
    }

    updateTypingToggleUI();
    applyMessagePlaceholder();
    updateVoiceButtonAppearance();
    
    if (!state.isListening) {
        hideSpeechOverlay({ immediate: true });
    }
}

function updateTypingToggleUI() {
    if (!elements.typingToggle) {
        return;
    }

    const icon = elements.typingToggle.querySelector('.material-symbols-outlined');
    const langText = uiText[state.currentLang].typingToggle;

    if (!state.isSpeechSupported) {
        elements.typingToggle.title = uiText[state.currentLang].speechUnsupported;
    } else {
        elements.typingToggle.title = state.isTypingEnabled ? langText.disable : langText.enable;
    }

    if (icon) {
        if (!state.isSpeechSupported) {
            icon.textContent = 'keyboard';
        } else {
            icon.textContent = state.isTypingEnabled ? 'mic' : 'keyboard';
        }
    }
}

function sendTypedMessage() {
    if (!state.isTypingEnabled) {
        return;
    }

    const text = elements.messageInput.value.trim();
    if (!text) {
        updateVoiceButtonAppearance();
        return;
    }

    handleSpeechResult(text);
    elements.messageInput.value = '';
    updateVoiceButtonAppearance();
    applyMessagePlaceholder();
}

function startListening() {
    if (!state.recognition) {
        alert(uiText[state.currentLang].speechUnsupported);
        return;
    }
    
    console.log('開始聆聽');
    state.isListening = true;
    state.hasRecognizedText = false; // 重置辨識狀態
    state.finalTranscript = ''; // 清空之前的文字
    elements.messageInput.value = '';
    setTemporaryPlaceholder('listening');
    updateVoiceButtonAppearance();
    updateSpeechOverlay(getListeningPromptText());
    
    // 啟動10秒無語音計時器（只在開始時啟動一次）
    startSilenceTimeout();
    
    try {
        state.recognition.start();
    } catch (error) {
        console.error('Error starting recognition:', error);
        stopListening();
    }
}

function stopListening() {
    console.log('停止聆聽');
    state.isListening = false;
    state.hasRecognizedText = false; // 重置辨識狀態
    applyMessagePlaceholder();
    
    // 清除靜音計時器
    clearSilenceTimeout();
    
    if (state.recognition) {
        try {
            state.recognition.stop();
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
    }
    
    // 使用淡出動畫隱藏對話框
    hideSpeechOverlay({ delay: 0 });
    
    // 不再自動送出，只是停止錄音
    // 清空保存的結果
    state.finalTranscript = '';
    elements.messageInput.value = '';
    updateVoiceButtonAppearance();
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
        },
        'ja': {
            'チケット': 'tickets',
            '地図': 'tickets',
            '料金': 'tickets',
            '交通': 'traffic',
            '施設': 'facilities',
            '時間': 'facilities',
            '斉天': 'performance1',
            '大聖': 'performance1',
            '龍宮': 'performance1',
            '後継': 'performance2',
            '舞台': 'performance2',
            '太鼓': 'performance3',
            '朝': 'performance3',
            '建築': 'renovation',
            '修復': 'renovation',
            '職人': 'craftsman',
            '工芸': 'craftsman',
            '挙人': 'scholar'
        },
        'ko': {
            '티켓': 'tickets',
            '지도': 'tickets',
            '요금': 'tickets',
            '교통': 'traffic',
            '시설': 'facilities',
            '시간': 'facilities',
            '제천': 'performance1',
            '대성': 'performance1',
            '용궁': 'performance1',
            '후계': 'performance2',
            '무대': 'performance2',
            '북': 'performance3',
            '아침': 'performance3',
            '건축': 'renovation',
            '복원': 'renovation',
            '장인': 'craftsman',
            '공예': 'craftsman',
            '거인': 'scholar'
        }
    };
    
    let matchedAction = null;
    const normalizedTranscript = state.currentLang === 'en'
        ? transcript.toLowerCase()
        : transcript;

    const currentKeywords = keywords[state.currentLang];
    
    for (const [keyword, action] of Object.entries(currentKeywords)) {
        if (normalizedTranscript.includes(keyword)) {
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
        const defaultMsg = uiText[state.currentLang].defaultResponse;
        setTimeout(() => {
            addAssistantMessage(defaultMsg, false);
        }, 300);
    }
    
    // Clear input after processing
    setTimeout(() => {
        elements.messageInput.value = '';
        updateVoiceButtonAppearance();
        applyMessagePlaceholder();
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

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    const avatarIcon = document.createElement('span');
    avatarIcon.className = 'material-symbols-outlined';
    avatarIcon.textContent = 'person';
    avatar.appendChild(avatarIcon);

    const content = document.createElement('div');
    content.className = 'message-content';
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble user-bubble';
    bubble.textContent = text;
    content.appendChild(bubble);

    messageGroup.appendChild(avatar);
    messageGroup.appendChild(content);

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
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'category-cards-container';
    cardsContainer.style.animation = 'fadeInUp 0.4s ease';
    populateCategoryCards(cardsContainer, state.currentLang);
    elements.chatContainer.appendChild(cardsContainer);
    
    scrollToBottom();
}

// ==================== Clear Chat ====================
function clearChat() {
    // 停止語音識別
    if (state.isListening) {
        stopListening();
    }
    
    // 清空輸入框
    elements.messageInput.value = '';
    state.finalTranscript = '';
    updateVoiceButtonAppearance();
    
    // 清空聊天容器並重新建立初始內容
    elements.chatContainer.innerHTML = '';
    
    // 重新添加歡迎消息
    const welcomeGroup = document.createElement('div');
    welcomeGroup.className = 'message-group assistant-group';
    welcomeGroup.innerHTML = `
        <div class="message-avatar">
            <img src="3c25cb87ae.png" alt="AI助理" class="avatar-img">
        </div>
        <div class="message-content">
            <div class="message-bubble assistant-bubble">
                <span id="welcomeMessage">${uiText[state.currentLang].welcome}</span>
            </div>
        </div>
    `;
    elements.chatContainer.appendChild(welcomeGroup);
    
    // 重新添加建議卡片
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'category-cards-container';
    cardsContainer.id = 'suggestionCards';
    populateCategoryCards(cardsContainer, state.currentLang);
    elements.chatContainer.appendChild(cardsContainer);
    
    // 更新 elements 引用
    elements.suggestionCards = document.getElementById('suggestionCards');
    elements.welcomeMessage = document.getElementById('welcomeMessage');
    
    // 滾動到頂部
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
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
function openLanguageModal() {
    elements.languageModal.classList.remove('hidden');
    updateLanguageModalSelection();
}

function closeLanguageModal() {
    elements.languageModal.classList.add('hidden');
}

function selectLanguage(lang) {
    state.currentLang = lang;
    
    // Update speech recognition language
    if (state.recognition) {
        state.recognition.lang = speechRecognitionLangCodes[lang] || lang;
    }
    
    // Update body class for font switching
    document.body.className = document.body.className.replace(/lang-\S+/g, '').trim();
    document.body.classList.add(`lang-${lang}`);
    
    // Update UI text
    updateUILanguage();
    updateLanguageButton();
    savePreferences();
}

function updateLanguageButton() {
    const langText = elements.langToggle.querySelector('.lang-text');
    if (langText) {
        langText.textContent = languageIcons[state.currentLang];
    }
}

function updateLanguageModalSelection() {
    const options = document.querySelectorAll('.language-option');
    options.forEach(option => {
        if (option.dataset.lang === state.currentLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

function updateUILanguage() {
    const langText = uiText[state.currentLang];
    
    if (elements.welcomeMessage) {
        elements.welcomeMessage.textContent = langText.welcome;
    }
    
    if (elements.infoButtonText) {
        elements.infoButtonText.textContent = langText.infoButton;
    }
    
    if (elements.infoButton) {
        elements.infoButton.title = langText.infoButtonTitle;
    }
    
    elements.voiceToggle.title = langText.header.voiceToggle;
    elements.textSizeToggle.title = langText.header.textSizeToggle;
    elements.langToggle.title = langText.header.langToggle;
    elements.clearChatBtn.title = langText.header.clearChat;
    if (elements.speechOverlaySend) {
        elements.speechOverlaySend.title = langText.overlaySendTitle;
    }
    updateTypingToggleUI();
    updateLanguageButton();
    
    applyMessagePlaceholder();
    
    if (elements.speechOverlay && !elements.speechOverlay.classList.contains('hidden') && state.isListening) {
        updateSpeechOverlay(getListeningPromptText());
    }
    
    const cardContainers = elements.chatContainer.querySelectorAll('.category-cards-container');
    cardContainers.forEach(container => {
        populateCategoryCards(container, state.currentLang);
    });
}

// ==================== Text-to-Speech ====================
function speakText(text) {
    if (!state.isVoiceEnabled || !('speechSynthesis' in window)) {
        return;
    }
    
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechRecognitionLangCodes[state.currentLang] || state.currentLang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // 獲取可用語音
    const voices = speechSynthesis.getVoices();
    const targetLang = speechRecognitionLangCodes[state.currentLang] || utterance.lang;
    
    // 多平台高品質語音優先名單
    const preferredVoiceNames = {
        'zh-TW': [
            'Mei-Jia', 'Sin-Ji', 'Ting-Ting', 'Yu-shu',              // Apple
            'Google 國語（臺灣）', 'Chinese (Taiwan)',                // Google
            'Hanhan', 'Zhiwei', 'Microsoft Hanhan', 'Microsoft Zhiwei' // Microsoft
        ],
        'en-US': [
            'Samantha', 'Alex', 'Ava', 'Zoe',                        // Apple
            'Google US English', 'Google English',                    // Google
            'David', 'Zira', 'Mark', 'Microsoft David', 'Microsoft Zira' // Microsoft
        ],
        'ja-JP': [
            'Kyoko', 'Otoya', 'Hattori',                             // Apple
            'Google 日本語', 'Japanese (Japan)',                      // Google
            'Haruka', 'Ichiro', 'Microsoft Haruka', 'Microsoft Ichiro' // Microsoft
        ],
        'ko-KR': [
            'Yuna', 'Sora',                                          // Apple
            'Google 한국의', 'Korean (South Korea)',                  // Google
            'Heami', 'Microsoft Heami'                               // Microsoft
        ]
    };
    
    let selectedVoice = null;
    
    // 1. 優先選擇各平台的高品質語音
    const preferredNames = preferredVoiceNames[targetLang] || [];
    for (const name of preferredNames) {
        selectedVoice = voices.find(voice => 
            (voice.name.includes(name) || voice.name === name) && 
            (voice.lang === targetLang || voice.lang.startsWith(targetLang.split('-')[0]))
        );
        if (selectedVoice) {
            console.log('✓ 使用高品質語音:', selectedVoice.name, '(', selectedVoice.lang, ')');
            break;
        }
    }
    
    // 2. 選擇本地高品質語音
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
            voice.lang === targetLang && 
            voice.localService &&
            (voice.name.includes('Premium') || voice.name.includes('Enhanced') || voice.name.includes('Natural'))
        );
        if (selectedVoice) {
            console.log('✓ 使用本地高品質語音:', selectedVoice.name);
        }
    }
    
    // 3. 選擇任何本地語音
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang === targetLang && voice.localService);
        if (selectedVoice) {
            console.log('使用本地語音:', selectedVoice.name);
        }
    }
    
    // 4. 選擇任何匹配的語音
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang === targetLang);
        if (selectedVoice) {
            console.log('使用語音:', selectedVoice.name);
        }
    }
    
    // 5. 選擇語言前綴匹配的語音
    if (!selectedVoice) {
        const langPrefix = targetLang.split('-')[0];
        selectedVoice = voices.find(voice => voice.lang.startsWith(langPrefix));
        if (selectedVoice) {
            console.log('使用相近語音:', selectedVoice.name);
        }
    }
    
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } else {
        console.warn('⚠ 未找到合適語音，使用系統預設');
    }
    
    speechSynthesis.speak(utterance);
}

// ==================== Preferences ====================
function savePreferences() {
    localStorage.setItem('aiAssistantPrefs', JSON.stringify({
        textSize: state.textSize,
        isVoiceEnabled: state.isVoiceEnabled,
        currentLang: state.currentLang,
        isTypingEnabled: state.isTypingEnabled
    }));
}

function loadPreferences() {
    const saved = localStorage.getItem('aiAssistantPrefs');
    if (!saved) {
        document.body.classList.add(`lang-${state.currentLang}`);
        applyTypingModeState({ preserveValue: true });
        return;
    }

    const prefs = JSON.parse(saved);

    if (prefs.currentLang) {
        state.currentLang = prefs.currentLang;
        if (state.recognition) {
            state.recognition.lang = speechRecognitionLangCodes[state.currentLang];
        }
        document.body.classList.add(`lang-${state.currentLang}`);
    }

    if (prefs.textSize) {
        state.textSize = prefs.textSize;
        elements.chatContainer.classList.remove('text-small', 'text-medium', 'text-large');
        elements.chatContainer.classList.add(`text-${state.textSize}`);
    }

    if (prefs.isVoiceEnabled !== undefined) {
        state.isVoiceEnabled = prefs.isVoiceEnabled;
        elements.voiceToggle.querySelector('.material-symbols-outlined').textContent = 
            prefs.isVoiceEnabled ? 'volume_up' : 'volume_off';
    }

    // Always start in voice mode (isTypingEnabled = false)
    state.isTypingEnabled = false;

    applyTypingModeState({ preserveValue: true });
}

// ==================== Initialize App ====================
document.addEventListener('DOMContentLoaded', init);
