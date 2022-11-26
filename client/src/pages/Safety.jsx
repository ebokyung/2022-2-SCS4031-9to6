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
const pageheader = {
    title: '안전정보 페이지',
}

function Safety () {
    return(
    <Wrapper>
        <Container>
            <PageHeader props={pageheader} />
        </Container>
    </Wrapper>)
}
export default Safety;