import styled, { css } from 'styled-components';
import { useMatch } from "react-router";
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.body`
    width: 100vw;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.navBackColor};
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    position: fixed;
    top:0;
    z-index: 300;
`

const Container = styled.section`
    width : ${props => props.theme.width};
    height: 100%;
    display:flex;
    justify-content:space-between;
    align-items: center;
    flex-wrap: nowrap;
    color: white;
`

// const Logoimg = styled.img`
//     width: 30px;
//     height: 30px;
// `

const Logo = styled.div`
    width: 20%;
    display: flex;
    align-items: center;
    cursor: pointer;
`


const LogoTitle = styled.h3`
    width: 50%;
    font-size: 30px;
    margin-left: 10px;
    font-weight: 500;
`

const Menu = styled.div`
    height: 100%;
    width: 70%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
`

const Item = styled.div`
    height: 60%;
    display: flex;
    align-items: center;
    padding-right:50px;
    position: relative;
    cursor: pointer;
    color: ${props => props.isActive ? props.theme.navColor2 : props.theme.navColor1};
    opacity: ${props => props.isActive ? 1 : 0.6};
    transition: all 0.2s;
    :hover{
        transition: all 0.2s;
        opacity: 1;
    }
    ${props => (props.drop && css`:hover ul{ display: block; }`)};
`

const DropDown = styled.ul`
    display: none;
    position: absolute;
    top: 30px;
    left: -25%;
    width: 120px;
    margin-top: 16px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    background-color: white;
    color: ${props => props.theme.navBackColor};
    text-align: center;
`

const DropDownItem = styled.li`
    padding: 12px 16px;
    font-size: 13px;
    &:hover {
        background-color: #f5f5f5;
        border-radius: 5px;
    }
`

const Member = styled.div`
    padding: 3px 10px;
    text-align: center;
    font-size: 15px;
    font-weight: 500;
    border: 2px solid white;
    border-radius: 15px;
    cursor: pointer;
`

function Navbar () {
    const navigate = useNavigate()
    const mainMatch = useMatch("/");
    const noticeMatch = useMatch("/notice");
    const chatMatch = useMatch("/chat");
    const reportMatch = useMatch("/report");
    const safetyMatch = useMatch("/safety/*");
    // const cocMatch = useMatch("/safety/coc");
    const shelterMatch = useMatch("/safety/shelter");
    const statisticsMatch = useMatch("/statistics");
    const serviceMatch = useMatch("/service/*");
    const guideMatch = useMatch("/service/guide");
    // 로그인 했는지 안했는지
    const logCheck = localStorage.getItem("token") || sessionStorage.getItem("token")

    const logIn = () => {
        navigate("/login")
    }

    const myPage = () => {
        navigate("/mypage")
    }

    return(
    <Wrapper>
        <Container>
            <Logo>
                {/* <Logoimg src={logoImg} /> */}
                <LogoTitle>침수24</LogoTitle>
            </Logo>
            <Menu>
                <Item isActive={mainMatch !== null || noticeMatch !== null || chatMatch !== null} 
                    onClick={() => navigate("/")}>침수지도</Item>
                <Item drop={true} isActive={safetyMatch !== null || shelterMatch !== null}>안전정보
                    <DropDown>
                            <DropDownItem isActive={safetyMatch !== null} onClick={() => window.open('https://www.safekorea.go.kr/idsiSFK/neo/sfk/cs/contents/prevent/prevent21.html?menuSeq=126', '_blank')}>행동지침</DropDownItem>
                            <DropDownItem isActive={shelterMatch !== null} onClick={() => navigate("/safety/shelter")}>대피소</DropDownItem>
                    </DropDown>
                </Item>
                <Item isActive={reportMatch !== null} onClick={() => navigate("/report")}>제보보기</Item>
                <Item isActive={statisticsMatch !== null} onClick={() => navigate("/statistics")}>데이터분석</Item>
                <Item drop={true} isActive={serviceMatch !== null || guideMatch !== null}>서비스소개
                    <DropDown>
                            <DropDownItem isActive={serviceMatch !== null} onClick={() => navigate("/service")}>서비스 소개</DropDownItem>
                            <DropDownItem isActive={guideMatch !== null} onClick={() => navigate("/service/guide")}>지도 이용안내</DropDownItem>
                    </DropDown>
                </Item>
            </Menu>
            {
                logCheck === null ? 
                <Member onClick={logIn}>
                    로그인
                </Member>
                :
                <Member onClick={myPage}>
                    myPage
                </Member>
            }
        </Container>
    </Wrapper>)
}
export default Navbar;