import styled from 'styled-components';

const Wrapper = styled.body`
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    margin-top: ${props => props.theme.navMarginTop};
`

function MyPostings() {
    return (
        <Wrapper>
            <div>내가쓴글</div>
        </Wrapper>
    )
}

export default MyPostings;