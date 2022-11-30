import styled from 'styled-components';
import PageSubtitle from '../PageSubtitle';

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
`

const Circle = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #FFA000;
`

const test = [
    {
      "Count" : 12,
      "Region" : "서울 강남구 역삼동",
    },
    {
      "Count" : 10,
      "Region" : "서울 강남구 서초동",
    },
    {
      "Count" : 9,
      "Region" : "서울 동작구 대방동",
    },
]

function ReportTopRegion() {
    return (
        <Wrapper>
            <PageSubtitle subtitle={'침수가 많은 CCTV장소'}/>
            <Container>
                {test.map((i, index)=> (
                    <Box key={`rank-${index}`}>
                        <Circle> {i.Region} </Circle>
                    </Box>
                ))}
            </Container>
        </Wrapper>
    )


}

export default ReportTopRegion;