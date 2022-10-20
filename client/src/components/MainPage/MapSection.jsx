import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { showSideBar } from '../../atoms';

const Container = styled.section`
    width: 100%;
    max-width: ${props => props.theme.maxWidth};
    min-height: ${props => props.theme.minHeight};
    padding-left: 460px;
    transition: all .5s;
    &.hide {
        padding-left: 0;
    }
`

function MapSection () {
    const visibility = useRecoilValue(showSideBar);

    return(
    <Container className={visibility ? '' : 'hide'}>
        {/* ... */}
    </Container>)
}
export default MapSection;