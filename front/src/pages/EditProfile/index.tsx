import * as React from 'react';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Paper } from '@mui/material';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import { userStatusSelector } from '../../redux/selectors/authSelectors';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ItemStatus } from '../../redux/types';
import ErrorPage from '../ErrorPage';
import { fetchUser } from '../../redux/thunks/authThunks';
import SettingsList from './SettingsList';
import UserInput from './UserInput';
import UserPhotoInput from './UserPhotoInput';
import styles from './EditProfile.module.scss';

const EditProfile = () => {
  const [errorMessage, setErrorMessage] = React.useState('');
  const dispatch = useAppDispatch();
  const userStatus = useAppSelector(userStatusSelector);

  if (!window.localStorage.getItem('token')) {
    return <Navigate to="/" />;
  }

  if (userStatus === ItemStatus.LOADING) {
    return (
      <CircularProgress
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'transalte(-50%, -50%)',
        }}
      />
    );
  }

  const onClickGetUser = () => {
    dispatch(fetchUser());
  };

  if (userStatus === ItemStatus.ERROR) {
    return <ErrorPage onClickUpdate={onClickGetUser} error={errorMessage} />;
  }

  return (
    <>
      <Paper className={styles.block} classes={{ root: styles.root }}>
        <Typography classes={{ root: styles.title }} variant="h5">
          Изменить аккаунт
        </Typography>

        <Routes>
          <Route index element={<SettingsList />} />
          <Route
            path="name"
            element={<UserInput field="name" name="Полное имя" setErrorMessage={setErrorMessage} />}
          />
          <Route
            path="email"
            element={<UserInput field="email" name="Email" setErrorMessage={setErrorMessage} />}
          />
          <Route path="avatar" element={<UserPhotoInput setErrorMessage={setErrorMessage} />} />
          <Route
            path="password"
            element={<UserInput field="password" name="Пароль" setErrorMessage={setErrorMessage} />}
          />
        </Routes>

        <Outlet />
      </Paper>
      {errorMessage && <ErrorMessage message={errorMessage} setError={setErrorMessage} />}
    </>
  );
};

export default EditProfile;
