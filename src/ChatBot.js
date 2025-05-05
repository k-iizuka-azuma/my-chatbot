import { useState, useEffect } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "こんにちは！ご質問をどうぞ。" }
  ]);
  const [input, setInput] = useState("");
  const [qaList, setQaList] = useState([]);

  // スプレッドシートからデータを読み込む
  useEffect(() => {
    fetch("https://opensheet.vercel.app/1-YEeRmOk0bSfD_Q5tA58zm4cw_u05RTm6eotdRrhUnM/qa_list")
      .then((res) => res.json())
      .then((data) => setQaList(data));
  }, []);

  // 質問に対応する答えを返す
  const getBotReply = (text) => {
    for (const qa of qaList) {
      const keywords = qa.keyword.split(","); // カンマで分割
      for (const word of keywords) {
        if (text.includes(word.trim())) {
          return qa.answer;
        }
      }
    }
    return "ごめんね、それはまだわからないよ。";
  };
  

  // 送信処理
  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    const botMessage = { sender: "bot", text: getBotReply(input) };
    setMessages([...messages, userMessage, botMessage]);
    setInput("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>社内チャットボット</h2>
      <div style={{ height: 300, overflowY: "scroll", border: "1px solid #ccc", padding: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === "bot" ? "left" : "right" }}>
            <p>
              <strong>{msg.sender === "bot" ? "ボット" : "あなた"}：</strong>
              {msg.sender === "bot" ? (
                <span dangerouslySetInnerHTML={{ __html: msg.text }} />
              ) : (
                msg.text
              )}
            </p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="質問を入力してね"
          style={{ width: "80%", padding: 10 }}
        />
        <button onClick={handleSend} style={{ padding: 10 }}>送信</button>
      </div>
    </div>
  );
}
