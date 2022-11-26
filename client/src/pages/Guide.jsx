import styled from 'styled-components';
import PageHeader from '../components/PageHeader';
import icons_step from '../imgs/IconsStep.png';
import icons_other from '../imgs/IconsMap.png';


const Wrapper = styled.body`
    width: 100vw;
    display: flex;
    justify-content: center;
    margin-top: ${props => props.theme.navMarginTop};
    margin-bottom: 80px;
`

const Container = styled.section`
    width : ${props => props.theme.width};
    max-width: ${props => props.theme.maxWidth};
    min-height: ${props => props.theme.minHeight};
`
const ImgDiv = styled.div`
    width: 70%;
    height: fit-content;
    margin-left: 4%;
    margin-top: 1rem;
`

const Img = styled.img`
    width: 100%;
`

const pageheader__main = {
    title : "지도 아이콘 안내",
    subtitle: "침수 단계별 마커 색상",
}

const pageheader_main2 = {
    subtitle: "이 외 마커",
}

function Guide () {
    return(
    <Wrapper>
        <Container>
            <div>
                <PageHeader props={pageheader__main} />
                <ImgDiv> <Img src={icons_step}/></ImgDiv>
                
                <PageHeader props={pageheader_main2} />
                <ImgDiv> <Img src={icons_other}/></ImgDiv>
            </div>
        </Container>
    </Wrapper>)
}
export default Guide;