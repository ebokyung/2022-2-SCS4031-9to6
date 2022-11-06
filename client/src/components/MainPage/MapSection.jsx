/*global kakao*/
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { showSideBar } from '../../atoms';
import { useEffect, useState, useRef } from 'react';
import markerImage from '../../imgs/markerSprites.png';
import reportBtn from '../../imgs/reportBtn.png';
import reportPositionMarker from '../../imgs/reportPositionMarker.png';
import style from './map.module.css';
import {Map, MapMarker, CustomOverlayMap, useMap, ZoomControl} from 'react-kakao-maps-sdk';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { faXmark, faLocationDot, faUpload } from "@fortawesome/free-solid-svg-icons";

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

const ReportBtn = styled.button`
  width: 50px;
  height: 38px;
  border: none;
  position: absolute;
  bottom: 120px;
  right: 40px;
  z-index:10;
  background: url( ${reportBtn} ) no-repeat;
  cursor: pointer;
`

const Overlay = styled(motion.div)`
    width: 100%;
    height: 100%;
    position: fixed;
    top:0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 500;
    background-color: rgba(0, 0, 0, 0.7);
`;

const BigBox = styled.div`
    width: 40%;
    height: 40%;
    min-width: 540px;
    min-height: 250px;
    background-color: white;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    background-color: ${props=> props.theme.modalBackColor};
    /* div:last-child{
      margin-left: 65%;
    } */
`
const XMark = styled(FontAwesomeIcon)`
    font-size: 20px;
    position: absolute;
    top:20px;
    right: 20px;
    cursor: pointer;
`

const BoxTitle = styled.h1`
    /* font-family: 'Nanum Myeongjo', serif; */
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
`
const BoxSubTitle = styled.h6`
    /* font-family: 'Nanum Myeongjo', serif; */
    color : #262626;
    font-size: 11px;
    font-weight: 300;
    margin-bottom: 30px;
`
const BoxBody = styled.div`
  width: 70%;
  display: grid;
  grid-template-columns: 80px auto;
  row-gap: 0.5em;
  div {
    display: grid;
    grid-template-columns: auto 20px;
    /* justify-content: space-between; */
  }
`
const Btn = styled.button`
    width: fit-content;
    height: 20px;
    padding: 0 15px;
    margin-top: 2rem;
    background-color: ${props => props.theme.modalBtnColor};
    border: none;
    border-radius: 5px;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
`
const BoxBtn = styled(Btn)``
const PinBtn = styled(FontAwesomeIcon)`
  font-size: 1.2rem;
  cursor: pointer;
  color: ${props=> props.theme.modalBtnColor};
`
const ImgUploadBtn = styled(FontAwesomeIcon)`
  font-size: 1.2rem;
  cursor: pointer;
  color: ${props=> props.theme.modalBtnColor};
`

const ReportInput = styled.input`
  border: none;
  border-radius: 3px;
  padding: 0 10px;
  font-size: 10px;
  background-color: #dddddd;
  color: #A2A2A6;
  ::placeholder {
      color: #A2A2A6;
  }
  :focus {
      outline-color: ${props=> props.theme.modalBtnColor};
  }
`
const ReportTextArea = styled.textarea`
  border: none;
  border-radius: 3px;
  min-height: 35px;
  resize: none;
  padding: 10px;
  :focus {
      outline-color: ${props=> props.theme.modalBtnColor};
  }
`

function MapSection () {
    const visibility = useRecoilValue(showSideBar);
    const [openReportModal, setOpenReportModal] = useState(false);
    const [isReportMode, setIsReportMode] = useState(false);
    const [reportPosition, setReportPosition] = useState();
    const ref = useRef();
    const inputPositionRef = useRef();
    const inputImgRef = useRef();

    const handleReportModalBtn = () => {
      setOpenReportModal(prev=>!prev);
    }

    const handleReportPosition = () => {
      ref.current.style.zIndex = -1;
      setIsReportMode(true);
    }
    
    const submitReportPosition = () => {
      if (window.confirm('여기 위치에 제보하시겠습니까?')) {
        setIsReportMode(false);
        ref.current.style.zIndex = 500;
        console.log(reportPosition);
        inputPositionRef.current.value = `lat: ${reportPosition.lat} lng: ${reportPosition.lng}`
      }
    }

    const submitReportImage = () => {

    }

    //-------------------------------------------------------------------
    // cctv 마커가 표시될 좌표 배열입니다
  const cctvPositions = [
    {
      id: 1,
      name: 'cctv1',
      center: '서울교통',
      url: 'http://210.179.218.54:1935/live/333.stream/playlist.m3u8',
      lat: 37.497535461505684,
      lng: 127.02948149502778,
    },
    {
      id: 2,
      name: 'cctv2',
      center: '국가교통',
      url: 'http://210.179.218.54:1935/live/333.stream/playlist.m3u8',
      lat: 37.499590490909185, 
      lng: 127.0263723554437,
    },
    {
      id: 3,
      name: 'cctv3',
      center: '국가교통',
      url: 'http://210.179.218.54:1935/live/333.stream/playlist.m3u8',
      lat: 37.499427948430814, 
      lng: 127.02794423197847,
    },
    {
      id: 4,
      name: 'cctv4',
      center: '국가교통',
      url: 'http://210.179.218.52:1935/live/157.stream/playlist.m3u8',
      lat: 37.498553760499505, 
      lng: 127.02882598822454,
    },
    {
      id: 5,
      name: 'cctv5',
      center: '국가교통',
      url: 'http://210.179.218.52:1935/live/157.stream/playlist.m3u8',
      lat: 37.497625593121384, 
      lng: 127.02935713582038,
    },
    {
      id: 6,
      name: 'cctv6',
      center: '국가교통',
      url: 'http://210.179.218.52:1935/live/157.stream/playlist.m3u8',
      lat: 37.49646391248451, 
      lng: 127.02675574250912,
    },
    {
      id: 7,
      name: 'cctv7',
      center: '국가교통',
      url: 'http://210.179.218.51:1935/live/180.stream/playlist.m3u8',
      lat: 37.49629291770947, 
      lng: 127.02587362608637,
    },
    {
      id: 8,
      name: 'cctv8',
      center: '국가교통',
      url: 'http://210.179.218.51:1935/live/180.stream/playlist.m3u8',
      lat: 37.49754540521486, 
      lng: 127.02546694890695,
    }
  ]
  const cctvOrigin = { x: 110, y: 0 }

  // 대피소 마커가 표시될 좌표 배열입니다
  const safetyPositions = [
    {
      content: '대피소1',
      latlng: { lat: 37.497535461505684, lng: 127.02948149502778 },
    },
    {
      content: '대피소2',
      latlng: { lat: 37.49671536281186, lng: 127.03020491448352 },
    },
    {
      content: '대피소3',
      latlng: { lat: 37.496201943633714, lng: 127.02959405469642 },
    },
    {
      content: '대피소4',
      latlng: { lat: 37.49640072567703, lng: 127.02726459882308 },
    },
    {
      content: '대피소5',
      latlng: { lat: 37.49640098874988, lng: 127.02609983175294 },
    },
    {
      content: '대피소6',
      latlng: { lat: 37.49932849491523, lng: 127.02935780247945 },
    },
    {
      content: '대피소7',
      latlng: { lat: 37.49996818951873, lng: 127.02943721562295 },
    },
  ]
  const safetyOrigin = { x: 60, y: 0 }

  // 제보 마커가 표시될 좌표 배열입니다
  const reportPositions = [
  {
    content: '제보1',
    latlng: { lat: 37.49966168796031, lng: 127.03007039430118 },
  },
  {
    content: '제보2',
    latlng: { lat: 37.499463762912974, lng: 127.0288828824399 },
  },
  {
    content: '제보3',
    latlng: { lat: 37.49896834100913, lng: 127.02833986892401 },
  },
  {
    content: '제보4',
    latlng: { lat: 37.49893267508434, lng: 127.02673400572665 },
  },
  {
    content: '제보5',
    latlng: { lat: 37.49872543597439, lng: 127.02676785815386 },
  },
  {
    content: '제보6',
    latlng: { lat: 37.49813096097184, lng: 127.02591949495914 },
  },
  {
    content: '제보7',
    latlng: { lat: 37.497680616783086, lng: 127.02518427952202 },
  }
  ]
  const reportOrigin = { x: 10, y: 10 }
    //-------------------------------------------------------------------

  const [selectedCategory, setSelectedCategory] = useState("all")
  const spriteSize = { width: 392, height: 64 }

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

  // 마커별-인포위도우별 컴포넌트
  const EventMarkerContainer_safety = ( props ) => {
    const map = useMap()
    const [isVisible, setIsVisible] = useState(false)

    return (
      <>
      <MapMarker
        position={props.position} // 마커를 표시할 위치
        onClick={(marker) => { 
          map.panTo(marker.getPosition())
          setIsVisible(true)
        }}
        image={props.markerImage}
      />
        {isVisible && 
        <CustomOverlayMap position={props.position}>
          <div className={style.wrap}>
            <div className={style.info}>
              <div
                className={style.close}
                onClick={() => setIsVisible(false)}
                title="닫기"
              />
              <div className={style.body}>
                {props.content}
              </div>
            </div>
          </div>
        </CustomOverlayMap>}
      </>
    )
  }
  const EventMarkerContainer_report = ( props ) => {
    const map = useMap()
    const [isVisible, setIsVisible] = useState(false)

    return (
      <>
      <MapMarker
        position={props.position} // 마커를 표시할 위치
        onClick={(marker) => { 
          map.panTo(marker.getPosition())
          setIsVisible(true)
        }}
        image={props.markerImage}
      />
        {isVisible && 
        <CustomOverlayMap position={props.position}>
          <div className={style.wrap}>
            <div className={style.info}>
              <div className={style.title}>
                {props.address}
                <div
                  className={style.close}
                  onClick={() => setIsVisible(false)}
                  title="닫기"
                ></div>
              </div>
              <div className={style.body}>
                <div className={style.img}>
                  {/* <img
                    src={props.img}
                    width="100%" 
                    height="100%" 
                  /> */}이미지
                </div>
                <div className={style.desc}>
                  <span>
                    {props.content}
                  </span>
                  <span>
                    {props.time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CustomOverlayMap>}
      </>
    )
  }
  const EventMarkerContainer_cctv = ( props ) => {
    const map = useMap()
    const [isVisible, setIsVisible] = useState(false)

    return (
      <>
      <MapMarker
        position={props.position} // 마커를 표시할 위치
        onClick={(marker) => { 
          map.panTo(marker.getPosition())
          setIsVisible(true)
        }}
        image={props.markerImage}
      />
        {isVisible && <CustomOverlayMap position={props.position}>
          <div className={style.wrap}>
            <div className={style.info}>
              <div className={style.title}>
                <button>star</button>
                <span>{props.name}</span>
                <span className={style.class}>( 침수 0단계 )</span>
                <div
                  className={style.close}
                  onClick={() => setIsVisible(false)}
                  title="닫기"
                ></div>
              </div>
              <div className={style.body}>
                <div className={style.video}>
                  <ReactPlayer 
                    url={props.url}
                    width="100%" 
                    height="100%" 
                    muted={true}
                    playing={true} 
                    loop={true}
                  />
                </div>
                <div className={style.desc}>
                  <span>
                    <a
                      href="https://www.kakaocorp.com/main"
                      target="_blank"
                      className={style.link}
                      rel="noreferrer"
                    >
                      행동지침 바로가기
                    </a>
                  </span>
                  <span>
                    {props.center}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CustomOverlayMap>}
      </>
    )
  }


    return(
    <Container id={style.mapwrap} className={visibility ? '' : 'hide'}>
      
      {/* 지도 */}
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
          onClick={(_t, mouseEvent) => setReportPosition({
            lat: mouseEvent.latLng.getLat(),
            lng: mouseEvent.latLng.getLng(),
          })}
        >
          {/* 지도에 마커 그리기 */}
        {(selectedCategory === "all" || selectedCategory === "safety") &&
          safetyPositions.map((position) => (
            <EventMarkerContainer_safety
              key={`safety-${position.latlng.lat},${position.latlng.lng}`}
              position={position.latlng}
              content={position.content}
              markerImage={{
                src: markerImage,
                size: {width: 40, height: 40},
                options: {
                  spriteSize: spriteSize,
                  spriteOrigin: safetyOrigin,
                },
              }}
            />
          )
        )}
        {(selectedCategory === "all" || selectedCategory === "report") &&
          reportPositions.map((position) => (
            <EventMarkerContainer_report
              key={`report-${position.latlng.lat},${position.latlng.lng}`}
              position={position.latlng}
              address='도로명주소'
              time='제보시간'
              content={position.content}
              markerImage={{
                src: markerImage,
                size: {width: 40, height: 40},
                options: {
                  spriteSize: spriteSize,
                  spriteOrigin: reportOrigin,
                },
              }} 
            />
          )
        )}
        {(selectedCategory === "all" || selectedCategory === "cctv") &&
          cctvPositions.map((position) => (
            <EventMarkerContainer_cctv
              key={`cctv-${position.lat},${position.lng}`}
              position ={position}
              name={position.name}
              center={position.center}
              url={position.url}
              // cctv 마커 이미지
              markerImage={{
                src: markerImage,
                size: {width: 64, height: 64},
                options: {
                  spriteSize: spriteSize,
                  spriteOrigin: cctvOrigin,
                },
              }}
            />
          )
        )}

        {/* 지도에 제보 위치 표시하는 마커 */}
        {isReportMode && reportPosition &&
        <MapMarker // 마커를 생성합니다
          position={reportPosition}
          draggable={true} // 마커가 드래그 가능하도록 설정합니다
          image={{
            src: reportPositionMarker,
            size: {width: 64, height: 64},
          }}
          onMouseOut={submitReportPosition}
        />}

      </Map>

      {/* 4가지 마커 메뉴 */}
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

      {/* 제보 버튼 */}
      <ReportBtn 
        onClick={handleReportModalBtn}
      />
      {openReportModal ? 
        <Overlay 
            ref={ref}
            initial={{ opacity : 0}}
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
        >
            <BigBox>
                <XMark onClick = {() => setOpenReportModal(false)} icon={faXmark} />
                <BoxTitle>
                    제보 등록하기
                </BoxTitle>
                <BoxSubTitle>
                    * 허위 제보로 인한 피해는 책임을 물을 수 있습니다.
                </BoxSubTitle>
                <BoxBody>
                    <span>위치</span>
                    <div>
                      <ReportInput ref={inputPositionRef} placeholder="오른쪽 버튼를 눌러 위치를 설정해주세요. ->" readOnly></ReportInput>
                      <PinBtn onClick={handleReportPosition} icon={faLocationDot}/>
                    </div>
                    <span>사진</span>
                    <div>
                      <ReportInput type="file" accept="image/*" ref={inputImgRef} placeholder="오른쪽 버튼을 눌러 침수상황 사진을 업로드 해주세요. ->" readOnly></ReportInput>
                      <ImgUploadBtn icon={faUpload} />
                    </div>
                    <span>제보내용</span>
                    <ReportTextArea></ReportTextArea>
                </BoxBody>
                <BoxBtn>
                    제보하기
                </BoxBtn>
            </BigBox>
        </Overlay> : null}


    </Container>)
}
export default MapSection;