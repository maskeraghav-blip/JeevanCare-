import { useState, useRef, useEffect } from 'react';
import { api } from '../../context/AuthContext';
import './AIChatAssistant.css';

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hello! I am your **JeevanCare+ AI Care Assistant**, powered by local Ollama. Ask me anything about doctors, clinics, or hospitals in Hyderabad!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (e, textToSend = null) => {
    if (e) e.preventDefault();
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    if (!textToSend) setInput('');

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Map user message history
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      
      const res = await api.post('/search/ai-assist', {
        message: messageText,
        history: history
      });

      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Sorry, I could not process your request at this moment. Please check if the server is running.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickChips = [
    { label: '❤️ Cardiac Specialists', query: 'Find Cardiology doctors and cardiac surgery centers' },
    { label: '🏥 Government ICU Centers', query: 'Which government hospitals have ICU and Emergency?' },
    { label: '🦴 Physiotherapist in Bengaluru', query: 'Find a physiotherapist in Bengaluru' },
  ];

  return (
    <div className="ai-assistant-wrapper no-print">
      {/* Floating Toggle Button */}
      <button className="ai-toggle-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle AI assistant">
        <span className="ai-btn-icon">{isOpen ? '❌' : '🤖'}</span>
        {!isOpen && <span className="ai-btn-label">AI Health Guide</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window glass-card">
          <div className="ai-chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className="ai-header-icon">🤖</span>
              <div>
                <h4 className="ai-header-title">JeevanCare+ AI Guide</h4>
                <span className="ai-header-status">Ollama LLM Assistant</span>
              </div>
            </div>
            <button className="ai-close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="ai-messages-container">
            {messages.map((m, idx) => (
              <div key={idx} className={`ai-message-row ${m.role === 'user' ? 'user-row' : 'bot-row'}`}>
                <div className="ai-message-bubble">
                  {/* Basic markdown renderer helper */}
                  <div className="ai-message-content" style={{ whiteSpace: 'pre-line' }}>
                    {m.content}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="ai-message-row bot-row">
                <div className="ai-message-bubble ai-loading-bubble">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips if conversation is starting */}
          {messages.length === 1 && (
            <div className="ai-quick-chips">
              {quickChips.map(chip => (
                <button key={chip.label} className="ai-chip" onClick={(e) => handleSend(e, chip.query)}>
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSend} className="ai-chat-input-form">
            <input
              type="text"
              className="ai-chat-input"
              placeholder="Ask about doctors, symptoms, map centers..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary ai-send-btn" disabled={loading || !input.trim()}>
              ➡️
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
