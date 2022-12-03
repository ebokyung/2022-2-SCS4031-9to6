import styled from 'styled-components';
import PageHeader from '../components/PageHeader';
import ReportClusterMap from '../components/ReportPage/ReportClusterMap';
import ReportList from '../components/ReportPage/ReportList';
import { useState } from "react";
import { API } from "../axios";
import { useEffect } from "react";


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
`


function Report () {

    const [posts, setPosts] = useState([])

    const getInfo = async() => {
        try{
            const data = await API.get("/Postings");
            console.log(data.data)
            setPosts(data.data.slice(0).reverse())
        }catch(error){
            console.log(error)
        }
    }
  
    useEffect(() => {
        getInfo();
    },[])

    return(
    <Wrapper>
        <Container>
            <PageHeader title={'제보보기'} />
            <ReportClusterMap posts={posts}/>
            <ReportList posts={posts}/>
        </Container>
    </Wrapper>)
}
export default Report;