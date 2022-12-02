import styled from 'styled-components';

const Wrapper = styled.div`
    width: 100%;
    max-height: 1500px;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    overflow-y: hidden;
`
const GridContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`
const GridRow = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr 1fr;
    height: 90px;
    border-bottom: 1px solid #D9D9D9;
`
const GridHead = styled(GridRow)`
    height: 100px;
    border-top: 2px solid #FFA000a8;
    border-bottom: 2px solid #FFA000a8;
    font-weight: 600;
    color: #FFA000;
`

const GridCol = styled.div`
    height: 100%;
    padding: 12px 10px 13px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    white-space: pre-line;
    line-height: 1.5rem;
`

function ShelterList( {posts, loading} ) {

    return (
        <Wrapper>
            {/* <GridWrapper> */}
                <GridContainer>
                    <GridHead>
                        <GridCol>위치</GridCol>
                        <GridCol>시설</GridCol>
                        <GridCol>규모</GridCol>
                    </GridHead>
                    {loading ? (
                    <h1>Loading...</h1>
                    ) : (
                    posts.map((item, index) => (
                        <GridRow key={`shelter-list-${index}`}>
                            <GridCol> {item.Address} </GridCol>
                            <GridCol> {`${item.Name} \n (${item.Type})`}</GridCol>
                            <GridCol> {`${item.Area} m`} </GridCol>
                        </GridRow>
                    ))
                    )}
                </GridContainer>
            {/* </GridWrapper> */}
        </Wrapper>
    )
}

export default ShelterList;