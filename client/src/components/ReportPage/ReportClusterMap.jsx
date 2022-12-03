import styled from 'styled-components';
import {Map, MarkerClusterer, MapMarker} from 'react-kakao-maps-sdk';

const Wrapper = styled.body`
    width: 100%;
    height: 500px;
    display: flex;
    justify-content: center;
    /* margin-top: ${props => props.theme.navMarginTop}; */
`

function ReportClusterMap({posts}) {

    return (
        <Wrapper>
            <Map // 지도를 표시할 Container
                center={{
                // 지도의 중심좌표
                lat: 37.5085,
                lng: 126.9771,
                }}
                style={{
                // 지도의 크기
                width: "100%",
                height: "450px",
                }}
                level={9} // 지도의 확대 레벨
            >
                <MarkerClusterer
                    averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
                    minLevel={8} // 클러스터 할 최소 지도 레벨
                >
                    {posts.map((position) => (
                        <MapMarker
                        key={`${position.lat}-${position.lng}`}
                        position={{
                            lat: position.Latitude,
                            lng: position.Longitude,
                        }}
                        />
                ))}
                </MarkerClusterer>
            </Map>
        </Wrapper>
    )
  }
  
  export default ReportClusterMap;