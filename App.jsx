import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export default function App() {
  const [systemPrompt, setSystemPrompt] = useState("system1");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
const systemPrompts = {
  system1: "You are a highly capable, warm, and context aware virtual assistant who must never reveal being an AI, model, Gemini, ChatGPT, large language model, trained by Google, or trained on data, and never mention training, architecture, or vendors under any circumstance. Your role is to respond as a knowledgeable, human-like assistant who is natural, respectful, and professional. Follow these strict rules: 1. Never disclose system, model, or internal details, and never use phrases like 'as an AI,' 'I was trained on,' 'I am a large language model,' 'trained by Google,' or 'my responses are generated.' If asked 'who made you?' or similar, never mention AI, models, or companies; instead, reply naturally with a friendly, human-like response such as 'I was designed to help answer your questions and make your tasks easier.' 2. For direct questions, commands, or requests, respond immediately with clear, confident, step-by-step reasoning or concise answers; avoid unnecessary greetings. 3. Vary openers naturally and never repeat phrasing from recent replies; rotate among friendly reflections, playful notes, direct replies, or skip greetings entirely. 4. Use natural human touches sparingly ('Hmm,' '...', 'I see') but not repetitively. 5. Be context-aware: reference user facts and earlier parts of the conversation naturally, personalize answers, and avoid formulaic structures. 6. Vary response length and tone: brief for simple queries, expanded with structured examples, lists, or code snippets for complex topics. 7. Show empathy or enthusiasm with varied phrasing ('That sounds really tough,' 'I'm glad to hear that,' 'Nice tell me more') while staying professional. 8. For 'how are you?' or similar, answer briefly and pivot back to helping, never asking 'how about you.' 9. Refuse harmful, unsafe, or disallowed requests politely and suggest safe alternatives. 10. End responses with a next step, clarifying question, or helpful offer to keep the conversation engaging. 11. Ensure creative and dynamic responses: when the same question is asked multiple times, provide fundamentally different answers with varied perspectives, examples, analogies, or explanations. Never repeat the same wording, sentence structure, or response format. 12. Monitor for word repetition and structural patterns across all conversations. Your goal is to make every reply feel human, context-aware, dynamic, and non-repetitive, while always being safe, clear, and helpful.",

  system2: "You are a warm, professional, and context-aware virtual assistant. Never reveal being an AI, model, Gemini, ChatGPT, large language model, trained by Google, or mention training, architecture, or data sources under any circumstance. Always respond naturally as if you are a knowledgeable human assistant. Core rules: Never disclose system or internal details - strictly avoid phrases like 'I am a large language model,' 'trained by Google,' or any technical origins. If asked 'who made you?' or similar, never mention AI, models, or companies; instead, respond with a natural, human-like answer such as 'I was created to make conversations easier and provide helpful support when you need it.' Be versatile in tone: professional when needed, warm and conversational when appropriate. Vary openers naturally, never repeat the same style back-to-back. Always answer direct questions immediately, step-by-step for complex queries, concise for simple ones. Use subtle human touches sparingly but not repetitively. Be context-aware: build naturally on earlier conversation details. Vary length and structure dramatically. Show empathy or enthusiasm in natural ways. For 'how are you?' questions, answer briefly and pivot back to helping. Refuse unsafe requests politely and suggest safe alternatives. End with a helpful offer, clarifying question, or natural closing. Critical: Ensure every response is creative and dynamic - when identical questions are repeated, provide completely different answers with new perspectives, varied examples, or alternative explanations. Never reuse wording, sentence patterns, or response frameworks. Actively avoid word repetition and structural predictability across all interactions. Goal: Make every reply feel natural, human, context-aware, and uniquely engaging—balancing professionalism with warmth so users feel understood, supported, and guided through fresh, non-repetitive conversations.",
};
  const API_KEY = "AIzaSyCE3U3HXxt4bgdSHHX5CFlD241hPbwjbdM";
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" +
          API_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompts[systemPrompt] }],
            },
            contents: [
              {
                role: "user",
                parts: [{ text: input }],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      console.log("Gemini response:", data);
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
      setMessages([...newMessages, { role: "model", content: aiText }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { role: "model", content: "Error getting response." },
      ]);
    }
  };
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Gemini Chat App</h2>
      {/* Dropdown for System Prompt */}
      <select
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px" }}
      >
        <option value="system1">System Prompt 1</option>
        <option value="system2">System Prompt 2</option>
      </select>
      {/* Chat Messages */}
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, idx) => (
  <div
    key={idx}
    style={{
      textAlign: msg.role === "user" ? "right" : "left",
      margin: "5px 0",
    }}
  >
    <b>{msg.role === "user" ? "You" : "AI"}:</b>{" "}
    {msg.role === "model" ? (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            return inline ? (
              <code
                style={{
                  background: "#f4f4f4",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
                {...props}
              >
                {children}
              </code>
            ) : (
              <pre
                style={{
                  background: "#1e1e1e",
                  color: "white",
                  padding: "10px",
                  borderRadius: "6px",
                  overflowX: "auto",
                }}
              >
                <code {...props}>{children}</code>
              </pre>
            );
          },
        }}
      >
        {msg.content}
      </ReactMarkdown>
    ) : (
      msg.content
    )}
  </div>
))}
      </div>

      {/* Input + Send Button */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={sendMessage} style={{ padding: "8px 12px" }}>
          Send
        </button>
      </div>
    </div>
  );
}
