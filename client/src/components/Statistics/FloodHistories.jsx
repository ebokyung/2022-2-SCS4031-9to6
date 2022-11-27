import { useState } from 'react';
import styled from 'styled-components';
import PageSubtitle from '../PageSubtitle';
import Pagination from '../Pagination';
import FloodHistoryList from './FloodHistoryList';

const Wrapper = styled.div`
    width: 100%;
    height: 700px;
    display: flex;
    flex-direction: column;
`
const Container = styled.div`
    height: 100%;
    margin: 0 5%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
`
const Search = styled.select`
    margin: 20px 0;
    width: 250px;
    height: 35px;
`
const test = [
    {
        "CCTVID": "CCTV ID",
        "CCTVName" : "CCTV 이름",
        "Datetime": "2022-11-20T21 : 23 : 30",
        "FloodStage": 1,
        "Humidity": 66.0,
        "ImageURL": "S3 객체 URL",
        "Precipitation": 0.0,
        "Temperature": 13.6,
    },
    {
        "CCTVID": "CCTV ID",
        "CCTVName" : "CCTV 이름",
        "Datetime": "2022-11-20T21 : 23 : 30",
        "FloodStage": 1,
        "Humidity": 66.0,
        "ImageURL": "S3 객체 URL",
        "Precipitation": 0.0,
        "Temperature": 13.6,
    },
    {
        "CCTVID": "CCTV ID",
        "CCTVName" : "CCTV 이름",
        "Datetime": "2022-11-20T21 : 23 : 30",
        "FloodStage": 1,
        "Humidity": 66.0,
        "ImageURL": "S3 객체 URL",
        "Precipitation": 0.0,
        "Temperature": 13.6,
    },
    {
        "CCTVID": "CCTV ID",
        "CCTVName" : "CCTV 이름",
        "Datetime": "2022-11-20T21 : 23 : 30",
        "FloodStage": 1,
        "Humidity": 66.0,
        "ImageURL": "S3 객체 URL",
        "Precipitation": 0.0,
        "Temperature": 13.6,
    },
    {
        "CCTVID": "CCTV ID",
        "CCTVName" : "CCTV 이름",
        "Datetime": "2022-11-20T21 : 23 : 30",
        "FloodStage": 1,
        "Humidity": 66.0,
        "ImageURL": "S3 객체 URL",
        "Precipitation": 0.0,
        "Temperature": 13.6,
    },
    {
        "CCTVID": "CCTV ID",
        "CCTVName" : "CCTV 이름",
        "Datetime": "2022-11-20T21 : 23 : 30",
        "FloodStage": 1,
        "Humidity": 66.0,
        "ImageURL": "S3 객체 URL",
        "Precipitation": 0.0,
        "Temperature": 13.6,
    },

]

function FloodHistories() {

    const [loading, setLoading] = useState(false);

    // const [histories, setHistories] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);

    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const currentPosts = (posts) => {
        let currentPosts = 0;
        currentPosts = posts.slice(indexOfFirst, indexOfLast);
        return currentPosts;
    };

    return (
        <Wrapper>
            <PageSubtitle subtitle={'침수 발생 이력(최신순)'}/>
            <Container>
                <Search></Search>
                <FloodHistoryList posts={currentPosts(test)} loading={loading}/>
                <Pagination
                    postsPerPage={postsPerPage}
                    totalPosts={test.length}
                    paginate={setCurrentPage}
                />
            </Container>
        </Wrapper>
    )


}

export default FloodHistories;