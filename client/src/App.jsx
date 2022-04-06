import './App.css';
// import Header from '../Header';
import Login from './Components/Login';
//import Sidebar from './Sidebar';
import Dashboard from './Components/Dashboard';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './Components/Register';
import ForgotPassword from './Components/PasswordManager/forgotPassword';
import VerifyEmail from './Components/Register/verifyEmail';
import ResetPassword from './Components/PasswordManager/resetPassword';
import Workspace from './Components/Workspace';
import CreateWorkSpace from './Components/Workspace/create';
import { useDispatch } from 'react-redux';
import socketClient from "socket.io-client";


function App() {

  const dispatch = useDispatch();
  // Axios.defaults.withCredentials = true;

  // Check local storage if have login info
  // Dispatch sign in action with our userId and redirect to dashboard
  // const checkLocalStorageAuth = () => {

  //   const user = JSON.parse(localStorage.getItem('user'));
  //   if (user) {

  //     dispatch(signIn(user));
  //   }
  // };

  return (
    <div className='app'>
      <Router>
        <Routes>
          {/* {checkLocalStorageAuth()} */}
          <Route exact path='/' element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/workspace/create" element={<CreateWorkSpace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;