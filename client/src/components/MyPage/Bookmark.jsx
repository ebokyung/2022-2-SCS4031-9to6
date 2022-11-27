import styled from 'styled-components';
import PageSubtitle from '../PageSubtitle';

const Wrapper = styled.div`
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    /* margin-top: ${props => props.theme.navMarginTop}; */
`
const Container = styled.div`
    width: 100%;
    height: 100%;
`

function Bookmark() {
    return (
        <Wrapper>
            <Container>
                <PageSubtitle subtitle={'즐겨찾기'}/>
            </Container>
        </Wrapper>
    )
}

export default Bookmark;