import React, { useState, useEffect, useRef } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "こんにちは！ご質問をどうぞ。" }
  ]);
  const [input, setInput] = useState("");
  const [qaList, setQaList] = useState([]);

  const bottomRef = useRef(null); // ⬅ 自動スクロール用

  // 質問リストをスプレッドシートから取得
  useEffect(() => {
    fetch("https://opensheet.vercel.app/1-YEeRmOk0bSfD_Q5tA58zm4cw_u05RTm6eotdRrhUnM/qa_list")
      .then((res) => res.json())
      .then((data) => setQaList(data));
  }, []);

  // メッセージが増えたときに一番下へスクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getBotReply = (text) => {
    for (const qa of qaList) {
      const keywords = qa.keyword.split(",");
      for (const word of keywords) {
        if (text.includes(word.trim())) {
          return qa.answer;
        }
      }
    }
    return "ごめんなさい、それはまだわからないです。";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    const botMessage = { sender: "bot", text: getBotReply(input) };
    setMessages([...messages, userMessage, botMessage]);
    setInput("");
  };

  const styles = {
    container: {
      backgroundColor: "#f1f5f9",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px"
    },
    chatBox: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "600px"
    },
    chatWindow: {
      height: "300px",
      overflowY: "auto",
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "10px",
      backgroundColor: "#fafafa"
    },
    message: (sender) => ({
      textAlign: sender === "bot" ? "left" : "right",
      marginBottom: "10px"
    }),
    bubble: (sender) => ({
      display: "inline-block",
      padding: "10px 16px",
      borderRadius: "20px",
      backgroundColor: sender === "bot" ? "#e2e8f0" : "#3182ce",
      color: sender === "bot" ? "#333" : "#fff",
      maxWidth: "80%",
      wordWrap: "break-word"
    }),
    inputRow: {
      display: "flex",
      marginTop: "15px"
    },
    input: {
      flexGrow: 1,
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      marginRight: "10px"
    },
    button: {
      padding: "12px 20px",
      borderRadius: "8px",
      backgroundColor: "#3182ce",
      color: "#fff",
      border: "none",
      cursor: "pointer"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <h2 style={{ marginBottom: 10 }}>マニュアル検索くん</h2>
        <div style={styles.chatWindow}>
          {messages.map((msg, i) => (
            <div key={i} style={styles.message(msg.sender)}>
              <span
                style={styles.bubble(msg.sender)}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            </div>
          ))}
          <div ref={bottomRef} /> {/* 自動スクロールのマーカー */}
        </div>
        <div style={styles.inputRow}>
          <input
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="質問を入力してください"
          />
          <button style={styles.button} onClick={handleSend}>
            送信
          </button>
        </div>
      </div>
    </div>
  );
}
