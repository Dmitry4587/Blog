import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TagsInput from 'react-tagsinput';
import SimpleMDE from 'react-simplemde-editor/dist/SimpleMdeReact';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import axios from '../../axios';
import handleServerError from '../../utils/handleServerError';
import ErrorMessage from '../../components/ErrorMessage';
import ErrorPage from '../ErrorPage';
import { useAppSelector } from '../../redux/hooks';
import { IPost, ItemStatus } from '../../redux/types';
import { userStatusSelector } from '../../redux/selectors/authSelectors';
import styles from './AddPost.module.scss';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'easymde/dist/easymde.min.css';

const AddPost = () => {
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [img, setImg] = React.useState<{ url: string; imgId: string }>({
    url: '',
    imgId: '',
  });
  const [photoStatus, setPhotoStatus] = React.useState<ItemStatus>(ItemStatus.LOADED);
  const userStatus = useAppSelector(userStatusSelector);
  const [postStatus, setPostStatus] = React.useState<ItemStatus>(ItemStatus.LOADED);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      hideIcons: ['fullscreen', 'preview', 'side-by-side'] as const,
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autosave: {
        uniqueId: nanoid(),
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  const onChangeText = React.useCallback((value: string) => {
    setText(value);
  }, []);

  const handleChange = (value: string[]) => {
    setTags(value);
  };

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 40 && e.target.value !== ' ') {
      setTitle(e.target.value.toUpperCase());
    }
  };

  const onClickRemoveImg = async () => {
    try {
      setPhotoStatus(ItemStatus.LOADING);
      await axios.delete(`/upload/${img.imgId}`);
      setImg({ url: '', imgId: '' });
      setPhotoStatus(ItemStatus.LOADED);
    } catch (e) {
      setPhotoStatus(ItemStatus.LOADED);
      const error = handleServerError(e);
      setErrorMessage(error);
    }
  };

  const fetchPost = React.useCallback(async () => {
    if (id) {
      try {
        const { data } = await axios.get<IPost>(`posts/${id}`);
        setText(data.text);
        setTitle(data.title);
        if (data.img) {
          setImg(data.img);
        }
        if (data.tags) {
          setTags(data.tags);
        }
      } catch (err) {
        const error = handleServerError(err);
        setErrorMessage(error);
        setPostStatus(ItemStatus.ERROR);
      }
    }
  }, [id]);

  React.useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  React.useEffect(() => {
    if (!window.localStorage.getItem('token')) {
      return navigate('/');
    }
  }, [navigate]);

  const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let fileImg: File | null = null;
    if (e.target.files) {
      const [imgfile] = e.target.files;
      fileImg = imgfile;
    }
    if (fileImg) {
      try {
        setPhotoStatus(ItemStatus.LOADING);
        const formData = new FormData();
        formData.append('image', fileImg);
        const { data } = await axios.post<{ url: string; imgId: string }>('/upload', formData);
        setImg(data);
        setPhotoStatus(ItemStatus.LOADED);
      } catch (err) {
        setPhotoStatus(ItemStatus.LOADED);
        const error = handleServerError(err);
        setErrorMessage(error);
      }
    }
  };

  const onClickSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPostStatus(ItemStatus.LOADING);
      const formObj = {
        title,
        img,
        tags,
        text,
      };
      if (id) {
        await axios.patch(`/posts/${id}`, formObj);
      } else {
        await axios.post('/posts', formObj);
      }
      setPostStatus(ItemStatus.LOADED);
      navigate('/');
    } catch (err) {
      setPostStatus(ItemStatus.LOADED);
      const error = handleServerError(err);
      setErrorMessage(error);
    }
  };

  if (postStatus === ItemStatus.ERROR) {
    return <ErrorPage error={errorMessage} />;
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
  if (userStatus === ItemStatus.ERROR) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <div className={styles.buttonWrapper}>
        {!img.url && (
          <Button
            onClick={() => inputRef?.current?.click()}
            variant="outlined"
            size="large"
            disabled={photoStatus === ItemStatus.LOADING}>
            Загрузить превью
          </Button>
        )}
        {img.url && (
          <Button
            disabled={photoStatus === ItemStatus.LOADING}
            onClick={onClickRemoveImg}
            color="error"
            variant="outlined"
            size="large">
            Удалить
          </Button>
        )}
      </div>
      <input accept=".jpg,.jpeg,.png" ref={inputRef} onChange={onChangeFile} type="file" hidden />
      <br />
      {img.url && (
        <div className={styles.image}>
          <img src={img.url} alt={img.imgId} />
        </div>
      )}
      <br />
      <form onSubmit={onClickSubmit}>
        <TextField
          value={title}
          classes={{ root: styles.title }}
          variant="standard"
          placeholder="Заголовок статьи..."
          fullWidth
          onChange={onChangeTitle}
        />
        <TagsInput
          validationRegex={/^[^!@#$%^&*()_\s\d][a-zA-Zа-яА-Я]{2,30}$/}
          onValidationReject={() => setErrorMessage('Не допустимое значение')}
          onlyUnique
          className="react-tagsinput"
          inputProps={{ placeholder: 'теги' }}
          addOnBlur
          value={tags}
          onChange={handleChange}
        />
        <SimpleMDE
          className={styles.editor}
          value={text}
          onChange={onChangeText}
          options={options}
        />
        <div className={styles.buttons}>
          <Button
            disabled={
              photoStatus === ItemStatus.LOADING ||
              postStatus === ItemStatus.LOADING ||
              !text.trim() ||
              !title.trim()
            }
            type="submit"
            size="large"
            variant="contained">
            {id ? 'Сохранить' : 'Опубликовать'}
          </Button>

          <Link to="/">
            <Button size="large">Отмена</Button>
          </Link>
        </div>
      </form>
      {errorMessage && <ErrorMessage message={errorMessage} setError={setErrorMessage} />}
    </Paper>
  );
};

export default AddPost;
