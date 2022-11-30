import styled from 'styled-components';
import style from './map.module.css';
import { useEffect, useState} from 'react';
import {MapMarker, CustomOverlayMap, useMap} from 'react-kakao-maps-sdk';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
// import { useRecoilState } from 'recoil';
// import { setBookmark } from '../../../atoms';
import { LogAPI } from '../../../axios';

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
    const map = useMap()
    const [isVisible, setIsVisible] = useState(false)
    const [isMarked, setIsMarked] = useState(props.isMarked);
    // const [bookmarkList, setBookmarkList] = useRecoilState(setBookmark);

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
          await LogAPI.delete(`/Bookmark/${user}/${props.cctvId}`);
        }
      } catch(e) {
        console.log(e)
      }
    }


    return (
      <>
      <MapMarker
        position={props.position} // 마커를 표시할 위치
        onClick={(marker) => { 
          map.panTo(marker.getPosition())
          setIsVisible(true)
          props.onClick() // 클릭된 마커의 index 설정
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
                <span>
                  {props.isBookmarkActive ? 
                      <ItemStar icon={faStar} isMarked={isMarked} onClick={()=>onStar()}/> 
                      // <ItemStar icon={faStar} style={{color : "#b7b7b7"}} onClick={()=>onStar(props.cctvId)}/> 
                      : <ItemStar icon={faStar} isMarked={false} onClick={()=>alert('로그인시 이용가능합니다.')}/> 
                  }
                </span>
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