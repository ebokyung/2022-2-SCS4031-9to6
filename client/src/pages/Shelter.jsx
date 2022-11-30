import styled from 'styled-components';
import { useState, useEffect } from 'react';
import ShelterList from '../components/SafetyPage/ShelterList';
// import ShelterSearchbar from '../components/Searchbar';
import Pagination from '../components/Pagination';
import PageHeader from '../components/PageHeader';
import { API } from '../axios';

const Wrapper = styled.body`
    width: 100vw;
    display: flex;
    justify-content: center;
    margin-top: ${props => props.theme.navMarginTop};
`

const Container = styled.section`
    width : ${props => props.theme.width};
    max-width: ${props => props.theme.maxWidth};
    min-height: ${props => props.theme.minHeight};
    display: flex;
    flex-direction: column;
`

const ShelterCnt = styled.div`
    width: 100%;
    text-align: left;
    padding-left: 5px;
    margin-top: 20px;
    font-size: 20px;
`


function Shelter () {
    const [loading, setLoading] = useState(true);

    const [shelters, setShelters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(15);

    const getdata = async() => {
        try{
            const shelterData = await API.get("/Shelters");
            setShelters(shelterData.data);
            // console.log(shelterData.data);
            setLoading(false);
        }catch(error){
            console.log(error)
        }
    }

    useEffect(()=>{
        getdata();
    },[])

    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const currentPosts = (posts) => {
        let currentPosts = 0;
        currentPosts = posts.slice(indexOfFirst, indexOfLast);
        return currentPosts;
    };

    return(
    <Wrapper>
        <Container>
            <PageHeader title={'대피소'}/>
            {/* <ShelterSearchbar ph={'검색창'} width={'40%'} height={'40px'}/> */}
            <ShelterCnt>전체 {shelters.length} 건</ShelterCnt>
            <ShelterList posts={currentPosts(shelters)} loading={loading}/>
            <Pagination
                postsPerPage={postsPerPage}
                totalPosts={shelters.length}
                paginate={setCurrentPage}
            />
        </Container>
    </Wrapper>)
}
export default Shelter;