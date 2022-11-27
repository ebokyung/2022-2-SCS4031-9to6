import styled from 'styled-components';
import PageSubtitle from '../PageSubtitle';

const Wrapper = styled.body`
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    margin-top: ${props => props.theme.navMarginTop};
`
const Container = styled.div`
    width: 100%;
    height: 100%;
`

function MyPostings() {
    return (
        <Wrapper>
            <Container>
                <PageSubtitle subtitle={'내가쓴글'} />
            </Container>
        </Wrapper>
    )
}

export default MyPostings;