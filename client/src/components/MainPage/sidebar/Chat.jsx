import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const test = [
    {
        id : 1,
        user: 'admin',
        body : "침수 경보 발생 시 채팅방이 열립니다.",
    },
    {
        id : 2,
        user: 'admin',
        body : "'서울  강남구’ 침수 경보 발생으로 열린 채팅방입니다.",
    },
  {
      id : 3,
      user: '익명1',
      body : "지금 비가 너무 많이 와서 강남역 근처에 차들이 못 빠져 나가고 있어요 ㅠㅠㅠ",
      time : "오전 5 : 05" 
  },
  {
      id : 4,
      user: '익명2',
      body : "대방역 너무 심각해요... 이쪽으로 오지 마세요!!",
      time : "오전 5 : 05" 
  },
  {
      id : 5,
      user: 'test1234',
      body : "강남역 하수구 막혀서 역류중이에요.. 조심하세요ㅠㅠ  ",
  },
  {
      id : 6,
      user: '익명4',
      body : "다른 동네는 괜찮은가요 ? 비가 많이 오네요 ...",
      time : "오전 5 : 03" 
  },
  {
      id : 7,
      user: 'test1234',
      body : "저번처럼 피해가 크면 안될텐데 ... ",
      time : "오전 5 : 02" 
  },
  {
      id : 8,
      user: '익명6',
      body : "채팅창 테스트 중 입니다.채팅창 테스트 중 입니다.채팅창 테스트 중 입니다.채팅창 테스트 중 입니다.",
      time : "오전 4 : 58" 
  },
  {
      id : 9,
      user: '익명7',
      body : "채팅창 테스트 중 입니다.채팅창 테스트 중 입니다.채팅창 테스트 중 입니다.",
      time : "오전 4 : 58" 
  },
  {
      id : 10,
      user: 'admin',
      body : "침수 경보 발생 시 채팅방이 열립니다.",
  },
]

function Notice() {
    let me = null;
    const logCheck = localStorage.getItem("token") || sessionStorage.getItem("token");
    if(logCheck) {
        me = JSON.parse(sessionStorage.getItem("token")).ID;
    } else {
        me = '익명n';
    }

    const { register, handleSubmit, setValue } = useForm()

	const [ chat, setChat ] = useState(test);
    const [arrivalChat, setArrivalChat] = useState(null);

	const socketRef = useRef()

    //socketRef.current = io.connect("http://54.180.141.7:5000", { transports: ["websocket"] } );
    socketRef.current = io.connect("http://localhost:5000/", { transports: ["websocket"] } );

    useEffect(() => {
    	arrivalChat && setChat((prev) => [...prev, arrivalChat]) // 채팅 리스트에 추가
    }, [arrivalChat]);
  
    useEffect(() => {
        socketRef.current.on('connect', (chatObj) => { // 메세지 수신
            const { result, errmsg } = chatObj;
            setArrivalChat(result);
        });
    //     return () => socketRef.current.disconnect()
    }, [socketRef])

	// useEffect(() => {
    //     socketRef.current = io.connect("http://54.180.141.7:5000")
    //     socketRef.current.on("message", (message) => {
    //         setChat([ ...chat, { message } ])
    //     })
    //     return () => socketRef.current.disconnect()
    // },[ chat ])
   
    // 채팅 전송
    const onValid = (data) => {
        let now = new Date();
        const result = {
          id : chat.length+1,
          user: me,
          body : data.msg,
          time : `${now.getHours()} : ${now.getMinutes()}`,
        }
        // console.log(result);
        setChat(prev=>[...prev, result])
		socketRef.current.emit("message", result)
		// e.preventDefault()
        setValue("msg", "")
    }


	const renderChat = () => {
		return chat.map((i, index) => (
                i.user === 'admin' ? (
                <ChatInfo>
                    <span>{i.body}</span>
                </ChatInfo> ) : ( 
                i.user === me ? 
                /* 내 채팅 */
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
        ))
	}

    /*스크롤 ...
    const scrollRef = useRef();

    const scrollToBottom = () => {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }

    useEffect(()=>{
      scrollToBottom()
      console.log(chatlist);
    },[chat])
    */

    return (
      <Wrapper>
        <Container>

          {/* 채팅내용 */}
          <Chat>
              <ChatWrapper>
                {renderChat()}
              </ChatWrapper>
          </Chat>

          {/* 채팅 입력창 */}
          <ChatInputSection>
              <ChatInputForm onSubmit={handleSubmit(onValid)}>
                  <ChatInputInput {...register("msg", {required : true})} placeholder="전송할 메세지를 입력해주세요"/>
                  <ChatInputBtn>
                      전송
                  </ChatInputBtn>
              </ChatInputForm>
          </ChatInputSection> 
          
          {/* <div ref={scrollRef} /> */}

        </Container>
      </Wrapper>
    )
  }
  
  export default Notice;


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

const Chat = styled.section`
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
