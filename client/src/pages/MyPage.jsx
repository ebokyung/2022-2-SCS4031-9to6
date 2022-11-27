import styled from 'styled-components';
import Bookmark from '../components/MyPage/Bookmark';
import MyPostings from '../components/MyPage/MyPostings';
import { useNavigate } from "react-router-dom";
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

function MyPage () {
    const navigate = useNavigate();


    const logOut = () => {
        sessionStorage.removeItem('token')
        navigate("/")
    }
    
    return(
    <Wrapper>
        <Container>
            <PageHeader title={'마이페이지'}/>
            <Bookmark />
            <MyPostings />
            <div>비밀번호 수정</div>
            <div onClick={logOut}>로그아웃</div>
        </Container>
    </Wrapper>)
}
export default MyPage;