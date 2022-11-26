import styled from 'styled-components';

const Header = styled.header`
    display: flex;
    flex-direction: column;
`

const Head = styled.div`
    margin-top: 6%;
    position: relative;
    width: fit-content;
`

const Title = styled.h1`
    font-size: 20px;
    font-weight: 500;
`

const Body = styled.div`
    margin-top: 20px;
    margin-left: 4%;
`
const BodyItem = styled.p`
    margin-top: 10px;
    font-weight: 500;
    color: #FFA000;
`

function PageHeader( {props} ) {
    return(
        <Header>
            {props.title ? (
            <Head>
                <Title>
                    {props.title}
                </Title>
            </Head>
            ) : null}   
            <Body>
                <BodyItem>
                    {props.subtitle}
                </BodyItem>
            </Body>
        </Header>
    )
}
export default PageHeader;