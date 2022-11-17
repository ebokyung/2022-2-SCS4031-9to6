import styled from 'styled-components';
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faStar } from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.body`
    width: 100%;
    min-height: 400px;
    display: flex;
    justify-content: center;
`


function ReportList({posts}) {

    return (
        <Wrapper>
            <Container>
                <Title>총 누적 제보개수: {posts.length}</Title>
                <Box>
                    <InnerBox>
                        <FirstLine>
                            {posts?.filter(prev => posts.indexOf(prev) % 3 === 0).map(i => 
                                <Item key={i.id}> 
                                    <ItemTop>
                                        <div>{i.Index}</div>  
                                        <div>{i.Datetime}</div>
                                    </ItemTop>
                                    <ItemImg src={i.ImageURL} />
                                    <ItemAddr>{i.Address}</ItemAddr>
                                    <ItemBody>{i.Content}</ItemBody>
                            </Item>)}
                        </FirstLine>
                        <SecondLine>
                            {posts?.filter(prev => posts.indexOf(prev) % 3 === 1).map(i => 
                                <Item key={i.id}>
                                    <ItemTop>
                                        <div>{i.Index}</div>  
                                        <div>{i.Datetime}</div>
                                    </ItemTop>
                                    <ItemImg src={i.ImageURL} />
                                    <ItemAddr>{i.Address}</ItemAddr>
                                    <ItemBody>{i.Content}</ItemBody>
                            </Item>)}
                        </SecondLine>
                        <ThirdLine>
                            {posts?.filter(prev => posts.indexOf(prev) % 3 === 2).map(i => 
                                <Item key={i.id}>
                                    <ItemTop>
                                        <div>{i.Index}</div>  
                                        <div>{i.Datetime}</div>
                                    </ItemTop>
                                    <ItemImg src={i.ImageURL} />
                                    <ItemAddr>{i.Address}</ItemAddr>
                                    <ItemBody>{i.Content}</ItemBody>
                            </Item>)}
                        </ThirdLine>
                    </InnerBox>
                </Box>
            </Container>    
        </Wrapper>
    )
    
  }
  
  export default ReportList;


const Container = styled.section`
    width: 100%;
    margin-top: 40px;
    display: flex;
    flex-direction: column;
`
const Title = styled.div`
    font-size: 20px;
    padding-left: 2%;
`

const Box = styled.div`
    width: 100%;
    height: fit-content;
    padding: 2% 0;
    margin-bottom: 200px;
`

const InnerBox = styled(motion.div)`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
`

const FirstLine = styled(motion.div)`
    
`

const SecondLine = styled(motion.div)`
    
`

const ThirdLine = styled(motion.div)`
    
`

const Item = styled(motion.div)`
    background-color: orange;
    padding: 6%;
    margin-left: 4%;
    margin-right: 4%;
    margin-bottom: 30px;
    border-radius: 10px;
    height: inherit;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
`

const ItemTop = styled.div`
    color : white;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    width:100%;
`
const ItemBody = styled.p`
    color : white;
    line-height: 1.5;
    font-size: 14px;
`
const ItemImg = styled.img`
    height: 150px;
    margin-bottom: 10px;
`

const ItemAddr = styled(ItemBody)`
    font-size: 11px;
    margin-bottom: 10px;
`


const ItemFooter = styled.div`
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 600;
    color : ${props => props.theme.itemFooterColor};
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    span{
        font-size: 13px;
    }
`