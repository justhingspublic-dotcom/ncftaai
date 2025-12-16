# 宜蘭傳藝園區 AI 導覽助理

一個現代化的大螢幕觸控互動介面（Kiosk UI），專為宜蘭傳藝園區設計的語音導覽系統。

## ✨ 特色功能

### 🎯 核心功能
- **語音互動** - 主要透過語音操作，無需鍵盤輸入
- **輸入模式切換** - 工具列可啟用打字備援，麥克風受限時一樣能提問
- **大麥克風按鈕** - 直徑 180px 的圓形麥克風，帶有呼吸光暈與波紋動畫
- **AI 助手頭像** - 可愛的動態頭像，會眨眼、微笑
- **智能卡片** - 6 大主題卡片（展覽、購票、交通、表演、餐飲、設施）
- **即時語音辨識** - 使用瀏覽器原生 Web Speech API
- **語音回覆** - 支援文字轉語音播報

### 🎨 視覺設計
- **傳藝主題配色**
  - 傳藝紅：#B54B32
  - 金棕：#D6B581
  - 米白背景：#FAF7F2
- **日式溫潤 × 現代扁平風格**
- **柔和漸層背景**
- **紙質紋理質感**
- **玻璃擬態效果** (Glassmorphism)

### 🌓 深淺模式
- 支援深色與淺色主題切換
- 顏色自動適配，保持視覺舒適

### 🌐 多語言支援
- 繁體中文（預設）/ English
- 介面文本、語音辨識與播報會同步切換語言

### 📱 響應式設計
- 大螢幕觸控優化（推薦 1920×1080）
- 平板適配（768px - 1200px）
- 手機支援（< 768px）

## 🎬 動畫效果

1. **麥克風呼吸動畫** - 2 秒循環的光暈擴散
2. **波紋效果** - 語音辨識時的圓形波紋
3. **卡片懸浮** - Hover 時上浮與陰影增強
4. **頭像浮動** - 3 秒循環的上下浮動
5. **眨眼動畫** - 每 4 秒眨一次眼
6. **淡入淡出** - 頁面切換的平滑過渡

## 🚀 使用方式

### 直接開啟
1. 將所有檔案放在同一資料夾
2. 用瀏覽器開啟 `index.html`
3. 允許麥克風權限
4. 開始使用！

### 建議瀏覽器
- ✅ Chrome / Edge（推薦）
- ✅ Safari
- ⚠️ Firefox（部分語音功能可能受限）

### 操作說明
1. **點擊麥克風按鈕** 或直接說話
2. **說出問題**，例如「展覽資訊」、「交通方式」
3. **查看 AI 回覆**與建議選項
4. **點擊卡片**了解更多詳情
5. **需要打字時**，點擊右上角「鍵盤」圖示可解鎖文字輸入

## 📂 檔案結構

```
傳藝UI/
├── index.html      # 主頁面結構
├── styles.css      # 所有樣式與動畫
├── script.js       # 互動邏輯與語音處理
└── README.md       # 專案說明
```

## 🛠 技術架構

- **HTML5** - 語意化標籤
- **CSS3** - CSS Variables、Flexbox、Grid、Animations
- **Vanilla JavaScript** - 無框架依賴
- **Web Speech API** - 語音辨識與合成
- **Local Storage** - 保存使用者偏好設定

## 🎯 設計理念

> 「用一顆麥克風取代所有輸入框，讓人敢按、敢講、敢用。」

- ✅ 乾淨直覺的介面
- ✅ 親切有溫度的設計
- ✅ 文化元素融入現代科技
- ✅ 無障礙友善設計

## 🔧 自訂設定

### 修改顏色主題
編輯 `styles.css` 中的 CSS Variables：

```css
:root {
    --primary-color: #B54B32;    /* 主色 */
    --secondary-color: #D6B581;  /* 次要色 */
    --background-color: #FAF7F2; /* 背景色 */
}
```

### 新增卡片項目
在 `index.html` 的 `.cards-container` 中新增：

```html
<div class="card" data-action="your-action">
    <span class="material-symbols-outlined card-icon">icon_name</span>
    <h3 class="card-title">標題</h3>
    <p class="card-subtitle">點擊了解更多</p>
</div>
```

並在 `script.js` 的 `contentData` 中新增對應內容。

### 調整自動返回時間
修改 `script.js` 中的 `resetInactivityTimer` 函式：

```javascript
inactivityTimer = setTimeout(() => {
    returnHome();
}, 60000); // 改為你想要的毫秒數
```

## 📱 Kiosk 模式部署

### 全螢幕模式
按 `F11` 進入全螢幕（Windows/Linux）
或 `Command + Control + F`（macOS）

### Chrome Kiosk 模式
```bash
chrome --kiosk --app=file:///path/to/index.html
```

### 停用手勢與右鍵
在 `index.html` 的 `<body>` 加入：

```html
<body ontouchstart="event.preventDefault()" oncontextmenu="return false;">
```

## 🎨 Icon 來源

使用 Google Material Symbols (Outlined 風格)
- 線上 CDN：已整合於專案
- 更多圖示：https://fonts.google.com/icons

## 📝 授權

本專案為展示用途，可自由使用與修改。

## 💡 未來擴充建議

- [ ] 串接真實 AI 語言模型（如 OpenAI GPT）
- [ ] 後端 API 整合即時園區資訊
- [ ] 多點觸控手勢支援
- [ ] QR Code 掃描功能
- [ ] 遊客互動數據分析
- [ ] 更多語言支援（日文、韓文等）

---

**設計理念**：現代 × 文化 × 溫度  
**技術實現**：簡潔 × 高效 × 無障礙

