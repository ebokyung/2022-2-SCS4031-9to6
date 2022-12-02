import styled from 'styled-components';
import PageSubtitle from '../PageSubtitle';
import ApexChart from "react-apexcharts";
import { useState, useEffect } from 'react';
import { API } from '../../axios';

const Wrapper = styled.div`
    width: 100%;
    height: 450px;
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

const test = [
    {
        "CCTVName": "",
        "FloodStageData" : {
            "1" : 1,
            "2" : 1,
        }
    },
    {
        "CCTVName": "",
        "FloodStageData" : {
            "1" : 1,
            "2" : 1,
        }
    },{
        "CCTVName": "",
        "FloodStageData" : {
            "1" : 1,
            "2" : 1,
        }
    },{
        "CCTVName": "",
        "FloodStageData" : {
            "1" : 1,
            "2" : 1,
        }
    },{
        "CCTVName": "",
        "FloodStageData" : {
            "1" : 1,
            "2" : 1,
        }
    },{
        "CCTVName": "",
        "FloodStageData" : {
            "1" : 1,
            "2" : 1,
        }
    },{
        "CCTVName": "",
        "FloodStageData" : {
            "1" : 1,
            "2" : 1,
        }
    },
]

function FloodHistoriesChart() {

  // const [loading, setLoading] = useState(true);
  const [floodData, setFloodData] = useState([]);
  let [xcategories, setXCategories] = useState([]);
  let [stepsData, setStepsData] = useState({
    step1: [44, 55, 41, 67, 22, 43],
    step2: [13, 23, 20, 8, 13, 27],
    step3: [11, 17, 15, 15, 21, 14],
  })
  // let [step1datas, setStep1Datas] = useState([44, 55, 41, 67, 22, 43]);
  // let [step2datas, setStep2Datas] = useState([13, 23, 20, 8, 13, 27]);
  // let [step3datas, setStep3Datas] = useState([11, 17, 15, 15, 21, 14]);

  const getInfo = async( ) => {
      try{
          const data = await API.get(`/Data/CCTV`);
          console.log(data.data.slice(0,5));
          setFloodData(data.data.slice(0,5));
          // setLoading(false);
      }catch(error){
          console.log(error);
      }
  }

  useEffect(() => {
      getInfo();
  },[])

  useEffect(()=>{
    floodData && (
      floodData.map((i)=>{
        setXCategories(i.CCTVName)
        // setStepsData(prev => [...prev, []])
      })
    )
  },[floodData]);

    return (
        <Wrapper>
            <PageSubtitle subtitle={'침수가 많은 CCTV장소'}/>
            <Container>
              { floodData &&
                <ApexChart 
                    type='bar'
                    series={[
                        {
                            name: '1단계',
                            data: stepsData.step1
                        },{
                            name: '2단계',
                            data: stepsData.step2
                        }, {
                            name: '3단계',
                            data: stepsData.step3
                        }
                    ]}
                    height = {`350px`}
                    width = {`100%`}
                    options= {{
                        chart: {
                          type: 'bar',
                          stacked: true,
                          toolbar: {
                            show: false //차트 우측상단 툴바
                          },
                          zoom: {
                            enabled: true
                          }
                        },
                        responsive: [{
                          breakpoint: 480,
                          options: {
                            legend: {
                              position: 'bottom',
                              offsetX: -10,
                              offsetY: 0
                            }
                          }
                        }],
                        plotOptions: {
                          bar: {
                            horizontal: false,
                            borderRadius: 10,
                            dataLabels: {
                              total: {
                                enabled: true,
                                style: {
                                  fontSize: '13px',
                                  fontWeight: 900
                                }
                              }
                            }
                          },
                        },
                        xaxis: {
                          type: 'string',
                          categories: xcategories,
                        },
                        legend: {
                          position: 'right',
                          offsetY: 40
                        },
                        fill: {
                          opacity: 1
                        }
                    }}
                />
                  }
            </Container>
        </Wrapper>
    )


}

export default FloodHistoriesChart;