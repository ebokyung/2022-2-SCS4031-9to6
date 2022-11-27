import styled from 'styled-components';

const Header = styled.header`
    display: flex;
`

const Head = styled.div`
    margin-top: 1.5rem;
    margin-left: 5%;
    width: fit-content;
`

const Subtitle = styled.p`
    font-size: 20px;
    font-weight: 500;
`

function PageHeader( {subtitle} ) {
    return(
        <Header>
            <Head>
                <Subtitle>
                    {subtitle}
                </Subtitle>
            </Head>
        </Header>
    )
}
export default PageHeader;