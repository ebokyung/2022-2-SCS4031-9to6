/*global kakao*/
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { showSideBar } from '../../atoms';
import { useEffect, useState } from 'react';
import markerImage from '../../imgs/markerSprites.png';
import style from './map.module.css';
import {Map, MapMarker} from 'react-kakao-maps-sdk';

const Container = styled.section`
    width: 100%;
    max-width: ${props => props.theme.maxWidth};
    min-height: ${props => props.theme.minHeight};
    padding-left: 460px;
    transition: all .5s;
    &.hide {
        padding-left: 0;
    }
`

function MapSection () {
    const visibility = useRecoilValue(showSideBar);

    const spriteSize = { width: 392, height: 64 }

    // cctv 마커가 표시될 좌표 배열입니다
  const cctvPositions = [
    { lat: 37.499590490909185, lng: 127.0263723554437 },
    { lat: 37.499427948430814, lng: 127.02794423197847 },
    { lat: 37.498553760499505, lng: 127.02882598822454 },
    { lat: 37.497625593121384, lng: 127.02935713582038 },
    { lat: 37.49646391248451, lng: 127.02675574250912 },
    { lat: 37.49629291770947, lng: 127.02587362608637 },
    { lat: 37.49754540521486, lng: 127.02546694890695 },
  ]
  const cctvOrigin = { x: 110, y: 0 }

  // 대피소 마커가 표시될 좌표 배열입니다
  const safetyPositions = [
    { lat: 37.497535461505684, lng: 127.02948149502778 },
    { lat: 37.49671536281186, lng: 127.03020491448352 },
    { lat: 37.496201943633714, lng: 127.02959405469642 },
    { lat: 37.49640072567703, lng: 127.02726459882308 },
    { lat: 37.49640098874988, lng: 127.02609983175294 },
    { lat: 37.49932849491523, lng: 127.02935780247945 },
    { lat: 37.49996818951873, lng: 127.02943721562295 },
  ]
  const safetyOrigin = { x: 60, y: 0 }

  // 제보 마커가 표시될 좌표 배열입니다
  const reportPositions = [
    { lat: 37.49966168796031, lng: 127.03007039430118 },
    { lat: 37.499463762912974, lng: 127.0288828824399 },
    { lat: 37.49896834100913, lng: 127.02833986892401 },
    { lat: 37.49893267508434, lng: 127.02673400572665 },
    { lat: 37.49872543597439, lng: 127.02676785815386 },
    { lat: 37.49813096097184, lng: 127.02591949495914 },
    { lat: 37.497680616783086, lng: 127.02518427952202 },
  ]
  const reportOrigin = { x: 10, y: 10 }

    const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    const allMenu = document.getElementById("allMenu")
    const cctvMenu = document.getElementById("cctvMenu")
    const safetyMenu = document.getElementById("safetyMenu")
    const reportMenu = document.getElementById("reportMenu")

    if (selectedCategory === "all") {
      // 모두 카테고리를 선택된 스타일로 변경하고
      allMenu.className = `${style.menu_selected}`

      // cctv, 대피소와 제보 카테고리는 선택되지 않은 스타일로 바꿉니다
      cctvMenu.className = ""
      safetyMenu.className = ""
      reportMenu.className = ""
    } else if (selectedCategory === "cctv") {
      // cctv 카테고리를 선택된 스타일로 변경하고
      cctvMenu.className = `${style.menu_selected}`

      // 모두, 대피소와 제보 카테고리는 선택되지 않은 스타일로 바꿉니다
      allMenu.className = ""
      safetyMenu.className = ""
      reportMenu.className = ""
    }else if (selectedCategory === "safety") {
      // 대피소 카테고리가 클릭됐을 때

      // 대피소 카테고리를 선택된 스타일로 변경하고
      allMenu.className = ""
      cctvMenu.className = ""
      safetyMenu.className = `${style.menu_selected}`
      reportMenu.className = ""
    } else if (selectedCategory === "report") {
      // 제보 카테고리가 클릭됐을 때

      // 제보 카테고리를 선택된 스타일로 변경하고
      allMenu.className = ""
      cctvMenu.className = ""
      safetyMenu.className = ""
      reportMenu.className = `${style.menu_selected}`
    }
  }, [selectedCategory])

    return(
    <Container id={style.mapwrap} className={visibility ? '' : 'hide'}>
        <Map id='map'
            center={{
              // 지도의 중심좌표
              lat: 37.498004414546934,
              lng: 127.02770621963765,
            }}
            style={{
              // 지도의 크기
              width: "100%",
              height: "100%",
            }}
            level={5}
          >
          {(selectedCategory === "all" || selectedCategory === "safety") &&
            safetyPositions.map((position) => (
              <MapMarker
                key={`safety-${position.lat},${position.lng}`}
                position={position}
                image={{
                  src: markerImage,
                  size: {width: 40, height: 40},
                  options: {
                    spriteSize: spriteSize,
                    spriteOrigin: safetyOrigin,
                  },
                }}
              />
            ))}
          {(selectedCategory === "all" || selectedCategory === "report") &&
            reportPositions.map((position) => (
              <MapMarker
                key={`report-${position.lat},${position.lng}`}
                position={position}
                image={{
                  src: markerImage,
                  size: {width: 40, height: 40},
                  options: {
                    spriteSize: spriteSize,
                    spriteOrigin: reportOrigin,
                  },
                }}
              />
            ))}
            {(selectedCategory === "all" || selectedCategory === "cctv") &&
            cctvPositions.map((position) => (
              <MapMarker
                key={`cctv-${position.lat},${position.lng}`}
                position={position}
                image={{
                  src: markerImage,
                  size: {width: 64, height: 64},
                  options: {
                    spriteSize: spriteSize,
                    spriteOrigin: cctvOrigin,
                  },
                }}
              />
            ))}
        </Map>
        <div className={`${style.category}`}>
          <ul>
            <li id="allMenu" onClick={() => setSelectedCategory("all")}>
              <span className={`${style.ico_comm} ${style.ico_all}`}></span>
              모두
            </li>
            <li id="cctvMenu" onClick={() => setSelectedCategory("cctv")}>
              <span className={`${style.ico_comm} ${style.ico_cctv}`}></span>
              CCTV
            </li>
            <li id="safetyMenu" onClick={() => setSelectedCategory("safety")}>
              <span className={`${style.ico_comm} ${style.ico_safety}`}></span>
              대피소
            </li>
            <li id="reportMenu" onClick={() => setSelectedCategory("report")}>
              <span className={`${style.ico_comm} ${style.ico_report}`}></span>
              제보
            </li>
          </ul>
        </div>
    </Container>)
}
export default MapSection;