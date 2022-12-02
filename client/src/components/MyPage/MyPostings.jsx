import styled from 'styled-components';
import PageSubtitle from '../PageSubtitle';
import MyPostingsList from './MyPostingsList';
import Pagination from '../Pagination';
import { useState, useEffect } from 'react';
import { LogAPI } from '../../axios';


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


function MyPostings() {
    const user = JSON.parse(sessionStorage.getItem("token"));

    const [loading, setLoading] = useState(false);

    const [myPostings, setMyPostings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(4);

    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const currentPosts = (posts) => {
        let currentPosts = 0;
        currentPosts = posts.slice(indexOfFirst, indexOfLast);
        return currentPosts;
    };

    const getMyPostingData = async() => {
        try{
            const data = await LogAPI.get(`/Postings/Member/${user.ID}`);
            console.log(data.data);
            setMyPostings(data.data);
        } catch(error){
            console.log(error)
        }
    }
    
    useEffect(()=>{
        getMyPostingData(); 
    },[])

    return (
        <Wrapper>
            <PageSubtitle subtitle={'내가 쓴 글'} cnt={myPostings.length}/>
            <Container>
                <MyPostingsList posts={currentPosts(myPostings)} loading={loading}/>
                <Pagination
                    postsPerPage={postsPerPage}
                    totalPosts={myPostings.length}
                    paginate={setCurrentPage}
                />
            </Container>
        </Wrapper>
    )
}

export default MyPostings;