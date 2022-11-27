import styled from 'styled-components';
import Bookmark from '../components/MyPage/Bookmark';
import MyPostings from '../components/MyPage/MyPostings';
import { useNavigate } from "react-router-dom";
import PageHeader from '../components/PageHeader';
import PageSubtitle from '../components/PageSubtitle';

const Wrapper = styled.body`
    width: 100vw;
    display: flex;
    justify-content: center;
    margin-top: ${props => props.theme.navMarginTop};
    margin-bottom: ${props => props.theme.navMarginTop};
`

const Container = styled.section`
    width : ${props => props.theme.width};
    max-width: ${props => props.theme.maxWidth};
    min-height: ${props => props.theme.minHeight};
`

function MyPage () {
    const navigate = useNavigate();


    const logOut = () => {
        if(window.confirm('로그아웃 하시겠습니까?')){
            sessionStorage.removeItem('token')
            navigate("/")
        } 
    }
    
    return(
    <Wrapper>
        <Container>
            <PageHeader title={'마이페이지'}/>
            <Bookmark />
            <MyPostings />
            <PageSubtitle subtitle={'비밀번호 수정'} />
            <PageSubtitle subtitle={'로그아웃'} click={logOut} />
        </Container>
    </Wrapper>)
}
export default MyPage;