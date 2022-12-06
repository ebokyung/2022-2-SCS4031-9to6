import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { StageAPI } from '../../axios';

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    /* overflow-y: hidden; */
`
const GridContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`
const GridRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
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

function BookmarkItem ({item, idx}) {
    const [stageData, setStageData] = useState(0);

    const getStage = async () => {
        try{
            const data = await StageAPI.get(`/inference/${item.cctvID}`);
            // console.log(data.data.stage);
            setStageData(data.data.stage);
        } catch(e) {
            console.log(e)
        }
    }

    useEffect(()=>{
        getStage();
    },[])
    
    return (
        <GridRow>
            <GridCol> {item.cctvName} </GridCol>
            <GridCol> {stageData}단계 </GridCol>
            <GridCol> {item.URL} </GridCol>
        </GridRow>
    )

}
// export default BookmarkItem;

function BookmarkList( {posts, loading} ) {

    return (
        <Wrapper>
            <GridContainer>
                <GridHead>
                    <GridCol>cctv 이름</GridCol>
                    <GridCol>현재 단계</GridCol>
                    <GridCol>실시간 영상 보기</GridCol>
                </GridHead>
                {loading ? (
                <h1>Loading...</h1>
                ) : (
                posts.map((item, index) => (
                    // console.log(item)
                    <BookmarkItem key={`bookmark-list-${index}`} item={item} idx={index} />
                ))
                )}
            </GridContainer>
        </Wrapper>
    )
}

export default BookmarkList;