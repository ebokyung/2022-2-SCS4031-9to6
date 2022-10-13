import styled from 'styled-components';
import ToggleSection from '../components/MainPage/ToggleSection';
import MapSection from '../components/MainPage/MapSection';

const Wrapper = styled.body`
    width: 100vw;
    display: flex;
    justify-content: center;
    margin-top: ${props => props.theme.navMarginTop};
`

function MainPage () {
    return(
    <Wrapper>
        <ToggleSection />
        <MapSection />
    </Wrapper>)
}
export default MainPage;