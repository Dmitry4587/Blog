import Container from '@mui/material/Container';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { fetchUser } from './redux/thunks/authThunks';
import PostsByTag from './components/PostsByTag';
import Page404 from './pages/Page404';
import { useAppDispatch } from './redux/hooks';
import EditProfile from './pages/EditProfile';
import Header from './components/Header';
import FullPost from './pages/FullPost';
import AddPost from './pages/AddPost';
import Registration from './pages/Registration';
import Home from './pages/Home';
import Login from './pages/Login';

const App = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/tags/:tag" element={<PostsByTag />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/posts/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user/*" element={<EditProfile />} />
          <Route path="/registr" element={<Registration />} />
          <Route path="/*" element={<Page404 />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
