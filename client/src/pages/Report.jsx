import styled from 'styled-components';
import ReportClusterMap from '../components/ReportPage/ReportClusterMap';
import ReportList from '../components/ReportPage/ReportList';


const Wrapper = styled.body`
    width: 100vw;
    display: flex;
    justify-content: center;
    margin-top: ${props => props.theme.navMarginTop};
`

const Container = styled.section`
    width : ${props => props.theme.width};
    max-width: ${props => props.theme.maxWidth};
    min-height: ${props => props.theme.minHeight};
`


function Report () {
    return(
    <Wrapper>
        <Container>
            <ReportClusterMap />
            <ReportList />
        </Container>
    </Wrapper>)
}
export default Report;