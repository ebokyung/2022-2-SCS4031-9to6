import styled from 'styled-components';

const Wrapper = styled.body`
    width: 100vw;
    display: flex;
    justify-content: center;
`

const Container = styled.section`
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
`

function Navbar () {
    return(
    <Wrapper>
        <Container>
            navbar
        </Container>
    </Wrapper>)
}
export default Navbar;