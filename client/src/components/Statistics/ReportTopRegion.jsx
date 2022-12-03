import styled from 'styled-components';
import PageSubtitle from '../PageSubtitle';
import { useState, useEffect } from 'react';
import { API } from '../../axios';

const Wrapper = styled.div`
    width: 100%;
    height: 350px;
    display: flex;
    flex-direction: column;
`
const Container = styled.div`
    width: 70%;
    height: 100%;
    margin: 4% auto;
    display: flex;
    justify-content: space-between;
`

const Box = styled.div`
    width: 14rem;
    height: 14rem;
    :nth-child(1){
        div {background: #C77800;}
    }
    :nth-child(2){
        div {background: #FFA726;}
    }
    :nth-child(3){
        div {background: #FFD95B;}
    }
`

const Circle = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: pre-line;
    text-align: center;
    font-size: 1.2rem;
`

function ReportTopRegion() {
    const [loading, setLoading] = useState(true);
    const [topRegion, setTopRegion] = useState([]);

    const getInfo = async( ) => {
        try{
            const data = await API.get(`/Data/Posting`);
            // console.log(data.data.slice(0,3));
            setTopRegion(data.data.slice(0,3));
            setLoading(false);
        }catch(error){
            console.log(error);
        }
    }
  
    useEffect(() => {
        getInfo();
    },[])

    return (
        <Wrapper>
            <PageSubtitle subtitle={'침수가 많은 CCTV장소'}/>
            <Container>
                {topRegion.map((i, index)=> (
                    <Box key={`rank-${index}`}>
                        <Circle> {`[ TOP ${index+1} ] \n\n ${i.Region} \n\n 총 ${i.Count}건`}</Circle>
                    </Box>
                ))}
            </Container>
        </Wrapper>
    )


}

export default ReportTopRegion;