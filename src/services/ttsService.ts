/**
 * TTS Service
 * 
 * 这是一个模拟的 TTS 服务。
 * 在实际生产环境中，您可以将此处的 window.speechSynthesis 替换为您的后端 TTS 接口调用。
 */

export const playTTS = (text: string, onEnd: () => void) => {
  stopTTS();

  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.95;
    
    utterance.onend = () => {
      onEnd();
    };
    
    utterance.onerror = (e) => {
      console.error('TTS Error:', e);
      onEnd();
    };

    window.speechSynthesis.speak(utterance);
  } else {
    const delay = Math.max(text.length * 200, 2000);
    setTimeout(onEnd, delay);
  }
};

export const stopTTS = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
