import styled from 'styled-components';
import PageSubtitle from '../PageSubtitle';
import BookmarkList from './BookmarkList';
import Pagination from '../Pagination';
import { useState } from 'react';
import { setBookmark } from '../../atoms';
import { useRecoilValue, useRecoilState } from 'recoil';

const Wrapper = styled.div`
    width: 100%;
    height: 500px;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    /* margin-top: ${props => props.theme.navMarginTop}; */
`
const Container = styled.div`
    /* width: 100%; */
    height: 100%;
    margin: 0 5%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`

// const TotalCnt = styled.div`
//     width: 100%;
//     text-align: left;
//     padding-left: 5px;
//     margin-top: 20px;
//     font-size: 20px;
// `

const test = [
    {
        cctvID: '강남구청',
        step: 0,
        url: 'url',
    },
    {
        cctvID: '강남구청',
        step: 0,
        url: 'url',
    },
    {
        cctvID: '강남구청',
        step: 0,
        url: 'url',
    },
    {
        cctvID: '강남구청',
        step: 0,
        url: 'url',
    },
    {
        cctvID: '강남구청',
        step: 0,
        url: 'url',
    },
    {
        cctvID: '강남구청',
        step: 0,
        url: 'url',
    },
]

function Bookmark() {

    const [loading, setLoading] = useState(false);

    // const [bookmark, setBookmark] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(4);

    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const currentPosts = (posts) => {
        let currentPosts = 0;
        currentPosts = posts.slice(indexOfFirst, indexOfLast);
        return currentPosts;
    };

    // const [bookmarkList, setBookmarkList] = useRecoilState(setBookmark);
    const bookmarkArray = useRecoilValue(setBookmark);
    // const getMyBookmarkData = async() => {
    //     try{
    //         const bookmarkData = await LogAPI.get(`/Bookmark/${userID}`);
    //         console.log(bookmarkData.data.Bookmark);
    //         setBookmarkList(bookmarkData.data.Bookmark);
    //       }catch(error){
    //         console.log(error)
    //     }
    //   }
    //   useEffect(()=>{
    //     getMyBookmarkData(); 
    //   },[])

    return (
        <Wrapper>
            <PageSubtitle subtitle={'즐겨찾기'} cnt={test.length}/>
            <Container>
                {/* <TotalCnt>전체 {test.length} 건</TotalCnt> */}
                <BookmarkList posts={currentPosts(bookmarkArray)} loading={loading}/>
                <Pagination
                    postsPerPage={postsPerPage}
                    totalPosts={bookmarkArray.length}
                    paginate={setCurrentPage}
                />
            </Container>
        </Wrapper>
    )
}

export default Bookmark;