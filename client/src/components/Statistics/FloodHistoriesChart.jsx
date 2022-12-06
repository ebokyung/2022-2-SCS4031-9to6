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
  const [xcategories, setXCategories] = useState([]);
  const [step1Data, setStep1Data] = useState([])
  const [step2Data, setStep2Data] = useState([])
  const [step3Data, setStep3Data] = useState([])
  const [step0Data, setStep0Data] = useState([])
  // let step1Data =[0,0,0,0,0];
  // let step2Data =[0,0,0,0,0];
  // let step3Data =[0,0,0,0,0];
  // let step0Data =[0,0,0,0,0];
  const [loading, setLoading] = useState(false);

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
    floodData && 
      floodData.map((i, idx)=>{
        setXCategories(prev => [...prev, i.CCTVName]);
        // console.log(i.FloodStageData);
        for(let step of Object.keys(i.FloodStageData)){
          // console.log(step);
          if (step === '1') {
            setStep1Data(prev=> [...prev, i.FloodStageData[step]])
            setStep2Data(prev=> [...prev, 0])
            setStep3Data(prev=> [...prev,0])
          } 
           else if (step === '2'){
            setStep1Data(prev=> [...prev, 0]); 
            setStep2Data(prev => [...prev, i.FloodStageData[step]]);
            setStep3Data(prev=> [...prev,0]);
           }
          else if( step === '3' ){
            setStep1Data(prev=> [...prev, 0]); 
            setStep2Data(prev=> [...prev, 0]); 
            setStep3Data(prev=> [...prev, i.FloodStageData[step]])
          } else {
            setStep0Data(prev=> [...prev, i.FloodStageData[step]]) 
          }
        }
      }) && setLoading(true);
    // console.log(step1Data);
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
                            // data: stepsData.step1
                            data: step1Data
                        },{
                            name: '2단계',
                            // data: stepsData.step2
                            data: step2Data
                        }, {
                            name: '3단계',
                            // data: stepsData.step3
                            data: step3Data
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