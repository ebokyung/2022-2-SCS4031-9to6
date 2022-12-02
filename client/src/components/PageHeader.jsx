import styled from 'styled-components';

const Header = styled.header`
    display: flex;
`

const Head = styled.div`
    margin-top: 6%;
    margin-bottom: 2%;
    width: fit-content;
`

const Title = styled.h1`
    font-size: 25px;
    font-weight: 500;
    color: #FFA000;
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