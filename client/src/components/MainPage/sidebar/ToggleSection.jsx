import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { showSideBar } from '../../../atoms';
import { Routes, Route, Link, useMatch, useLocation } from 'react-router-dom';
import Notice from './Notice';
import Chat from './Chat';

function ToggleSection () {
    const mainMatch = useMatch('/');
    const noticeMatch = useMatch("/notice");
    const chatMatch = useMatch("/chat");
    
    const [visibility, setVisibility] = useRecoilState(showSideBar);

    const handleToggle = () => {
        setVisibility(prev => !prev);
    }

    return(
        <Wrapper className={visibility ? '' : 'hide'}>
            <VisibilityToggle onClick={handleToggle} show={visibility}/>
            <Container>    
                <Tabs>
                    <Tab isActive={noticeMatch !== null || mainMatch !== null}>
                        <Link to={`notice`}>알림</Link>
                    </Tab>
                    <Tab isActive={chatMatch !== null}>
                        <Link to={`chat`}>채팅</Link>
                    </Tab>
                </Tabs>

                <Routes>
                    <Route index element={<Notice />} />
                    <Route path="notice" element={<Notice />} />
                    {/* <Route path="chat" element={<Chat />} /> */}
                    <Route path="chat" element={<Chat />} />
                </Routes>
            </Container>
        </Wrapper>
        
    )
}
export default ToggleSection;


const Wrapper = styled.section`
    width: 460px;
    min-height: ${props => props.theme.minHeight};
    max-height: 100vh;
    background-color: ${props => props.theme.sideBackColor};
    transition: all .5s;
    position: absolute;
    z-index: 11;
    left: 0;
    &.hide {
        left: -440px;
        background-color: ${props => props.theme.sideBackColor};
    }
`
const Container = styled.div`
    position: relative;
    width: inherit;
    height: inherit;
    overflow-y: hidden;
`

const VisibilityToggle = styled.button`
    width: 30px;
    height: 40px;
    position: absolute;
    left: 460px;
    transition: all .5s;
    z-index: 11;
    border-style: none;
    background-color: ${props => props.theme.sideBackColor};
`

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 15px 20px;
  gap: 15px;
`;

const Tab = styled.span`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: ${props => props.theme.tabBackColor};
  padding: 7px 0px;
  border-radius: 10px;
  color: ${props => props.isActive ? props.theme.navBackColor : 'white'};
  a {
    display: block;
  }
`;