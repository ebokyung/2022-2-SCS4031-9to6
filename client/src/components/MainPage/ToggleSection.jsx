import styled from 'styled-components';

const Container = styled.section`
    width: 36%;
    max-width: ${props => props.theme.maxWidth};
    min-height: ${props => props.theme.minHeight};
`

function ToggleSection () {
    return(
    <Container>
        왼쪽
    </Container>)
}
export default ToggleSection;