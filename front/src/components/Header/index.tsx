import React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { CircularProgress } from '@mui/material';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import { setAuth } from '../../redux/slices/auth';
import { userSelector, userStatusSelector } from '../../redux/selectors/authSelectors';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ItemStatus } from '../../redux/types';
import styles from './Header.module.scss';

const Header = () => {
  const isAuth = useAppSelector(userSelector);
  const userStatus = useAppSelector(userStatusSelector);
  const dispatch = useAppDispatch();

  const onClickLogOut = () => {
    window.localStorage.removeItem('token');
    dispatch(setAuth(null));
  };

  const createButtons = () => {
    if (userStatus === ItemStatus.LOADING) {
      return <CircularProgress />;
    }

    if (!isAuth) {
      return (
        <>
          <Link to="/login">
            <Button variant="outlined">Войти</Button>
          </Link>
          <Link to="/registr">
            <Button variant="contained">Создать аккаунт</Button>
          </Link>
        </>
      );
    }

    return (
      <>
        <Link to="/">
          <Button onClick={onClickLogOut} variant="outlined">
            Выйти
          </Button>
        </Link>
        <Link to="posts/add-post">
          <Button className={styles.btn} variant="contained">
            Написать статью
          </Button>
        </Link>
        <Link to="/user">
          <Avatar className={styles.avatar} src={isAuth?.avatar?.url} />
        </Link>
      </>
    );
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link to="/" className={styles.logo}>
            <div>BLOG</div>
          </Link>
          <div className={styles.buttons}>{createButtons()}</div>
        </div>
      </Container>
    </div>
  );
};
export default Header;
