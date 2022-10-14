import styled from 'styled-components';

const Header = styled.header`
    display: flex;
    font-family: 'Nanum Myeongjo', serif;
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

function PageHeader( {title} ) {
    return(
        <Header>
            <Head>
                <Title>
                    {title}
                </Title>
            </Head>
        </Header>
    )
}
export default PageHeader;