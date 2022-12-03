import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API } from '../../axios';
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
    padding: 0 5px;
    border-radius: 3px;
    border-style: 1px solid;
    border-color: #FFA726;
    :focus {
        outline-color: #FFA726;
    }
`

function FloodHistories() {

    const [loading, setLoading] = useState(true);

    const [histories, setHistories] = useState([]);
    const selectList = ['전체','강남구','동작구','서초구'];
    const [selected, setSelected] = useState('전체');

    const handleSelect = (e) => {
      setSelected(e.target.value);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(6);

    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;
    const currentPosts = (posts) => {
        let currentPosts = 0;
        currentPosts = posts.slice(indexOfFirst, indexOfLast);
        return currentPosts;
    };

    const getInfo = async() => {
        try{
            const data = await API.get("/FloodHistories");
            // console.log(data.data)
            setHistories(data.data.slice(0).reverse());
            setLoading(false);
        }catch(error){
            console.log(error);
        }
    }

    const getRegionData = async( region ) => {
        try{
            const data = await API.get(`/Data/FloodHistory?Region=${region}`);
            console.log(data.data)
            setHistories(data.data);
            setLoading(false);
        }catch(error){
            console.log(error);
        }
    }
  
    useEffect(() => {
        if(selected === '전체'){
            getInfo();
        } else {
            getRegionData(selected);
        }
    },[selected])

    return (
        <Wrapper>
            <PageSubtitle subtitle={'침수 발생 이력(최신순)'}/>
            <Container>
                <Search onChange={handleSelect} value={selected}>
                {selectList.map((item) => (
                    <option value={item} key={item}>
                        {item}
                    </option>
                ))}
                </Search>
                <FloodHistoryList posts={currentPosts(histories)} loading={loading}/>
                <Pagination
                    postsPerPage={postsPerPage}
                    totalPosts={histories.length}
                    paginate={setCurrentPage}
                />
            </Container>
        </Wrapper>
    )


}

export default FloodHistories;