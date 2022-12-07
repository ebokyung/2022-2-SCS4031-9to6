import styled from 'styled-components';
import style from './map.module.css';
import { useEffect, useState, useContext} from 'react';
import {MapMarker, CustomOverlayMap, useMap} from 'react-kakao-maps-sdk';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
// import { useRecoilState } from 'recoil';
// import { setBookmark } from '../../../atoms';
import { LogAPI, API } from '../../../axios';
import markerImage from '../../../imgs/markerSprites.png';
import {SocketContext} from '../../../socketio';

const ShelterInfowindowBody =styled.div`
  width: 90%;
  margin: 10px auto;
  display: grid;
  grid-template-columns: 40px 1fr;
  row-gap: 0.5em;
`
const ItemStar = styled(FontAwesomeIcon)`
    cursor: pointer;
    font-size: 15px;
    transition: all 0.3s;
    color: ${props => props.isMarked ? "#FFA000" : "#b7b7b7"};
`
  
  // 마커별 인포위도우의 내용과 모양이 다르기 때문에 각 컴포넌트 생성

  // 대피소 마커 & 인포윈도우
  export const EventMarkerContainer_shelter = ( props ) => {
    const map = useMap()
    const [isVisible, setIsVisible] = useState(false)

    return (
      <>
      <MapMarker
        position={props.position} // 마커를 표시할 위치
        onClick={(marker) => {
          map.panTo(marker.getPosition())
          setIsVisible(true)
          props.onClick()
        }}
        image={props.markerImage}
      />
        {isVisible && props.isClicked &&
        <CustomOverlayMap 
            position={props.position}
            zIndex={10}
        >
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


  // 제보 마커 & 인포윈도우
  export const EventMarkerContainer_report = ( props ) => {
    const map = useMap()
    const [isVisible, setIsVisible] = useState(false)

    return (
      <>
      <MapMarker
        position={props.position} // 마커를 표시할 위치
        onClick={(marker) => { 
          map.panTo(marker.getPosition())
          setIsVisible(true)
          props.onClick()
        }}
        image={props.markerImage}
      />
        {isVisible && props.isClicked && 
        <CustomOverlayMap 
            position={props.position}
            zIndex={10}
        >
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


  // cctv 마커 & 인포윈도우
  const user = JSON.parse(sessionStorage.getItem("token"));

  export const EventMarkerContainer_cctv = ( props ) => {
  const socket = useContext(SocketContext);

    const map = useMap()
    const [isVisible, setIsVisible] = useState(false)
    const [isMarked, setIsMarked] = useState(props.isMarked);
    // const [bookmarkList, setBookmarkList] = useRecoilState(setBookmark);
    const [nowStage, setNowStage] = useState(0);

    const onStar = async() => {
      setIsMarked(prev=>!prev)
      const result = {
        'memberID1': user.ID,
        'cctvID1': props.cctvId,
        'URL1': props.url,
        'cctvName1': props.name,
      }
      try {
        if(!isMarked){ 
          // setBookmarkList(prev => [...prev, result])
          await LogAPI.post('/Bookmark', result);
        } else {
          // setBookmarkList(prev => (
          //   prev.filter(i => i.cctvID !== props.cctvId)
          // ))
          await LogAPI.delete(`/Bookmark/${user.ID}/${props.cctvId}`);
        }
      } catch(e) {
        console.log(e)
      }
    }

    const getStage = async() => {
      try{
        const data = await API.get(`/cctvs/status/${props.cctvId}`);
        // console.log(data.data);
        setNowStage(data.data.FloodingStage);
      } catch(e) {
        console.log(e)
      }
    }

    useEffect(()=>{
      getStage()
      socket.on("notification", (data) => {
          console.log(`cctv marker get요청할것 : ${data}`);
          //cctv get요청 다시
          getStage();
      });
    },[])

            

    let cctvOrigin = nowStage === 0 ? { x: 110, y: 0 } 
                        : nowStage === 1 || nowStage === 9 ? { x: 184, y: 0 }
                        : nowStage === 2 ? { x: 248, y: 0 }
                        : nowStage === 3 ? { x: 318, y: 0 } : { x: 110, y: 0 }


    return (
      <>
      <MapMarker
        position={props.position} // 마커를 표시할 위치
        onClick={(marker) => { 
          map.panTo(marker.getPosition())
          setIsVisible(true)
          props.onClick() // 클릭된 마커의 index 설정
        }}
        image={{
            src: markerImage,
            size: {width: 64, height: 64},
            options: {
              spriteSize: { width: 392, height: 64 },
              spriteOrigin: cctvOrigin,
            },
          }}
      />
        {isVisible && props.isClicked &&
        <CustomOverlayMap 
            position={props.position}
            zIndex={10}
        >
          <div className={style.wrap}>
            <div className={style.info}>
              <div className={style.title}>
                <span>
                  {props.isBookmarkActive ? 
                      <ItemStar icon={faStar} isMarked={isMarked} onClick={()=>onStar()}/> 
                      // <ItemStar icon={faStar} style={{color : "#b7b7b7"}} onClick={()=>onStar(props.cctvId)}/> 
                      : <ItemStar icon={faStar} isMarked={false} onClick={()=>alert('로그인시 이용가능합니다.')}/> 
                  }
                </span>
                <span>{props.name}</span>
                <span className={style.class}>{nowStage === 9 ? '( 침수 감지 )' : `( 침수 ${nowStage} 단계 )`}</span>
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
                      href="https://www.safekorea.go.kr/idsiSFK/neo/sfk/cs/contents/prevent/prevent21.html?menuSeq=126"
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