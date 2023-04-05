import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { registrSchema } from '../../../utils/validationsSchemas';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { updateUser } from '../../../redux/thunks/authThunks';
import { userSelector } from '../../../redux/selectors/authSelectors';
import styles from './UserInput.module.scss';

interface IUserInputProps {
  field: keyof typeof registrSchema.fields;
  name: string;
  setErrorMessage: (value: string) => void;
}

const UserInput = ({ field, name, setErrorMessage }: IUserInputProps) => {
  const dispatch = useAppDispatch();
  const schema = yup.object({
    email: field === 'email' ? registrSchema.fields.email : yup.string(),
    name: field === 'name' ? registrSchema.fields.name : yup.string(),
    password: field === 'password' ? registrSchema.fields.password : yup.string(),
  });
  const isAuth = useAppSelector(userSelector);
  const formik = useFormik({
    initialValues: {
      [field]: '',
    },
    validationSchema: schema,
    onSubmit: async (registrFormData) => {
      try {
        await dispatch(updateUser(registrFormData)).unwrap();
      } catch (e) {
        if (typeof e === 'string') {
          setErrorMessage(e);
        }
      }
    },
  });
  React.useEffect(() => {
    if (isAuth && field !== 'password') {
      formik.setFieldValue(field, isAuth[field]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  return (
    <form className={styles.form} onSubmit={formik.handleSubmit}>
      <TextField
        className={styles.field}
        label={name}
        fullWidth
        name={field}
        value={formik.values[field]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched[field] && Boolean(formik.errors[field])}
        helperText={formik.touched[field] && formik.errors[field]}
      />
      <Button
        className={styles.button}
        disabled={!!Object.keys(formik.errors).length}
        type="submit"
        size="large"
        variant="contained"
        fullWidth>
        Сохранить
      </Button>
      <Link to="/user">
        <Button className={styles.button} color="error" size="large" variant="contained" fullWidth>
          Назад
        </Button>
      </Link>
    </form>
  );
};

export default UserInput;
