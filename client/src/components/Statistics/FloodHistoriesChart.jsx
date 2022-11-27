import { useState } from 'react';
import styled from 'styled-components';
import PageSubtitle from '../PageSubtitle';
import ApexChart from "react-apexcharts"

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

    const [loading, setLoading] = useState(false);

    // const [histories, setHistories] = useState();

    return (
        <Wrapper>
            <PageSubtitle subtitle={'침수가 많은 CCTV장소'}/>
            <Container>
                <ApexChart 
                    type='bar'
                    series={[
                        {
                            name: '1단계',
                            data: [44, 55, 41, 67, 22, 43]
                        },{
                            name: '2단계',
                            data: [13, 23, 20, 8, 13, 27]
                        }, {
                            name: '3단계',
                            data: [11, 17, 15, 15, 21, 14]
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
                          type: 'datetime',
                          categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT',
                            '01/05/2011 GMT', '01/06/2011 GMT'
                          ],
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
            </Container>
        </Wrapper>
    )


}

export default FloodHistoriesChart;