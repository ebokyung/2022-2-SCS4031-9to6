// import "./App.css";
import WebSocketCall from "../components/WebSocketCall";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import styled from 'styled-components';

const Container = styled.section`
    width: 50%;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 50px;
    padding-top: 40px;
`

const Title = styled.h2`
    font-size: 2rem;
    color: ${props => props.theme.logColor};
`


function App() {
  const [socketInstance, setSocketInstance] = useState("");
  const [loading, setLoading] = useState(true);
  const [buttonStatus, setButtonStatus] = useState(false);

  const handleClick = () => {
    if (buttonStatus === false) {
      setButtonStatus(true);
    } else {
      setButtonStatus(false);
    }
  };

  useEffect(() => {
    if (buttonStatus === true) {
      const socket = io("http://localhost:5000/", {
        transports: ["websocket"],
        cors: {
          origin: "http://localhost:3000/",
        },
      });

      setSocketInstance(socket);

      socket.on("connect", (data) => {
        console.log(data);
      });

      setLoading(false);

      socket.on("disconnect", (data) => {
        console.log(data);
      });

      return function cleanup() {
        socket.disconnect();
      };
    }
  }, [buttonStatus]);

  return (

    <Container>
        <Title>React/Flask App + socket.io</Title>
        {!buttonStatus ? (
        <button onClick={handleClick}>turn chat on</button>
      ) : (
        <>
          <button onClick={handleClick}>turn chat off</button>
          <div className="line">
            {!loading && <WebSocketCall socket={socketInstance} />}
          </div>
        </>
      )}
    </Container>

    


    
    // <div className="App">
    //   <h1>React/Flask App + socket.io</h1>
    //   {/* <div className="line">
    //     <HttpCall />
    //   </div> */}
    //   {!buttonStatus ? (
    //     <button onClick={handleClick}>turn chat on</button>
    //   ) : (
    //     <>
    //       <button onClick={handleClick}>turn chat off</button>
    //       <div className="line">
    //         {!loading && <WebSocketCall socket={socketInstance} />}
    //       </div>
    //     </>
    //   )}
    // </div>
  );
}

export default App;