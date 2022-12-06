/*global kakao*/
import styled from 'styled-components';
import { useRecoilValue, useRecoilState } from 'recoil';
import { showSideBar, setBookmark } from '../../../atoms';
import { useEffect, useState, useRef } from 'react';
import { useForm } from "react-hook-form";
import markerImage from '../../../imgs/markerSprites.png';
import reportBtn from '../../../imgs/reportBtn.png';
import reportPositionMarker from '../../../imgs/reportPositionMarker.png';
import style from './map.module.css';
import {Map, MapMarker, ZoomControl} from 'react-kakao-maps-sdk';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { faXmark, faLocationDot, faUpload } from "@fortawesome/free-solid-svg-icons";
import { API, LogAPI } from '../../../axios';
import { EventMarkerContainer_cctv, EventMarkerContainer_shelter, EventMarkerContainer_report } from './markerContainer';

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
`
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
    box-shadow: rgba(0, 0, 0, 0.4) 0px 5px 10px;
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
const BoxSubTitle = styled.div`
    /* font-family: 'Nanum Myeongjo', serif; */
    color : #262626;
    font-size: 0.5rem;
    font-weight: 300;
    /* margin-bottom: 30px; */
    height: 48px;
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
const BoxBtn = styled.button`
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
const AlertP = styled.p`
    margin: 10px auto;
    font-weight: 400;
    font-size: 0.6rem;
    text-align: center;
    color: red;
`

function MapSection () {
    const visibility = useRecoilValue(showSideBar);

    const logCheck = localStorage.getItem("token") || sessionStorage.getItem("token");
    const [bookmarkList, setBookmarkList] = useRecoilState(setBookmark);
    const bookmarkArray = useRecoilValue(setBookmark);

    const [selectedCategory, setSelectedCategory] = useState("all");

    // 마커 이미지(sprite)
    const spriteSize = { width: 392, height: 64 }
    // const cctvOrigin = { x: 110, y: 0 }
    const shelterOrigin = { x: 60, y: 0 }
    const reportOrigin = { x: 10, y: 10 }

    // 각 마커별 전체 데이터 받아 올 변수
    const [cctvPositions, setCctvPositions] = useState([]); // cctv 마커 전체 (첫 렌더링때, 단계 변할때?)
    const [shelterPositions, setShelterPositions] = useState([]); // 대피소 마커 전체 (첫 렌더링때만)
    const [reportPositions, setReportPositions] = useState([]); // 제보 마커 전체 (첫 렌더링, 제보 바뀔때)
    
    // 모든 마커 중 클릭된 마커 하나의 인포윈도우만 열기 위한 상태변수
    const [selectedMarkerCctv, setSeleteMarkerCctv] = useState();
    const [selectedMarkerShelter, setSeleteMarkerShelter] = useState();
    const [selectedMarkerReport, setSeleteMarkerReport] = useState();

    // 제보 등록 관련 변수들
    const [isReportMode, setIsReportMode] = useState(false); // 제보등록 모드 여부 (boolean)
    const modalOverlayRef = useRef(); // 제보등록 모달창 참조 
    const [reportCoord, setReportCoord] = useState(); // 제보할 좌표 값 (object) { lat: number, lng: number }
    const inputImgRef = useRef();   // 파일 탐색기가 작동되고 실제 이미지 파일을 가지는 (사용자에게 안보이는) 인풋창 참조
    const inputImgNameRef = useRef(); // 이미지 이름을 보여주기 위한 (사용자에게 보여지는)인풋창 참조
    const { register, handleSubmit, setValue, formState: { errors }, clearErrors } = useForm();

    // API 연결 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // 마커 데이터 GET
    const getdata = async() => {
      try{
          const shelterData = await API.get("/Shelters");
          const reportData = await API.get("/Postings");
          setShelterPositions(shelterData.data);
          setReportPositions(reportData.data);
          // console.log(shelterData.data)
          // console.log(reportData.data)
      }catch(error){
          console.log(error)
      }
    }

    const getCctvData = async() => {
      try {
          const cctvData = await API.get("/cctvs");
          setCctvPositions(cctvData.data.cctv);
          // console.log(cctvData.data.cctv)
      } catch(e) {
        console.log(e)
      }
    }

    const user = JSON.parse(sessionStorage.getItem("token"));

    const getBookmarkData = async() => {
      try{
          const bookmarkData = await LogAPI.get(`/Bookmark/${user.ID}`);
          // console.log(bookmarkData.data.Bookmark);
          setBookmarkList(bookmarkData.data.Bookmark);
        }catch(error){
          console.log(error)
      }
    }
    useEffect(()=>{
        if(logCheck) { 
          getBookmarkData(); 
        }
        getdata();
        getCctvData();
    },[])

    // useEffect(()=>{
    //   console.log(bookmarkArray);
    // },[bookmarkList]);

    // 제보 등록 POST & 전체 제보 데이터 GET
    const onValid = async(data) => {
      const result = logCheck ? {
          "MemberID": user.ID,
          "Address": data.Address,
          "Latitude": reportCoord.lat,
          "Longitude": reportCoord.lng,
          "ImageFile": data.ImageFile,
          "Content": data.Content,
      } : {
        "Address": data.Address,
        "Latitude": reportCoord.lat,
        "Longitude": reportCoord.lng,
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
          // 등록 후 데이터 다시 불러오기
          const data = await API.get("/Postings");
          setReportPositions(data.data);
          setIsReportMode(prev => !prev);
      }catch(error){
          console.log(error)
      }
  }
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



  // 카테고리 변경 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



  // 제보등록 관련 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // 제보위치 설정을 위해 모달창 잠깐 내리기
    const handleReportPosition = () => {
      modalOverlayRef.current.style.zIndex = -1;
    }

    // 좌표 -> 주소 변환하기 
    function getAddr(lat,lng){
      let geocoder = new kakao.maps.services.Geocoder();
   
      let coord = new kakao.maps.LatLng(lat, lng);
      let callback = function(result, status) {
          if (status === kakao.maps.services.Status.OK) {
              const arr  ={ ...result};
              const _arr = arr[0].address.address_name;
              setValue("Address", _arr);
              // clearErrors('Address');
          }
     }
      geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
   }

    // 
    const submitReportPosition = () => {
      if (window.confirm('여기 위치에 제보하시겠습니까?')) {
        modalOverlayRef.current.style.zIndex = 500;
        getAddr(reportCoord.lat, reportCoord.lng);
      }
    }

    const onUploadImageButtonClick = (e) => {
      e.preventDefault();
      inputImgRef.current.click();
    }

    const onUploadImage = (e) => {
      // e.preventDefault();
      setValue('ImageFile', e.target.files[0]);
      // clearErrors('ImageFile');
      inputImgNameRef.current.value = e.target.files[0].name;
    }

    // 제보등록 모달창이 닫히면 ... 으로 하고 싶은데, 일단 모드 바뀔때마다 인풋창 리셋
    useEffect (()=>{ 
      setReportCoord(null); // 제보할 좌표 
      setValue("Address", '');
      setValue("ImageFile", null);
      setValue("Content", '');
      clearErrors(['Address','ImageFile','Content']);
    }, [isReportMode])
  
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



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
            setReportCoord({
              lat: mouseEvent.latLng.getLat(),
              lng: mouseEvent.latLng.getLng(),
            }) 
          } : undefined }
        >
          {/* 지도에 마커 그리기 */}
          {/* 지도에 마커 그리기 - 대피소 */}
        {(selectedCategory === "all" || selectedCategory === "shelter") &&
          shelterPositions.map((position, index) => (
            <EventMarkerContainer_shelter
              key={`shelter-${index}`}
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
              index={index}
              onClick={()=>setSeleteMarkerShelter(index)}
              isClicked={selectedMarkerShelter === index}
            />
          )
        )}
        {/* 지도에 마커 그리기 - 제보 */}
        {(selectedCategory === "all" || selectedCategory === "report") &&
          reportPositions.map((position, index) => (
            <EventMarkerContainer_report
              key={`report-${index}`}
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
              index={index}
              onClick={()=>setSeleteMarkerReport(index)}
              isClicked={selectedMarkerReport === index}
            />
          )
        )}
        {/* 지도에 마커 그리기 - cctv */}
        {(selectedCategory === "all" || selectedCategory === "cctv") &&
          cctvPositions.map((position, index) => (
            <EventMarkerContainer_cctv
              key={`cctv-${index}`}
              position ={{lat: position.Latitude , lng: position.Longitude}}
              name={position.Name}
              cctvId={position.ID}
              center={position.Center}
              url={position.URL}
              // markerImage={{
              //   src: markerImage,
              //   size: {width: 64, height: 64},
              //   options: {
              //     spriteSize: spriteSize,
              //     spriteOrigin: cctvOrigin,
              //   },
              // }}
              index={index}
              onClick={()=>setSeleteMarkerCctv(index)}
              isClicked={selectedMarkerCctv === index}
              isBookmarkActive={logCheck}
              isMarked={()=>(
                bookmarkArray.filter((i)=>(i.cctvID === position.ID)).length > 0
              )}
            />
          )
        )}

        {/* 제보등록할때, 지도에 제보 위치 표시하는 마커 */}
        {isReportMode && reportCoord &&
        <MapMarker // 마커를 생성합니다
          position={reportCoord}
          draggable={true} // 마커가 드래그 가능하도록 설정합니다
          image={{
            src: reportPositionMarker,
            size: {width: 64, height: 64},
          }}
          onMouseOut={()=> submitReportPosition()} // 마우스가 마커를 벗어나면 위치가 설정됩니다
        />}

      </Map>

      {/* 4가지 마커 카테고리 */}
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

      {/* 제보등록 버튼 */}
      <ReportBtn 
        onClick={()=>setIsReportMode(true)}
      />
      {isReportMode ? 
        <Overlay 
            ref={modalOverlayRef}
            initial={{ opacity : 0}}
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
        >
          <BigBox onSubmit={handleSubmit(onValid)}>
              <XMark onClick = {()=>setIsReportMode(false)} icon={faXmark} />
              <BoxTitle>
                  제보 등록하기
              </BoxTitle>
              <BoxSubTitle>
                  * 허위 제보로 인한 피해는 책임을 물을 수 있습니다.
                <AlertP>{errors?.Address?.message || errors?.ImageFile?.message || errors?.Content?.message}</AlertP>
              </BoxSubTitle>
              <BoxBody>
                  <span>위치</span>
                  <div>
                    <ReportInput 
                      {...register("Address", {required : '* 제보할 위치를 설정해 주세요.'})}
                      type="text"
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
                      {...register("ImageFile", {required : '* 침수상황을 알 수 있도록 사진을 첨부해 주세요.'})}
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
                      {...register("Content", {required : '* 제보 내용을 입력해 주세요.'})}
                  />
              </BoxBody>
              <BoxBtn>
                  제보하기
              </BoxBtn>
          </BigBox>
        </Overlay> : null}


    </Container>)
}
export default MapSection;