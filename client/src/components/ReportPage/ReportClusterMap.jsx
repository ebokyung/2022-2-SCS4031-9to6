import styled from 'styled-components';
import {Map, MarkerClusterer, MapMarker} from 'react-kakao-maps-sdk';

const Wrapper = styled.body`
    width: 100%;
    height: 550px;
    display: flex;
    justify-content: center;
    margin-top: ${props => props.theme.navMarginTop};
`

function ReportClusterMap() {

    const reportPositions = [
        {
          Content: '제보1',
          Latitude: 37.49966168796031,
          Longitude: 127.03007039430118,
          Address: '도로명주소',
          Datetime: '제보시간',
        },
        {
          Content: '제보2',
          Latitude: 37.499463762912974,
          Longitude: 127.0288828824399,
          Address: '도로명주소',
          Datetime: '제보시간',
        },
        {
          Content: '제보3',
          Latitude: 37.49896834100913,
          Longitude: 127.02833986892401,
          Address: '도로명주소',
          Datetime: '제보시간',
        },
        {
          Content: '제보4',
          Latitude: 37.49893267508434,
          Longitude: 127.02673400572665,
          Address: '도로명주소',
          Datetime: '제보시간',
        },
        {
          Content: '제보5',
          Latitude: 37.49872543597439,
          Longitude: 127.02676785815386,
          Address: '도로명주소',
          Datetime: '제보시간',
        },
        {
          Content: '제보6',
          Latitude: 37.49813096097184,
          Longitude: 127.02591949495914,
          Address: '도로명주소',
          Datetime: '제보시간',
        },
        {
          Content: '제보7',
          Latitude: 37.497680616783086,
          Longitude: 127.02518427952202,
          Address: '도로명주소',
          Datetime: '제보시간',
        }
        ]

    return (
        <Wrapper>
            <Map // 지도를 표시할 Container
                center={{
                // 지도의 중심좌표
                lat: 37.4711,
                lng: 127.0151,
                }}
                style={{
                // 지도의 크기
                width: "100%",
                height: "450px",
                }}
                level={10} // 지도의 확대 레벨
            >
                <MarkerClusterer
                    averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
                    minLevel={8} // 클러스터 할 최소 지도 레벨
                >
                    {reportPositions.map((pos) => (
                        <MapMarker
                        key={`${pos.lat}-${pos.lng}`}
                        position={{
                            lat: pos.Latitude,
                            lng: pos.Longitude,
                        }}
                        />
                ))}
                </MarkerClusterer>
            </Map>
        </Wrapper>
    )
  }
  
  export default ReportClusterMap;