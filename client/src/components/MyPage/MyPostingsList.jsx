import styled from 'styled-components';
import { LogAPI } from '../../axios';

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
    grid-template-columns: 1fr 1.5fr 2fr 0.5fr;
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

function MyPostingsList( {posts, loading, onClick} ) {

    // const handleModify = () => {
    //     console.log('수정하고싶어요.');
    // }

    const handleDelete = async (idx) => {
        // console.log('삭제하고싶어요.');
        try{
            await LogAPI.delete(`/Postings/${idx}`);
            alert('제보를 삭제했습니다.');
            onClick()
        } catch(e) {
            console.log(e)
        }
    }

    return (
        <Wrapper>
            <GridContainer>
                <GridHead>
                    <GridCol>제보사진</GridCol>
                    <GridCol>위치</GridCol>
                    <GridCol>제보내용</GridCol>
                    <GridCol>삭제</GridCol>
                </GridHead>
                {loading ? (
                <h1>Loading...</h1>
                ) : (
                posts.map((item, idx) => (
                    <GridRow key={`mypostings-list-${idx}`}>
                        <GridCol> <img width= '60px' height= '40px' src={item.ImageURL} /> </GridCol>
                        <GridCol> {item.Address} </GridCol>
                        <GridCol> {item.Content} </GridCol>
                        <GridCol> 
                            {/* <span onClick={()=>handleModify()}>수정</span>  */}
                            <span onClick={()=>handleDelete(item.Index)}>삭제</span> 
                        </GridCol>
                    </GridRow>
                ))
                )}
            </GridContainer>
        </Wrapper>
    )
}

export default MyPostingsList;