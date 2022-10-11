import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import MainPage from "./pages/MainPage";
import NavBar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function Routers() {
    return(
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<MainPage />} />
            </Routes>
            <Footer />
        </Router>
    )
}
export default Routers;