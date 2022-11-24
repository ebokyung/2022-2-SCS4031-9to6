import styled from 'styled-components';

const Wrapper = styled.body`
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    margin-top: ${props => props.theme.navMarginTop};
`

function Bookmark() {
    return (
        <Wrapper>
            <div>즐겨찾기</div>
        </Wrapper>
    )
}

export default Bookmark;