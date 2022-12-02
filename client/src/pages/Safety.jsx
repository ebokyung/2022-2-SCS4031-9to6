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

function Safety () {
    return(
    <Wrapper>
        <Container>
            <PageHeader title={'행동지침'} />
        </Container>
    </Wrapper>)
}
export default Safety;