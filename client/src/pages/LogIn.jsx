import styled from 'styled-components';
import LogBox from '../components/LogIn/LogBox';

const Wrapper = styled.body`
    width: 100vw;
    display: flex;
    justify-content: flex-end;
    background-color: ${props => props.theme.logBackColor};
    min-height: ${props => props.theme.minHeight};
`

const Container = styled.section`
    margin-top: ${props => props.theme.navMarginTop};
`

const LogDiv = styled.div`
    width: ${props => props.theme.logBoxWidth};
    height: 100%;
    background-color: ${props => props.theme.logBoxColor};
    display: flex;
    align-items: center;
`


function LogIn () {
    return(
    <Wrapper>
        <Container>
            <LogDiv>
                <LogBox />
            </LogDiv>
        </Container>
    </Wrapper>)
}
export default LogIn;