import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import MainPage from "./pages/MainPage";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import MyPage from "./pages/MyPage";
import Safety from "./pages/Safety";
import Shelter from "./pages/Shelter";
import Report from "./pages/Report";
import Statistics from "./pages/Statistics";
import Service from "./pages/Service";
import Guide from "./pages/Guide";
import NavBar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Notice from "./components/MainPage/sidebar/Notice";
import Chat from "./components/MainPage/sidebar/Chat";

function Routers() {
    return(
        <Router>
            <NavBar />
            <Routes>
                <Route path="/*" element={<MainPage />} >
                    {/* <Route index element={<Notice />} />
                    <Route path="notice" element={<Notice />} />
                    <Route path="chat" element={<Chat />} />  */}
                </Route>
                <Route path="/login" element={<LogIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/safety" element={<Safety />} />
                <Route path="/safety/shelter" element={<Shelter />} />
                <Route path="/report" element={<Report />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/service" element={<Service />} />
                <Route path="/service/guide" element={<Guide />} />
            </Routes>
            <Footer />
        </Router>
    )
}
export default Routers;