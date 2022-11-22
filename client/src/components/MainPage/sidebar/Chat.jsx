import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useEffect, useState, useRef } from "react";

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

const test = [
  {
      id : 1,
      who: false,
      user: '익명1',
      body : "지금 비가 너무 많이 와서 강남역 근처에 차들이 못 빠져 나가고 있어요 ㅠㅠㅠ",
      time : "오전 5 : 05" 
  },
  {
      id : 2,
      who: false,
      user: '익명2',
      body : "대방역 너무 심각해요... 이쪽으로 오지 마세요!!",
      time : "오전 5 : 05" 
  },
  {
      id : 3,
      who: true,
      user: '나',
      body : "강남역 하수구 막혀서 역류중이에요.. 조심하세요ㅠㅠ  ",
  },
  {
      id : 4,
      who: false,
      user: '익명4',
      body : "다른 동네는 괜찮은가요 ? 비가 많이 오네요 ...",
      time : "오전 5 : 03" 
  },
  {
      id : 5,
      who: true,
      user: '나',
      body : "저번처럼 피해가 크면 안될텐데 ... ",
      time : "오전 5 : 02" 
  },
  {
      id : 6,
      who: false,
      user: '익명6',
      body : "채팅창 테스트 중 입니다.채팅창 테스트 중 입니다.채팅창 테스트 중 입니다.채팅창 테스트 중 입니다.",
      time : "오전 4 : 58" 
  },
  {
      id : 7,
      who: false,
      user: '익명7',
      body : "채팅창 테스트 중 입니다.채팅창 테스트 중 입니다.채팅창 테스트 중 입니다.",
      time : "오전 4 : 58" 
  },
  {
      id : 8,
      who: false,
      user: '익명8',
      body : "채팅창 테스트 중 입니다.",
      time : "오전 4 : 58" 
  },
]

function Notice() {
    const [chatlist, setChatlist] = useState(test);
    /*스크롤 ...
    const scrollRef = useRef();

    const scrollToBottom = () => {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }

    useEffect(()=>{
      scrollToBottom()
      console.log(chatlist);
    },[chatlist])
    */

    // 채팅 전송
    const { register, handleSubmit, setValue } = useForm()
    const onValid = (data) => {
        // api 연결 ...
        let now = new Date();
        const result = {
          id : chatlist.length+1,
          who: true,
          user: '나',
          body : data.chat,
          time : `${now.getHours()} : ${now.getMinutes()}`,
        }
        console.log(result);
        setChatlist(prev=>[...prev, result])
        setValue("chat", "")
    }

    // 침수 단계 변화시 채팅방 온오프 ... api 연결 ...

    return (
      <Wrapper>
        <Container>

          {/* 채팅내용 */}
          <Chat>
              <ChatWrapper>
                <ChatInfo>
                    <span>침수 경보 발생 시 채팅방이 열립니다.</span>
                    <span>‘서울  강남구’ 침수 경보 발생으로 열린 채팅방입니다.</span>
                </ChatInfo>

                  {chatlist.map(i => <>
                      {i.who ? 
                      /* 내 채팅 */
                      <ChatItem key={i.id}>
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
                      <ChatItem key={i.id}>
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
                      }
                  </>)}

                  <ChatInfo>
                    <span>‘서울  강남구’ 침수 경보가 해지되었습니다.</span>
                    <span>10초 후에 채팅방이 닫힙니다.</span>
                  </ChatInfo>
                  <ChatInfo>
                    <span>침수 경보 발생시 채팅방이 열립니다.</span>
                  </ChatInfo>

              </ChatWrapper>
          </Chat>

          {/* 채팅 입력창 */}
          <ChatInputSection>
              <ChatInputForm onSubmit={handleSubmit(onValid)}>
                  <ChatInputInput {...register("chat", {required : true})} placeholder="전송할 메세지를 입력해주세요"/>
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