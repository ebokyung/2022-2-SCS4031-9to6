import styled from 'styled-components';
import PageHeader from '../components/PageHeader';
import ShelterList from '../components/SafetyPage/ShelterList';

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


function Shelter () {
    return(
    <Wrapper>
        <Container>
            <PageHeader title={'대피소'} />
            <ShelterList />
        </Container>
    </Wrapper>)
}
export default Shelter;