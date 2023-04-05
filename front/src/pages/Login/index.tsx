import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { loginShema } from '../../utils/validationsSchemas';
import { authUser } from '../../redux/thunks/authThunks';
import { userSelector, userStatusSelector } from '../../redux/selectors/authSelectors';
import ErrorMessage from '../../components/ErrorMessage';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ItemStatus } from '../../redux/types';
import styles from './Login.module.scss';

const Login = () => {
  const navigate = useNavigate();
  const isAuth = useAppSelector(userSelector);
  const [errorMessage, setErrorMessage] = React.useState('');
  const userStatus = useAppSelector(userStatusSelector);
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginShema,
    onSubmit: async (loginFormData) => {
      try {
        const data = await dispatch(authUser(loginFormData)).unwrap();
        window.localStorage.setItem('token', data.token);
        formik.resetForm();
      } catch (e) {
        if (typeof e === 'string') {
          setErrorMessage(e);
        }
      }
    },
  });

  React.useEffect(() => {
    if (isAuth) {
      return navigate('/');
    }
  }, [navigate, isAuth]);

  return (
    <Paper className={styles.block} classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          id="email"
          name="email"
          className={styles.field}
          label="E-Mail"
          fullWidth
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          id="password"
          name="password"
          className={styles.field}
          label="Пароль"
          fullWidth
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button
          fullWidth
          disabled={Object.keys(formik.errors).length !== 0 || userStatus === ItemStatus.LOADING}
          type="submit"
          size="large"
          variant="contained">
          Войти
        </Button>
      </form>
      {errorMessage && <ErrorMessage message={errorMessage} setError={setErrorMessage} />}
    </Paper>
  );
};

export default Login;
