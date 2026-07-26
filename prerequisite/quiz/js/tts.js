// 文本朗读封装
const TTS = {
  current: null,

  isSupported() {
    return 'speechSynthesis' in window;
  },

  speak(text, lang) {
    if (!this.isSupported()) return;
    this.stop();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'en' ? 'en-US' : 'zh-CN';
    u.rate = 0.9;
    u.pitch = 1;
    this.current = u;
    speechSynthesis.speak(u);
  },

  stop() {
    if (!this.isSupported()) return;
    speechSynthesis.cancel();
    this.current = null;
  }
};
