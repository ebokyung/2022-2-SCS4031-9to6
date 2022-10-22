import styled from 'styled-components';
import SignUpBox from '../components/SignUp/SignUpBox';

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

const SignUpDiv = styled.div`
    width: ${props => props.theme.logBoxWidth};
    height: 100%;
    background-color: ${props => props.theme.logBoxColor};
    display: flex;
    align-items: center;
`


function SignUp () {
    return(
    <Wrapper>
        <Container>
            <SignUpDiv>
                <SignUpBox />
            </SignUpDiv>
        </Container>
    </Wrapper>)
}
export default SignUp;