import React from 'react';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import axios from '../../axios';
import { userSelector } from '../../redux/selectors/authSelectors';
import { IPost, ItemStatus } from '../../redux/types';
import { useAppSelector } from '../../redux/hooks';
import styles from './AddComment.module.scss';

interface IAddCommentProps {
  setPostData: (value: IPost) => void;
}

const AddComment = ({ setPostData }: IAddCommentProps) => {
  const user = useAppSelector(userSelector);
  const [status, setStatus] = React.useState(ItemStatus.LOADED);
  const [text, setText] = React.useState('');
  const { id } = useParams();

  const onClickAdd = async () => {
    try {
      setStatus(ItemStatus.LOADING);
      const { data }: { data: { newPost: IPost } } = await axios.post(`/comments/${id}`, { text });
      setPostData(data.newPost);
      setStatus(ItemStatus.LOADED);
    } catch (e) {
      setStatus(ItemStatus.ERROR);
    }
    setText('');
  };

  return (
    <div className={styles.root}>
      <Avatar classes={{ root: styles.avatar }} src={user?.avatar?.url} />
      <div className={styles.form}>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Написать комментарий"
          variant="outlined"
          maxRows={10}
          multiline
          fullWidth
        />
        <Button
          disabled={status === ItemStatus.LOADING || text.trim().length < 2}
          onClick={onClickAdd}
          variant="contained"
          color={status === ItemStatus.ERROR ? 'error' : 'primary'}>
          Отправить
        </Button>
      </div>
    </div>
  );
};

export default AddComment;
