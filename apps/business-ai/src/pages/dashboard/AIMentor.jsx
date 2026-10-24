import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { Bot, Send, Sparkles, ArrowLeft, User, Lightbulb, Mic, MicOff, Volume2, VolumeX, Radio, Trash2, Download } from 'lucide-react';

const INITIAL_MESSAGE = {
  sender: 'ai',
  text: 'Hello founder! 👋 I am your AI Business Mentor (Gemini & ChatGPT Voice Enabled).\n\nAsk me any question about government subsidies (PMEGP/MUDRA), supplier negotiation tactics, 0-to-100 customer acquisition, unit economics, or location due diligence!'
};

const PROMPT_SUGGESTIONS = [
  "Government Subsidies (PMEGP/MUDRA)",
  "Vendor Negotiation Tactics",
  "0 to 100 Customers Blueprint",
  "Unit Economics & Margin Audit",
  "Commercial Lease Due Diligence"
];

export default function AIMentor() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('business_finder_mentor_chat');
      return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
    } catch (e) {
      return [INITIAL_MESSAGE];
    }
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Voice & Speech Assistant States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);

  const messagesEndRef = useRef(null);

  // Save chat to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('business_finder_mentor_chat', JSON.stringify(messages));
    } catch (e) {}
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Load browser speech synthesis voices
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Text-To-Speech Function
  const speakText = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`]/g, '').slice(0, 400);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const preferredVoice = availableVoices.find(v =>
        (v.lang.includes('en-IN') || v.lang.includes('en-US') || v.lang.includes('en-GB')) &&
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Female'))
      ) || availableVoices[0];

      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech Synthesis error:", err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Speech-To-Text (Voice Recognition)
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please try Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    stopSpeaking();

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e);
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          triggerSend(transcript);
        }
      };

      recognition.start();
    } catch (err) {
      console.error("SpeechRecognition start error:", err);
      setIsListening(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput('');
    triggerSend(userText);
  };

  const triggerSend = async (userText) => {
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);
    stopSpeaking();

    let latestBiz = "General Business";
    let latestLoc = "India";
    try {
      const historyStr = localStorage.getItem('business_finder_history');
      if (historyStr) {
        const historyList = JSON.parse(historyStr);
        if (historyList && historyList.length > 0) {
          latestBiz = historyList[0].business || historyList[0].title || latestBiz;
          latestLoc = historyList[0].location || latestLoc;
        }
      }
    } catch (err) {}

    const response = await dashboardService.sendAIMentorMessage(userText, latestBiz, latestLoc);
    setLoading(false);
    
    const replyText = response.reply || "I am analyzing your business request.";
    setMessages((prev) => [...prev, { sender: 'ai', text: replyText }]);
    speakText(replyText);
  };

  const handleChipClick = (suggestion) => {
    setInput(suggestion);
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([INITIAL_MESSAGE]);
    localStorage.removeItem('business_finder_mentor_chat');
  };

  const exportChatTranscript = () => {
    const transcriptText = messages.map(m => `[${m.sender.toUpperCase()}]\n${m.text}\n`).join('\n---\n\n');
    const blob = new Blob([transcriptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AI_Mentor_Transcript_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 text-[#0f172a] dark:text-white font-sans antialiased text-left">
      
      {/* Header Banner - Mint Frosted Theme */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f0fdf4] dark:bg-[#0b1329] p-4 sm:p-5 rounded-3xl border border-[#bbf7d0] dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="w-10 h-10 rounded-full bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0f172a] dark:text-white border border-slate-200 dark:border-slate-700 transition cursor-pointer shadow-xs flex items-center justify-center shrink-0">
            <ArrowLeft size={16} />
          </Link>
          <div className="w-11 h-11 rounded-2xl bg-[#047857] shadow-md shadow-[#047857]/20 flex items-center justify-center text-white shrink-0">
            <Bot size={22} color="#ffffff" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-[#061c16] dark:text-white">BusinessAI Voice Mentor</h1>
              <span className="px-3 py-1 rounded-full bg-[#dcfce7] dark:bg-emerald-500/20 border border-[#86efac] dark:border-emerald-400/30 text-[#065f46] dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#059669] animate-ping" /> LIVE GEMINI AI VOICE
              </span>
            </div>
            <p className="text-xs text-[#334155] dark:text-slate-400 font-medium">ChatGPT &amp; Gemini AI real-time founder strategy assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Export Transcript */}
          <button
            onClick={exportChatTranscript}
            className="px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0f172a] dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Download Conversation Transcript"
          >
            <Download size={14} />
            <span>Export</span>
          </button>

          {/* Clear Chat */}
          <button
            onClick={clearChat}
            className="p-2.5 rounded-2xl bg-white hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 text-xs font-bold transition cursor-pointer shadow-xs"
            title="Reset Conversation"
          >
            <Trash2 size={15} />
          </button>

          {/* Voice Mute / Unmute Toggle */}
          <button
            onClick={() => {
              if (voiceEnabled) stopSpeaking();
              setVoiceEnabled(!voiceEnabled);
            }}
            style={voiceEnabled ? { backgroundColor: '#047857', color: '#ffffff' } : {}}
            className={`px-4 py-2 rounded-2xl border text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
              voiceEnabled
                ? 'bg-[#047857] text-white border-transparent shadow-[#047857]/20 hover:bg-[#065f46]'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
            }`}
            title={voiceEnabled ? "Mute Voice Playback" : "Enable Voice Playback"}
          >
            {voiceEnabled ? <Volume2 size={15} color="#ffffff" /> : <VolumeX size={15} />}
            <span>{voiceEnabled ? 'Voice ON' : 'Muted'}</span>
          </button>

          {/* Stop Speaking Button */}
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-3 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-black transition flex items-center gap-1 cursor-pointer animate-pulse"
            >
              Stop Audio
            </button>
          )}
        </div>
      </div>

      {/* Live Audio Soundwave Status Bar */}
      {(isListening || isSpeaking) && (
        <div className="p-3.5 rounded-2xl bg-[#dcfce7] border border-[#86efac] text-[#065f46] text-xs font-black flex items-center justify-between animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center gap-2">
            <Radio size={15} className="animate-pulse text-[#059669]" />
            <span>{isListening ? "Listening to your voice..." : "Gemini AI Voice speaking..."}</span>
          </div>
          <div className="flex items-end gap-1 h-4">
            <span className="w-1 bg-[#059669] h-2 animate-bounce" />
            <span className="w-1 bg-[#047857] h-4 animate-bounce [animation-delay:0.1s]" />
            <span className="w-1 bg-[#065f46] h-3 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1 bg-[#064e3b] h-4 animate-bounce [animation-delay:0.3s]" />
          </div>
        </div>
      )}

      {/* Main Chat Conversation Window - Mint Frosted Theme */}
      <div className="min-h-[460px] h-[calc(100vh-250px)] rounded-3xl bg-[#f0fdf4] dark:bg-[#0b1329] border border-[#bbf7d0] dark:border-slate-800 p-4 sm:p-6 flex flex-col justify-between shadow-sm transition-colors duration-200">
        
        <div className="overflow-y-auto space-y-4 pr-1 custom-scrollbar flex-1">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 text-xs sm:text-sm ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-9 h-9 rounded-2xl bg-[#047857] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot size={17} color="#ffffff" />
                </div>
              )}
              <div
                className={`p-4 sm:p-5 rounded-2xl max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#047857] text-white rounded-tr-none font-bold shadow-md shadow-[#047857]/20'
                    : 'bg-white dark:bg-slate-950 border border-[#bbf7d0] dark:border-slate-800 text-[#061c16] dark:text-slate-100 rounded-tl-none font-medium shadow-xs'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-2xl bg-[#061c16] dark:bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <User size={17} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-[#065f46] dark:text-emerald-400 text-xs py-2 font-bold">
              <div className="w-8 h-8 rounded-xl bg-[#dcfce7] border border-[#86efac] text-[#065f46] flex items-center justify-center">
                <Bot size={16} className="animate-spin" />
              </div>
              <span>Gemini AI Mentor is crafting personalized founder advice...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts & Chat Input */}
        <div className="pt-3 border-t border-[#bbf7d0] dark:border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[10px] font-black uppercase text-[#065f46] dark:text-slate-300 flex items-center gap-1 shrink-0">
              <Lightbulb size={13} className="text-amber-500" /> PROMPTS:
            </span>
            {PROMPT_SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(suggestion)}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-[#bbf7d0] dark:border-slate-800 text-[#061c16] dark:text-white text-[11px] font-bold whitespace-nowrap transition cursor-pointer shadow-xs"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSend} className="flex gap-2">
            {/* Microphone Speech Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              style={{
                backgroundColor: isListening ? '#fee2e2' : '#ffffff',
                color: isListening ? '#dc2626' : '#061c16',
                borderColor: isListening ? '#ef4444' : '#bbf7d0'
              }}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition border shrink-0 cursor-pointer shadow-xs ${
                isListening ? 'animate-pulse' : 'hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700'
              }`}
              title={isListening ? "Listening... Click to stop" : "Click to speak with AI Mentor"}
            >
              {isListening ? (
                <MicOff size={18} color="#dc2626" style={{ color: '#dc2626', stroke: '#dc2626' }} />
              ) : (
                <Mic size={18} color="#061c16" style={{ color: '#061c16', stroke: '#061c16' }} />
              )}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about subsidies, supplier negotiation, marketing, or unit economics..."
              className="flex-1 h-12 px-4 rounded-2xl bg-white dark:bg-slate-950 border border-[#bbf7d0] dark:border-slate-800 text-[#061c16] dark:text-white text-xs sm:text-sm font-semibold focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition placeholder:text-slate-400 shadow-xs"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{ backgroundColor: '#047857', color: '#ffffff' }}
              className="w-12 h-12 rounded-2xl bg-[#047857] hover:bg-[#065f46] disabled:opacity-50 text-white flex items-center justify-center shrink-0 transition shadow-md shadow-[#047857]/20 cursor-pointer border-0"
            >
              <Send size={17} color="#ffffff" style={{ color: '#ffffff', stroke: '#ffffff' }} />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
