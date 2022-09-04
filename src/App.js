import { Route, Routes } from 'react-router-dom';
import './App.css';
import Admin from './components/Admin'; 
import Navbar from './components/Navbar';
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from 'react-toastify';
import Footer from './components/Footer';
function App() {
  console.log(process.env.NODE_ENV)
  console.log(process.env.REACT_APP_API_KEY)
  return (

    <div>
      <ToastContainer position='top-right'/>
      <Navbar/>
      {/* <Homepage/> */}
      <Routes>
      <Route exact path ="/" element={<Admin/>} />
      </Routes>
      <Footer/>
    </div>

  );
}

export default App;
