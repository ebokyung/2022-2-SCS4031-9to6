import styled from 'styled-components';
import PageHeader from '../components/PageHeader';

const Wrapper = styled.body`
    width: 100vw;
    display: flex;
    justify-content: center;
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
            <PageHeader title={'제보 페이지'} />
        </Container>
    </Wrapper>)
}
export default Report;