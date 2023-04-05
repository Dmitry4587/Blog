import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import { useFormik } from 'formik';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { registrSchema } from '../../utils/validationsSchemas';
import { registrUser, updateUser } from '../../redux/thunks/authThunks';
import axios from '../../axios';
import handleServerError from '../../utils/handleServerError';
import ErrorMessage from '../../components/ErrorMessage';
import { userStatusSelector } from '../../redux/selectors/authSelectors';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ItemStatus } from '../../redux/types';
import styles from './Login.module.scss';

const Registration = () => {
  const [file, setFile] = React.useState<{ url: string; imgId: string }>({ url: '', imgId: '' });
  const [fileStatus, setFileStatus] = React.useState<ItemStatus>(ItemStatus.LOADED);
  const [errorMessage, setErrorMessage] = React.useState('');
  const userStatus = useAppSelector(userStatusSelector);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const ref = React.useRef<HTMLInputElement>(null);
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      avatar: { url: '', imgId: '' },
    },
    validationSchema: registrSchema,
    onSubmit: async (userData) => {
      try {
        const registrFormData = { ...userData };
        if (file) registrFormData.avatar = file;

        if (location.pathname.includes('registr')) {
          const data = await dispatch(registrUser(registrFormData)).unwrap();
          window.localStorage.setItem('token', data.token);
        } else {
          await dispatch(updateUser({ ...registrFormData, avatar: file })).unwrap();
        }
        navigate('/');
      } catch (e) {
        if (typeof e === 'string') {
          setErrorMessage(e);
        }
      }
    },
  });

  const onChangeSetFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let fileImg: File | null = null;
    if (e.target.files) {
      const [img] = e.target.files;
      fileImg = img;
    }
    if (fileImg) {
      try {
        setFileStatus(ItemStatus.LOADING);
        const formData = new FormData();
        formData.append('image', fileImg);
        const { data } = await axios.post<{ url: string; imgId: string }>('/upload', formData);
        setFile(data);
        setFileStatus(ItemStatus.LOADED);
      } catch (err) {
        setFileStatus(ItemStatus.LOADED);
        const error = handleServerError(err);
        setErrorMessage(error);
      }
    }
  };

  if (window.localStorage.getItem('token') && location.pathname.includes('registr')) {
    return <Navigate to="/" />;
  }

  const onClickDeletePhoto = async () => {
    try {
      setFileStatus(ItemStatus.LOADING);
      await axios.delete(`/upload/${file.imgId}`);
      setFile({ url: '', imgId: '' });
      setFileStatus(ItemStatus.LOADED);
    } catch (err) {
      setFileStatus(ItemStatus.LOADED);
      const error = handleServerError(err);
      setErrorMessage(error);
    }
  };

  return (
    <Paper className={styles.block} classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        {location.pathname.includes('user') ? 'Изменить аккаунт' : 'Создание аккаунта'}
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <div className={styles.avatar}>
          <input accept=".jpg,.jpeg,.png" ref={ref} type="file" onChange={onChangeSetFile} hidden />
          {fileStatus === ItemStatus.LOADING ? (
            <Skeleton variant="circular" width={100} height={100} />
          ) : (
            <>
              <Avatar sx={{ width: 150, height: 150 }} src={file.url} />
              {!file.url && (
                <Button
                  className={styles.button}
                  onClick={() => ref?.current?.click()}
                  size="medium"
                  variant="contained">
                  Загрузить фото
                </Button>
              )}
              {file.url && (
                <Button
                  className={styles.button}
                  onClick={onClickDeletePhoto}
                  size="medium"
                  variant="contained"
                  color="error">
                  Удалить фото
                </Button>
              )}
            </>
          )}
        </div>
        <TextField
          className={styles.field}
          label="Полное имя"
          fullWidth
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          className={styles.field}
          label="E-Mail"
          fullWidth
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          className={styles.field}
          label="Пароль"
          name="password"
          fullWidth
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button
          disabled={
            Object.keys(formik.errors).length !== 0 ||
            userStatus === ItemStatus.LOADING ||
            fileStatus === ItemStatus.LOADING
          }
          type="submit"
          size="large"
          variant="contained"
          fullWidth>
          {location.pathname.includes('user') ? 'Сохранить' : 'Войти'}
        </Button>
      </form>
      {errorMessage && <ErrorMessage message={errorMessage} setError={setErrorMessage} />}
    </Paper>
  );
};

export default Registration;
