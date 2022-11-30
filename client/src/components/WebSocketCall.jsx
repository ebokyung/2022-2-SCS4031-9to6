import { useEffect, useState } from "react";
import styled from 'styled-components';

const Container = styled.section`
    width: 50%;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    padding-top: 40px;;
`


export default function WebSocketCall({ socket }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleText = (e) => {
    const inputMessage = e.target.value;
    setMessage(inputMessage);
  };

  const handleSubmit = () => {
    if (!message) {
      return;
    }
    socket.emit("message", message);
    setMessage("");
  };

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages([...messages, data.data]);
      console.log(messages);
    });
  }, [socket, messages]);

  return (

    <Container>
        <div>
      <h2>WebSocket Communication</h2>
      <input type="text" value={message} onChange={handleText} />
      <button onClick={handleSubmit}>submit</button>
      <ul>
        {messages.map((message, ind) => {
          return <li key={ind}>{message}</li>
        })}
      </ul>
    </div>
    </Container>

    
  );
}