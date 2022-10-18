import styled from 'styled-components';
import footerGithub from '../../imgs/footerGithub.png';
import footerEmail from '../../imgs/footerEmail.png';

const Wrapper = styled.body`
    width: 100vw;
    height: 160px;
    display: flex;
    justify-content: center;
    background-color: ${props => props.theme.footerBackColor};
`

const Container = styled.section`
    width : ${props => props.theme.width};
    /* max-width: ${props => props.theme.maxWidth}; */
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color : ${props => props.theme.footerColor};
`

const Item = styled.div`
    display: flex;
    &:first-child{
        width: 20%;
    }
    &:nth-child(2){
        width: 60%;
    }
    &:last-child{
        width: 20%;
        justify-content: flex-end;
    }
`
const P = styled.p`
    margin: auto;
`

const Icon = styled.img`
    width: 2em;
    margin-left: 0.2em;
    cursor: pointer;
`

function Footer() {
    return(
        <Wrapper>
            <Container>
                <Item></Item>
                <Item>
                    <P>ⓒ 2022 NINETOSIX All Rights Reserved</P>
                </Item>
                <Item>
                    <Icon
                        alt="footerGithub"
                        src={footerGithub}
                        onClick={() =>
                            window.open('https://github.com/CSID-DGU/2022-2-SCS4031-9to6', '_blank')
                        }
                    />
                    <Icon
                        alt="footerEmail"
                        src={footerEmail}
                    />
                </Item>
            </Container>
        </Wrapper>
    )
}

export default Footer;