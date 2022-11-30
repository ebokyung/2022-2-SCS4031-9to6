import styled from 'styled-components';
import { useState, useEffect } from 'react';
import ShelterList from '../components/SafetyPage/ShelterList';
import ShelterSearchbar from '../components/Searchbar';
import Pagination from '../components/Pagination';
import PageHeader from '../components/PageHeader';

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
    const [loading, setLoading] = useState(false);

    // const [shelters, setShelters] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(8);

    const test = [
        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },
        {
            Address: '서울특별시 강남구 강남대로 548 (논현동, 건우빌딩)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },
        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },
        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },
        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },
        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },
        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },
        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },
        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },
        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },
        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },
        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },
        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },
        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },

        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },
        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },
        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },

        {
            Address: '서울특별시 강남구 강남대로 310 (역삼동, 유니온센터오피스텔)',
            Name: '유니온센터',
            Type: '공공시설',
            Area: '12022',
        },

    ]

    // const getdata = async() => {
    //     try{
    //         const shelterData = await API.get("/Shelters");
    //         setShelters(shelterData.data);
    //         // console.log(shelterData.data);
    //         setLoading(false);
    //     }catch(error){
    //         console.log(error)
    //     }
    // }

    // useEffect(()=>{
    //     getdata();
    // },[])

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
            <ShelterSearchbar ph={'검색창'} width={'40%'} height={'40px'}/>
            <ShelterCnt>전체 {test.length} 건</ShelterCnt>
            <ShelterList posts={currentPosts(test)} loading={loading}/>
            <Pagination
                postsPerPage={postsPerPage}
                totalPosts={test.length}
                paginate={setCurrentPage}
            />
        </Container>
    </Wrapper>)
}
export default Shelter;