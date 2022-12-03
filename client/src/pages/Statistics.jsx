import styled from 'styled-components';
import PageHeader from '../components/PageHeader';
import FloodHistories from '../components/Statistics/FloodHistories';
import FloodHistoriesChart from '../components/Statistics/FloodHistoriesChart';
import ReportTopRegion from '../components/Statistics/ReportTopRegion';

const Wrapper = styled.body`
    width: 100vw;
    display: flex;
    justify-content: center;
    margin: ${props => props.theme.navMarginTop} 0;
`

const Container = styled.section`
    width : ${props => props.theme.width};
    max-width: ${props => props.theme.maxWidth};
    min-height: ${props => props.theme.minHeight};
`

function Statistics () {
    return(
    <Wrapper>
        <Container>
            <PageHeader title={'데이터 분석'} />
            <FloodHistories />
            <FloodHistoriesChart />
            <ReportTopRegion />
        </Container>
    </Wrapper>)
}
export default Statistics;