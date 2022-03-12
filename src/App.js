import {useEffect} from 'react';
import { Routes, Route } from "react-router-dom";
import './App.css';
// import {makeStyles} from '@mui/styles';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Stories from './pages/Stories';
import Media from './pages/Media';
import User from './pages/User';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import NotFound from './pages/NotFound';
import DetailStory from './pages/DetailStory';
import PlayMedia from './pages/PlayMedia';
import CreateStory from './pages/CreateStory';
import CreateMedia from './pages/CreateMedia';
import GlobalStyles from './components/GlobalStyles'

function App() {
  // if (!localStorage.getItem('islogin')&&!localStorage.getItem('id')) return (
  //   <div className="App">
  //     <h1>Welcome ThankZ Project</h1>
  //     <Login />
  //   </div>
  // );
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <GlobalStyles>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="stories" element={<Stories />} />
            <Route path="media" element={<Media />} />
            <Route path="user" element={<User />} />
            <Route path="about" element={<About />} />
            <Route path="createStory" element={<CreateStory />} />
            <Route path="createMedia" element={<CreateMedia />} />
            <Route path="/stories/:id" element={<DetailStory />} />
            <Route path="/media/:id" element={<PlayMedia />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    </GlobalStyles>
  );
}

export default App;
