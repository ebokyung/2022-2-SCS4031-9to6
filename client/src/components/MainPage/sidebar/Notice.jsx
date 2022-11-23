import styled from 'styled-components';

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
  background-color: ${props => props.state === 'down' ? '#FFD95B' : '#FFA000' };
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

const test = [
  {
    id: 0,
    state: 'down',
    step: 0,
    time: '18:30',
    addr: '서울시 강남구 1085-1'
  },
  {
    id: 1,
    state: 'down',
    step: 0,
    time: '18:31',
    addr: '서울시 강남구 1085-1'
  },
  {
    id: 2,
    state: 'up',
    step: 3,
    time: '18:32',
    addr: '서울시 강남구 1085-1'
  },
  {
    id: 3,
    state: 'down',
    step: 0,
    time: '18:33',
    addr: '서울시 강남구 1085-1'
  },
  {
    id: 4,
    state: 'up',
    step: 3,
    time: '18:34',
    addr: '서울시 강남구 1085-1'
  },
  {
    id: 5,
    state: 'down',
    step: 0,
    time: '18:35',
    addr: '서울시 강남구 1085-1'
  },  
  {
    id: 6,
    state: 'up',
    step: 2,
    time: '18:36',
    addr: '서울시 강남구 1085-1'
  },
  {
    id: 7,
    state: 'down',
    step: 0,
    time: '18:37',
    addr: '서울시 강남구 1085-1'
  },  
  {
    id: 8,
    state: 'up',
    step: 3,
    time: '18:38',
    addr: '서울시 강남구 1085-1'
  },
  {
    id: 9,
    state: 'down',
    step: 0,
    time: '18:39',
    addr: '서울시 강남구 1085-1'
  },
]

function Notice() {
    return (
      <Wrapper>
        <Container>
            {test.map( (item) => (
              <Box key={item.id} state={item.state}>
                <Items>
                  <ItemTitle>
                    <div>
                      <span>{item.state === 'down' ? '침수 경보 해제' : '침수 경보'}</span>
                      <span>  ({item.step}단계)</span>
                    </div>
                    <div>{item.time}</div>
                  </ItemTitle>
                  <ItemAddr>{item.addr}</ItemAddr>
                </Items>
                
              </Box>
            ))}
        </Container>
      </Wrapper>
    )
  }
  
  export default Notice;