import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { showSideBar } from '../../atoms';
import { Routes, Route, Link, useMatch } from 'react-router-dom';
import Notice from './Notice';
import Chat from './Chat';

const Container = styled.section`
    min-width: 460px;
    min-height: ${props => props.theme.minHeight};
    background-color: #404040;
    transition: all .5s;
    position: absolute;
    left: 0;
    &.hide {
        left: -440px;
    }
`

const VisibilityToggle = styled.button`
    width: 30px;
    height: 40px;
    position: absolute;
    left: 460px;
    transition: all .5s;
    z-index: 11;
    border-style: none;
    background-color: #404040;
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
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${props => props.isActive ? props.theme.navBackColor : 'white'};
  /* color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor}; */
  a {
    display: block;
  }
`;

function ToggleSection () {
    const mainMatch = useMatch('/');
    const noticeMatch = useMatch("/notice");
    const chatMatch = useMatch("/chat");
    
    const [visibility, setVisibility] = useRecoilState(showSideBar);

    const handleToggle = () => {
        setVisibility(prev => !prev);
    }

    return(
        <Container className={visibility ? '' : 'hide'}>
            <VisibilityToggle onClick={handleToggle} show={visibility}/>
            
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
                <Route path="chat" element={<Chat />} />
            </Routes>
        </Container>
    )
}
export default ToggleSection;