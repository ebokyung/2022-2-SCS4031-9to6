import styled from 'styled-components';
import ToggleSection from '../components/MainPage/sidebar/ToggleSection';
import MapSection from '../components/MainPage/map/MapSection';

const Wrapper = styled.body`
    width: 100vw;
    display: flex;
    justify-content: center;
    margin-top: ${props => props.theme.navMarginTop};
`

function MainPage () {

    // const { pathname } = useLocation();

    // useEffect(() => {
    //     if(pathname === '/chat' ) {
    //         console.log(socketValue);
    //         const socket =  io("http://localhost:5000", { transports: ["websocket"] } );
    //         socketValue.on('connect', (data) => { // 메세지 수신
    //             console.log(data);
    //             // setSocketInstance(socket);
    //         })
    //         socketValue.on("disconnect", (data) => {
    //             console.log(data);
    //         });
    //         return () => socketValue.disconnect();
    //     }
    // },[pathname]);

    return(
    <Wrapper>
        <ToggleSection />
        <MapSection />
    </Wrapper>)
}
export default MainPage;