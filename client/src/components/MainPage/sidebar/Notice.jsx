import styled from 'styled-components';
import {SocketContext} from '../../../socketio';
import { useEffect, useState, useContext } from "react";
import {API} from '../../../axios';

function Notice() {

    const socket = useContext(SocketContext);
    const [ log, setLog ] = useState([]);
    const today = new Date();
    const year = today.getFullYear();
    const month = ("0" + (1 + today.getMonth())).slice(-2);
    const date = ("0" + today.getDate()).slice(-2);
    const todayFull = `${year}-${month}-${date}`;
    // console.log(todayFull);


    const getData = async () => {
      //침수이력 get요청
      try{
        const data = await API.get(`/FloodHistories`);
        // console.log(data.data);
        const filterData = data.data.filter((i)=> ( i.Datetime.split('T')[0] === todayFull) );
        // console.log(filterData);
        setLog(filterData.slice(0).reverse());
      } catch(e) {
        console.log(e)
      }
    }

  useEffect(()=>{
      getData();
      socket.on("notification", (data) => {
        console.log(data);
        //침수이력 get요청 다시
        getData();
      });
  },[]);

    return (
      <Wrapper>
        <Container>
            {log && log.map( (item, index) => (
              <Box key={`notice-${index}`} state={item.StageChange}>
                <Items>
                  <ItemTitle>
                    <div>
                      <span>{item.StageChange}</span>
                      <span>  {`(${item.FloodStage}단계)`}</span>
                    </div>
                    <div>{item.Datetime.split('T')[1]}</div>
                  </ItemTitle>
                  {/* <ItemAddr>{item.addr}</ItemAddr> */}
                  <ItemAddr>{item.CCTVName}</ItemAddr>
                </Items>
                
              </Box>
            ))}
        </Container>
      </Wrapper>
    )
  }
  
  export default Notice;


const Wrapper = styled.body`
width: 90%;
height: 100vh;
margin: auto;
overflow-y: hidden;
padding-bottom: 66px;
`

const Container = styled.section`
width: 100%;
overflow-y: auto;
height: 100%;
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

const Box = styled.div`
width: 98%;
height: 100px;
border-radius: 5px;
background-color: ${props => props.state === '침수 해제' || props.state === '단계 하향'? '#FFD95B' : '#FFA000' };
margin-bottom: 4%;
`
const Items = styled.div`
width:100%;
height:100%;
padding: 20px;
display: flex;
flex-direction: column;
`

const ItemTitle = styled.div`
display:flex;
justify-content: space-between;
margin-bottom: 20px;
:first-child{
font-size: 1rem
}
`

const ItemAddr = styled.h4``
