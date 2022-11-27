import styled from 'styled-components';

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    /* margin-top: 10px; */
    /* overflow-y: hidden; */
`
const GridContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`
const GridRow = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    height: 70px;
    border-bottom: 1px solid #D9D9D9;
`
const GridHead = styled(GridRow)`
    height: 80px;
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

function FloodHistoryList( {posts, loading} ) {

    return (
        <Wrapper>
            <GridContainer>
                <GridHead>
                    <GridCol>날짜</GridCol>
                    <GridCol>시간</GridCol>
                    <GridCol>CCTV 이름</GridCol>
                    <GridCol>단계</GridCol>
                    <GridCol>기상 상태</GridCol>
                </GridHead>
                {loading ? (
                <h1>Loading...</h1>
                ) : (
                posts.map((item, index) => (
                    <GridRow key={`floodhistory-list-${index}`}>
                        <GridCol> {item.Datetime} </GridCol>
                        <GridCol> {item.Datetime} </GridCol>
                        <GridCol> {item.CCTVName} </GridCol>
                        <GridCol> {item.FloodStage} </GridCol>
                        <GridCol> {item.Humidity} {item.Precipitation} {item.Temperature} </GridCol>
                    </GridRow>
                ))
                )}
            </GridContainer>
        </Wrapper>
    )
}

export default FloodHistoryList;