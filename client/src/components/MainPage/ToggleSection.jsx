import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { showSideBar } from '../../atoms';

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

function ToggleSection () {
    
    const [visibility, setVisibility] = useRecoilState(showSideBar);

    const handleToggle = () => {
        setVisibility(prev => !prev);
    }

    return(
        <>
        <Container className={visibility ? '' : 'hide'}>
            <VisibilityToggle onClick={handleToggle} show={visibility}/>
            {/* ... */}
        </Container>
        
        </>  
    )
}
export default ToggleSection;