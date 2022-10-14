import styled from 'styled-components';
import PageHeader from '../components/PageHeader';

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


function SignUp () {
    return(
    <Wrapper>
        <Container>
            <PageHeader title={'회원가입'} />
        </Container>
    </Wrapper>)
}
export default SignUp;