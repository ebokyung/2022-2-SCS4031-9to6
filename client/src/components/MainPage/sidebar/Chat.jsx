import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useRef, useContext } from "react";
import {SocketContext} from '../../../socketio';

function Chat() {
    let me = null;
    const logCheck = localStorage.getItem("token") || sessionStorage.getItem("token");
    if(logCheck) {
        me = JSON.parse(sessionStorage.getItem("token")).ID;
    } else {
        me = '익명n';
    }

    const socket = useContext(SocketContext);
    const [ chat, setChat ] = useState([]);

    const { register, handleSubmit, setValue } = useForm()

    useEffect(()=>{
        // console.log(`enter socket: ${socket.id}`);
        socket.emit("join");
        socket.on("join", (data) => {
            setChat(data);
        });
        // return () => {
        //     socket.off("join", handleInviteAccepted);
        //  };
    },[socket]);

    useEffect(()=>{
        chat &&
        socket.on('message', (data)=>{
            // console.log(`message 렌더링: ${socket.id} ,받은data: ${data.length}, 기존data:${chat.length}`);
            // setChat([...chat, data]);
            setChat(data);
            // console.log(data);
        });
        scrollToBottom()
    },[socket, chat]);

    // 채팅 전송
    const onValid = (data) => {
        // let now = new Date();
        const result = {
          id : chat.length+2,
          user: me,
          body : data.msg,
          time : new Date(),
        }
        socket.emit("message", result);
        setValue('msg','');
    }
/*
    const dateTime = (date) => {
        const nowTime = new Date(date).toLocaleTimeString('en-Us', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        return nowTime;
    }
*/

   const renderChat = () => {
        console.log(`${socket.id}님의 채팅 렌더링 중`);
      return (
            chat.map((i, index) => (
                /* 관리자 채팅 */
                i.user === 'admin' ? (
                <ChatInfo key={index}>
                    <span>{i.body}</span>
                </ChatInfo> ) : ( 
                /* 내 채팅 */
                i.user === me ? 
                <ChatItem key={index}>
                    <ChatUser>
                        <span  style={{float: 'right'}}>{i.user}</span>
                    </ChatUser>
                    <ChatItemDiv style={{justifyContent:"flex-end"}}>
                    <ChatTime>{i.time}</ChatTime>
                    <ChatBodyM>
                        {i.body}
                    </ChatBodyM>
                    </ChatItemDiv>
                </ChatItem>
                :
                /* 상대방 채팅 */
                <ChatItem key={index}>
                    <ChatUser>
                        <span>{i.user}</span>  
                    </ChatUser>
                    <ChatItemDiv style={{justifyContent: "flex-start"}}>
                    <ChatBodyY>
                        {i.body}
                    </ChatBodyY>
                    <ChatTime>{i.time}</ChatTime>
                    </ChatItemDiv>
                </ChatItem>
            )
        )))
   }

    //스크롤 …
    const scrollRef = useRef();

    const scrollToBottom = () => {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start'});
    }

    return (
      <Wrapper>
        <Container>

          {/* 채팅내용 */}
          <ChatSection>
              <ChatWrapper>
                {chat.length > 0 && renderChat()}
                <div ref={scrollRef} />
              </ChatWrapper>
          </ChatSection>

          {/* 채팅 입력창 */}
          <ChatInputSection>
              <ChatInputForm onSubmit={handleSubmit(onValid)}>
                  <ChatInputInput {...register("msg", {required: true})} placeholder="전송할 메세지를 입력해주세요"/>
                  <ChatInputBtn>
                      전송
                  </ChatInputBtn>
              </ChatInputForm>
          </ChatInputSection>
          {/* <ChatInputSection>
              <ChatInputForm>
                  <ChatInputInput value={message} onChange={handleText} placeholder="전송할 메세지를 입력해주세요"/>
                  <ChatInputBtn onClick={handleSubmit}>
                      전송
                  </ChatInputBtn>
              </ChatInputForm>
          </ChatInputSection> */}
          
          {/* <div ref={scrollRef} /> */}

        </Container>
      </Wrapper>
    )
  }
  
  export default Chat;


const Wrapper = styled.body`
width: 100%;
height: 100vh;
margin: auto;
overflow-y: hidden;
padding-bottom: 56px;
`

const Container = styled.section`
width: 100%;
overflow-y: auto;
height: 100%;
display: flex;
justify-content: center;
flex-direction:column;
`

const ChatSection = styled.section`
width: 97%;
height: 86vh;
display: flex;
justify-content: center;
margin: auto;
`

const ChatWrapper = styled.div`
width : 100vw;
display: flex;
flex-direction: column;
overflow-y: scroll;
::-webkit-scrollbar {
    width: 10px;
}
::-webkit-scrollbar-thumb {
    background-color: #8f8f8fb9;
}
::-webkit-scrollbar-track {
    background-color: #35353566;
}
`

const ChatItem = styled.div`
width: 100%;
display: flex;
flex-direction: column;
margin-bottom: 10px;
`
const ChatItemDiv = styled.div`
display: flex;
align-items: flex-end;
font-size: 0.9rem;
`

const ChatUser = styled.div`
margin: 0 5px 5px 5px;
font-size: 12px;
font-weight: 600;
color : #A2A2A6;
`

const ChatTime = styled.span`
font-size: 12px;
font-weight: 600;
color : #A2A2A6;
`

const ChatBody = styled.div`
max-width: 70%;
line-height: 1.4;
border-radius: 10px;
padding: 15px;
box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
`
const ChatBodyM = styled(ChatBody)`
background-color: #FFD95B;
border-bottom-right-radius: 0px;
margin-left: 8px;
`

const ChatBodyY = styled(ChatBody)`
background-color: #BABABA;
border-bottom-left-radius: 0px;
margin-right: 8px;
`

//
const ChatInfo = styled.div`
margin-top: 30px;
margin-bottom: 30px;
display: flex;
flex-direction: column;
text-align: center;
font-size: 13px;
font-weight: 500;
color : #A2A2A6;
span{
    margin-bottom: 10px;
}
`

//
const ChatInputSection = styled.section`
width: inherit;
background-color: #FFD95B;
height: 60px;
display: flex;
justify-content: center;
align-items: center;
`

const ChatInputForm = styled.form`
width : 95%;
/* max-width: ${props => props.theme.maxWidth}; */
display: flex;
justify-content: space-between;
`

const ChatInputInput = styled.input`
width: 88%;
border: none;
padding: 7px 10px;
border-radius: 5px;
::placeholder {
    color: #A2A2A6;
}
:focus {
    outline-color: #FFD95B;
}
`

const ChatInputBtn = styled.button`
width: 10%;
color:white;
border: none;
border-radius: 5px;
background-color: #FFA726;
box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
cursor: pointer;
`