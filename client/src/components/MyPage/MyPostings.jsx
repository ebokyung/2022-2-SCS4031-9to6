import styled from 'styled-components';
import PageSubtitle from '../PageSubtitle';
import MyPostingsList from './MyPostingsList';
import Pagination from '../Pagination';
import { useState } from 'react';

const Wrapper = styled.body`
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

const test = [
    {
        img: '이미지',
        address: '강남',
        content: '제보내용'
    },{
        img: '이미지',
        address: '강남',
        content: '제보내용'
    },{
        img: '이미지',
        address: '강남',
        content: '제보내용'
    },{
        img: '이미지',
        address: '강남',
        content: '제보내용'
    },{
        img: '이미지',
        address: '강남',
        content: '제보내용'
    },
]

function MyPostings() {

    const [loading, setLoading] = useState(false);

    // const [myPostings, setMyPostings] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(4);

    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const currentPosts = (posts) => {
        let currentPosts = 0;
        currentPosts = posts.slice(indexOfFirst, indexOfLast);
        return currentPosts;
    };

    return (
        <Wrapper>
            <PageSubtitle subtitle={'내가 쓴 글'} cnt={test.length}/>
            <Container>
                <MyPostingsList posts={currentPosts(test)} loading={loading}/>
                <Pagination
                    postsPerPage={postsPerPage}
                    totalPosts={test.length}
                    paginate={setCurrentPage}
                />
            </Container>
        </Wrapper>
    )
}

export default MyPostings;