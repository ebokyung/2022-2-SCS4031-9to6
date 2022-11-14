/*global kakao*/
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { showSideBar } from '../../atoms';
import { useEffect, useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import markerImage from '../../imgs/markerSprites.png';
import reportBtn from '../../imgs/reportBtn.png';
import reportPositionMarker from '../../imgs/reportPositionMarker.png';
import style from './map.module.css';
import {Map, MapMarker, CustomOverlayMap, useMap, ZoomControl} from 'react-kakao-maps-sdk';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { faXmark, faLocationDot, faUpload } from "@fortawesome/free-solid-svg-icons";
import { API } from '../../axios';

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

const BigBox = styled.form`
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
  grid-template-columns: 70px auto;
  row-gap: 0.5em;
  margin-bottom: 30px;
  div {
    display: grid;
    grid-template-columns: auto 20px;
  }
  span{
    padding-top: 0.2rem;
    font-size: 13px;
  }
`
const Btn = styled.button`
    width: 20%;
    height: 20px;
    padding: 0 20px;
    /* margin: auto; */
    background-color: ${props => props.theme.modalBtnColor};
    border: none;
    border-radius: 5px;
    font-size: 12px;
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
  margin-right: 0.5rem;
  font-size: 11px;
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

const ShelterInfowindowBody =styled.div`
  width: 90%;
  margin: 10px auto;
  display: grid;
  grid-template-columns: 40px 1fr;
  row-gap: 0.5em;
  /* span{
    white-space: wrap;
  } */
`

function MapSection () {
    const visibility = useRecoilValue(showSideBar);
    const [cctvPositions, setCctvPositions] = useState([]);
    const [shelterPositions, setShelterPositions] = useState([]);
    const [reportPositions, setReportPositions] = useState([]);
    
    const [isReportMode, setIsReportMode] = useState(false);
    const [reportPosition, setReportPosition] = useState();

    const modalOverlayRef = useRef();
    const inputPositionAddrRef = useRef();
    const inputImgRef = useRef();
    const inputImgNameRef = useRef();

    const { register, handleSubmit, setValue } = useForm();

    // GET
    const getdata = async() => {
      try{
          const cctvData = await API.get("/cctvs");
          const shelterData = await API.get("/Shelters");
          const reportData = await API.get("/Postings");
          setCctvPositions(cctvData.data.cctv);
          setShelterPositions(shelterData.data);
          setReportPositions(reportData.data);
          // console.log(cctvData.data.cctv)
          // console.log(shelterData.data)
          // console.log(reportData.data)
      }catch(error){
          console.log(error)
      }
    }

    useEffect(()=>{
        getdata();
    },[])

    // POST
    const onValid = async(data) => {
      console.log(data.ImageFile);
      const result = {
          // "MemberID": "(회원 아이디, 로그인 안했을 경우 요청X)",
          "Address": inputPositionAddrRef.current.value,
          "Latitude": reportPosition.lat,
          "Longitude": reportPosition.lng,
          "ImageFile": data.ImageFile,
          "Content": data.Content,
      }
      console.log(result);
      try{
          await API.post("/Postings", result, {
            headers: {
              "Content-Type": `multipart/form-data`,
            },
          })
          .then(
              response => {
                  console.log(response);
              }
          )
          const data = await API.get("/Postings");
          // console.log(data.data);
          setReportPositions(data.data);
      }catch(error){
          console.log(error)
      }
      // setValue("Content", "")
      setIsReportMode(prev => !prev);
  }

    const handleReportModalBtn = () => {
      setIsReportMode(prev=>!prev);
    }

    const handleReportPosition = () => {
      modalOverlayRef.current.style.zIndex = -1;
    }

    function getAddr(lat,lng){
      // 주소-좌표 변환 객체를 생성합니다
      let geocoder = new kakao.maps.services.Geocoder();
   
      let coord = new kakao.maps.LatLng(lat, lng);
      let callback = function(result, status) {
          if (status === kakao.maps.services.Status.OK) {
              const arr  ={ ...result};
              const _arr = arr[0].address.address_name;
              // console.log(_arr); 
              inputPositionAddrRef.current.value = _arr;
          }
     }
      geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
   }

    useEffect (()=>{
      setReportPosition(null)
    }, [isReportMode])
    
    const submitReportPosition = () => {
      if (window.confirm('여기 위치에 제보하시겠습니까?')) {
        modalOverlayRef.current.style.zIndex = 500;
        getAddr(reportPosition.lat, reportPosition.lng);
      }
    }

    const onUploadImageButtonClick = (e) => {
      e.preventDefault();
      inputImgRef.current.click();
    }

    const onUploadImage = (e) => {
      // e.preventDefault();
      setValue('ImageFile', e.target.files[0]);
      inputImgNameRef.current.value = e.target.files[0].name;
    }

  const cctvOrigin = { x: 110, y: 0 }
  const shelterOrigin = { x: 60, y: 0 }
  const reportOrigin = { x: 10, y: 10 }

  const [selectedCategory, setSelectedCategory] = useState("all")
  const spriteSize = { width: 392, height: 64 }

  useEffect(() => {
    const allMenu = document.getElementById("allMenu")
    const cctvMenu = document.getElementById("cctvMenu")
    const shelterMenu = document.getElementById("shelterMenu")
    const reportMenu = document.getElementById("reportMenu")

    if (selectedCategory === "all") {
      // 모두 카테고리를 선택된 스타일로 변경하고
      allMenu.className = `${style.menu_selected}`

      // cctv, 대피소와 제보 카테고리는 선택되지 않은 스타일로 바꿉니다
      cctvMenu.className = ""
      shelterMenu.className = ""
      reportMenu.className = ""
    } else if (selectedCategory === "cctv") {
      // cctv 카테고리를 선택된 스타일로 변경하고
      cctvMenu.className = `${style.menu_selected}`

      // 모두, 대피소와 제보 카테고리는 선택되지 않은 스타일로 바꿉니다
      allMenu.className = ""
      shelterMenu.className = ""
      reportMenu.className = ""
    }else if (selectedCategory === "shelter") {
      // 대피소 카테고리가 클릭됐을 때

      // 대피소 카테고리를 선택된 스타일로 변경하고
      allMenu.className = ""
      cctvMenu.className = ""
      shelterMenu.className = `${style.menu_selected}`
      reportMenu.className = ""
    } else if (selectedCategory === "report") {
      // 제보 카테고리가 클릭됐을 때

      // 제보 카테고리를 선택된 스타일로 변경하고
      allMenu.className = ""
      cctvMenu.className = ""
      shelterMenu.className = ""
      reportMenu.className = `${style.menu_selected}`
    }
  }, [selectedCategory])

  // 마커별 인포위도우 컴포넌트
  // 대피소 마커 인포윈도우
  const EventMarkerContainer_shelter = ( props ) => {
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
          <div className={style.wrap} style={{height: '140px'}}>
            <div className={style.info} style={{height: '130px'}}>
              <div
                className={style.close}
                onClick={() => setIsVisible(false)}
                title="닫기"
              />
              <div className={style.title}>
                {props.name}
              </div>
              <div className={style.body}>
                <ShelterInfowindowBody>
                  <span>위치:</span><span>{props.address}</span>
                  <span>시설:</span><span>{props.type}</span>
                  <span>규모:</span><span>{props.area}</span>
                </ShelterInfowindowBody>
              </div>
            </div>
          </div>
        </CustomOverlayMap>}
      </>
    )
  }
  // 제보 마커 인포윈도우
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
                  <img
                    src={props.image}
                    width="100%" 
                    height="100%" 
                  />
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
  // cctv 마커 인포윈도우
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
      <Map
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
          onClick={isReportMode ? 
            (_t, mouseEvent) => { 
            setReportPosition({
              lat: mouseEvent.latLng.getLat(),
              lng: mouseEvent.latLng.getLng(),
            }) 
          } : undefined }
        >
          {/* 지도에 마커 그리기 */}
        {(selectedCategory === "all" || selectedCategory === "shelter") &&
          shelterPositions.map((position) => (
            <EventMarkerContainer_shelter
              key={`shelter-${position.Latitude},${position.Longitude}`}
              position={{lat: position.Latitude , lng: position.Longitude} }
              address={position.Address}
              name={position.Name}
              type={position.Type}
              area={position.Area}
              markerImage={{
                src: markerImage,
                size: {width: 40, height: 40},
                options: {
                  spriteSize: spriteSize,
                  spriteOrigin: shelterOrigin,
                },
              }}
            />
          )
        )}
        {(selectedCategory === "all" || selectedCategory === "report") &&
          reportPositions.map((position) => (
            <EventMarkerContainer_report
              key={`report-${position.Latitude},${position.Longitude}`}
              position={{lat: position.Latitude , lng: position.Longitude}}
              address={position.Address}
              time={position.Datetime}
              content={position.Content}
              image={position.ImageURL}
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
              key={`cctv-${position.Latitude},${position.Longitude}`}
              position ={{lat: position.Latitude , lng: position.Longitude}}
              name={position.Name}
              center={position.Center}
              url={position.URL}
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
          onMouseOut={()=> submitReportPosition()} // 마우스가 마커를 벗어나면 위치가 설정됩니다
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
          <li id="shelterMenu" onClick={() => setSelectedCategory("shelter")}>
            <span className={`${style.ico_comm} ${style.ico_shelter}`}></span>
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
      {isReportMode ? 
        <Overlay 
            ref={modalOverlayRef}
            initial={{ opacity : 0}}
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
        >
            <BigBox onSubmit={handleSubmit(onValid)}>
            {/* <BigBox> */}
                <XMark onClick = {() => setIsReportMode(false)} icon={faXmark} />
                <BoxTitle>
                    제보 등록하기
                </BoxTitle>
                <BoxSubTitle>
                    * 허위 제보로 인한 피해는 책임을 물을 수 있습니다.
                </BoxSubTitle>
                <BoxBody>
                    <span>위치</span>
                    <div>
                      <ReportInput 
                        type="text"
                        ref={inputPositionAddrRef} 
                        placeholder="오른쪽 버튼를 눌러 위치를 설정해주세요." 
                        disabled />
                      <PinBtn onClick={handleReportPosition} icon={faLocationDot}/>
                    </div>
                    <span>사진</span>
                    <div>
                      <ReportInput 
                        placeholder="오른쪽 버튼을 눌러 침수상황 사진을 업로드 해주세요." 
                        ref={inputImgNameRef}
                        disabled />
                      <input 
                        {...register("ImageFile", {required : true})}
                        type="file" 
                        accept="image/*" 
                        style={{display: 'none'}}
                        ref={inputImgRef} 
                        onChange={onUploadImage}
                        // multiple="multiple"
                        />
                      <ImgUploadBtn 
                        icon={faUpload} 
                        onClick={onUploadImageButtonClick}
                      />
                    </div>
                    <span>제보내용</span>
                    <ReportTextArea
                        {...register("Content", {required : true})}
                    />
                </BoxBody>
                <BoxBtn>
                    제보하기
                </BoxBtn>
            </BigBox>
        </Overlay> 
        : null}


    </Container>)
}
export default MapSection;