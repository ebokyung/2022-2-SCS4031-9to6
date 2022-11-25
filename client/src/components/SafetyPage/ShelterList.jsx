import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { API } from '../../axios';


const Wrapper = styled.body`
    width: 100%;
    height: 500px;
    display: flex;
    flex-direction: column;
    margin-top: 80px;
`

const GridWrapper = styled.div`
    width: 100%;
    min-height: 600px;
`
const GridContainer = styled.div`
    width: 100%;
`
const GridRow = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    /* align-items: center; */
    height: 90px;
`
const GridHead = styled(GridRow)`
    height: 120px;
`

const GridCol = styled.div`
    height: 100%;
    padding: 12px 10px 13px 10px;
    text-align: center;
`

function ShelterList() {
    const [loading, setLoading] = useState(true);
    const [shelters, setShelters] = useState();

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

    return (
        <Wrapper>
            {loading ? (
            <h1>Loading...</h1>
            ) : (
            <>
            <div>검색창</div>
            <GridWrapper>
                <GridContainer>
                    <GridHead>
                        <GridCol><span>위치</span></GridCol>
                        <GridCol><span>시설</span></GridCol>
                        <GridCol><span>규모</span></GridCol>
                    </GridHead>
                    {shelters.map((item, index) => (
                        <GridRow key={`shelter-list-${index}`}>
                            <GridCol> {item.Address} </GridCol>
                            <GridCol> {item.Name} </GridCol>
                            <GridCol> {item.Area} </GridCol>
                        </GridRow>
                    ))}
                </GridContainer>
            </GridWrapper>
            </>
            )}
        </Wrapper>
    )
}

export default ShelterList;