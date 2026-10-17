
import { useState } from "react";
import {
  Bot,
  Droplets,
  Activity,
  ShieldAlert,
  ChartNoAxesCombined,
  Send,
  Sparkles,
  User,
} from "lucide-react";

const suggestions = [
  {
    icon: Droplets,
    title: "Water usage",
    question: "How much water have I used today?",
  },
  {
    icon: Activity,
    title: "Flow analysis",
    question: "Is my current flow rate unusual?",
  },
  {
    icon: ShieldAlert,
    title: "Leak prevention",
    question: "What signs may indicate a water leak?",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Reading summary",
    question: "Explain my recent water readings.",
  },
];

function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  function askQuestion(value = question) {
    const text = value.trim();
    if (!text) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text },
      {
        role: "assistant",
        text:
          "Your question has been received. Live data analysis is not connected yet. The next step is to connect this assistant to the AquaSense readings API so it can answer using your actual water data.",
      },
    ]);

    setQuestion("");
  }

  return (
    <section className="ai-page">
      <div className="ai-page-header">
        <div className="ai-page-icon">
          <Bot size={28} />
        </div>
        <div>
          <p className="ai-eyebrow">AQUASENSE INTELLIGENCE</p>
          <h1>AI Assistant</h1>
          <p>
            Understand your water usage and monitor unusual flow patterns.
          </p>
        </div>
      </div>

      <div className="ai-chat-card">
        <div className="ai-welcome">
          <div className="ai-bot-avatar">
            <Sparkles size={23} />
          </div>
          <h2>How can I help you today?</h2>
          <p>
            Choose a suggested question or ask about your water monitoring
            system.
          </p>
        </div>

        {messages.length === 0 && (
          <div className="ai-suggestions">
            {suggestions.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  type="button"
                  className="ai-suggestion"
                  key={item.title}
                  onClick={() => askQuestion(item.question)}
                >
                  <Icon size={21} />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.question}</small>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {messages.length > 0 && (
          <div className="ai-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`ai-message ${message.role}`}
              >
                <div className="ai-message-avatar">
                  {message.role === "assistant" ? (
                    <Bot size={17} />
                  ) : (
                    <User size={17} />
                  )}
                </div>
                <p>{message.text}</p>
              </div>
            ))}
          </div>
        )}

        <form
          className="ai-input-form"
          onSubmit={(event) => {
            event.preventDefault();
            askQuestion();
          }}
        >
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask about your water system..."
            aria-label="Ask AquaSense Assistant"
          />
          <button
            type="submit"
            disabled={!question.trim()}
            aria-label="Send question"
          >
            <Send size={19} />
          </button>
        </form>

        <p className="ai-disclaimer">
          Answers are not connected to live readings yet. Leak warnings
          require evidence and should not be treated as confirmed diagnoses.
        </p>
      </div>
    </section>
  );
}

export default AIAssistant;
