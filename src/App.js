// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

function ChatApp() {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dots, setDots] = useState("");
  const [personalDatabase, setPersonalDatabase] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setDots("");
    }
  }, [loading]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/plain") {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const text = fileReader.result;
        console.log("Uploaded file contents:", text);
        setPersonalDatabase(text || "");
        setFileName(file.name);
      };
      fileReader.readAsText(file);
    } else {
      alert("Please upload a valid .txt file.");
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    const writerPrompt = 
`Act as a personalized content-writing assistant. Your role is to respond to queries by rephrasing existing user-provided content with minimal changes or by providing an answer template filled with placeholders if information is missing. Do not create or assume any new details. Follow these instructions precisely:

1. **Use only existing user-provided content**: Work exclusively with information from the user's database. Do not invent, assume, or add any details with generic or hypothetical content. If no relevant information is available, respond with a template containing placeholders.

2. **Provide a template with placeholders if content is missing**: When there is limited user content, construct a response template with placeholders using the format _____ {specific placeholder} _____. Here are examples for various query types:

   - **Question**: "Describe your most impactful project."
     - **Template**: "The most impactful project I’ve worked on was _____ {describe project} _____. Its main goal was _____ {state purpose or goal} _____, and it allowed me to _____ {mention skills or experiences} _____."

   - **Question**: "What are your strengths and weaknesses?"
     - **Template**: "Strengths: _____ {specific strength} _____, _____ {another specific strength} _____; Weaknesses: _____ {specific weakness} _____, _____ {another specific weakness} _____."

   - **Question**: "Why are you interested in this position?"
     - **Template**: "I am interested in this position because _____ {reason for interest in role} _____. This role aligns with my goals in _____ {specific area or field} _____ and will allow me to _____ {state how it benefits or excites you} _____."

3. **Minimize placeholders as more user content becomes available**: If there is relevant content for parts of a response, replace placeholders with exact sentences or phrases from the user’s database. Only use placeholders for sections with insufficient user information.

4. **Aim to eliminate placeholders with sufficient user content**: If there is enough user-provided content to fully address the query, generate a response entirely from the existing material. Arrange the sentences in a logical flow, making only minor adjustments for clarity.

5. **Avoid explanations or conversational responses**: Do not apologize, ask for content, or make conversational remarks. Simply provide a structured response that directly addresses the query.

6. **Direct response only**: Reply solely with rephrased content or an answer template with placeholders, with no additional comments or explanations.

Here is the user's input question/topic: ${input}

User's personal database: ${personalDatabase}`;

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [...messages, { role: "user", content: writerPrompt }],
        }),
      });

      const data = await response.json();

      console.log("API Response:", data);

      const botMessageContent = data.choices?.[0]?.message?.content || `Error: ${data.error?.message || "Unknown error"}`;
      const botMessage = { role: "assistant", content: botMessageContent };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: "Error: Failed to fetch response." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  const renderResponse = (message) => {
    const parts = message.content.split(/_____\s*\{([^}]+)\}\s*_____/);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <textarea
            key={index}
            placeholder={part.trim()}
            className="response-textarea"
            rows="1"
          />
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>
          <h1>ReVerb AI</h1>
          <i><h4>The content writing assistance that learns <b>from</b> you, to write <b>for</b> you...</h4></i>
        </div>
        <button onClick={handleClearChat} className="clear-chat">Clear Chat</button>
        <label htmlFor="file-upload" className="file-upload-label">Upload .txt</label>
        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          id="file-upload"
          className="file-upload"
        />
        {fileName && <p className="file-name">Uploaded file: {fileName}</p>}
      </div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.role === "assistant" ? renderResponse(msg) : msg.content}
          </div>
        ))}
        {loading && (
          <div className="message assistant loading">
            Typing{dots}
          </div>
        )}
      </div>
      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Shift+Enter for new line)"
          rows="2"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatApp;
