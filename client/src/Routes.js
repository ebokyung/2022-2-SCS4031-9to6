import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import MainPage from "./pages/MainPage";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import MyPage from "./pages/MyPage";
import Safety from "./pages/Safety";
import Report from "./pages/Report";
import Statistics from "./pages/Statistics";
import ServiceInfo from "./pages/ServiceInfo";
import NavBar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function Routers() {
    return(
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/safety" element={<Safety />} />
                <Route path="/report" element={<Report />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/serviceinfo" element={<ServiceInfo />} />
            </Routes>
            <Footer />
        </Router>
    )
}
export default Routers;