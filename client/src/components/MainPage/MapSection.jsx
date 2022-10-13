import styled from 'styled-components';

const Container = styled.section`
    width: 100%;
    max-width: ${props => props.theme.maxWidth};
    min-height: ${props => props.theme.minHeight};
`

function MapSection () {
    return(
    <Container>
        오른쪽
    </Container>)
}
export default MapSection;