import { Route, Routes } from "react-router-dom";
import Login from "./pages/DangNhap/Login.jsx";
import ManagerRouter from "./routers/ManagerRouter.jsx";
import "./App.css";
import HomePages from "./pages/HomePages/HomePages.jsx";
import Welcome from "./pages/WelcomePage/Welcome.jsx";
import VerifyEmail from "./pages/DangNhap/VerifyEmail.jsx";
import Invite from "./pages/DangNhap/Invite.jsx";
import Test from "./Test.jsx"
import ForgotPassword from "./pages/DangNhap/ForgotPassword.jsx";

function App() {
  return (
    <Routes>
      <Route path="" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/homepage" element={<HomePages />} />
      <Route path="project/*" element={<ManagerRouter />} />
      <Route path="/verify/account/:username/:email/:otp" element={<VerifyEmail />} />
      <Route path="/invite/member/:projectID/:inviter/:inviterEmail/:guest/:guestID" element={<Invite />} />
      <Route path="/reset/password/:email/:otp" element={<ForgotPassword />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}
export default App;
