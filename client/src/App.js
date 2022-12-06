// import { useState, useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import Routes from './Routes';
import { ReactQueryDevtools } from 'react-query/devtools'
import { GlobalStyle } from './styles/GlobalStyle';
import {SocketContext, socket} from './socketio';
import { useEffect } from 'react';

function App() {

  useEffect(()=>{
        socket.on('connect', (data) => { // 메세지 수신
            console.log(data);
        })
        socket.on("disconnect", (data) => {
            console.log(data);
        });
        return () => socket.disconnect();
  },[])

  return (
    <SocketContext.Provider value={socket}>
      <RecoilRoot>
        <GlobalStyle />
        <Routes />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </RecoilRoot>
    </SocketContext.Provider>
    
  );
}

export default App;