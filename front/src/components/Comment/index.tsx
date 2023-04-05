import React from 'react';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { userSelector } from '../../redux/selectors/authSelectors';
import { IComment, IPost } from '../../redux/types';
import axios from '../../axios';
import handleServerError from '../../utils/handleServerError';

interface ICommentProps {
  comment: IComment;
  isPostComment: boolean;
  setPostData?: (post: IPost) => void;
  setErrorMessage: (err: string) => void;
  postId: string;
}

const Comment = ({
  comment,
  isPostComment,
  setPostData,
  setErrorMessage,
  postId,
}: ICommentProps) => {
  const userInfo = useAppSelector(userSelector);
  const navigate = useNavigate();
  const [disabledButton, setDisabled] = React.useState(false);
  const [like, setLike] = React.useState(false);
  const isLiked =
    Boolean(
      userInfo?.favComments && userInfo.favComments.find((item) => item._id === comment._id),
    ) || like;
  const isAbleDelete = userInfo && isPostComment && userInfo._id === comment.user._id;
  const isLikeCountShow = comment.commentLikes > 0 ? comment.commentLikes : '';
  const isDisabledLike = disabledButton ? 'default' : 'info';
  const likeColor = isLiked ? 'error' : isDisabledLike;
  const isTextBig = !isPostComment && comment?.text.length > 30;
  const isDisableDel = disabledButton ? 'disabled' : 'error';
  const isCutText = isTextBig ? `${comment?.text.substring(0, 30)}...` : comment?.text;

  const onClickDel = async (commentId: string) => {
    setDisabled(true);
    try {
      if (postId) {
        const { data } = await axios.delete<IPost>(`comments/${commentId}/post/${postId}`);
        if (setPostData) {
          setPostData(data);
        }
      }
      setDisabled(false);
    } catch (e) {
      setDisabled(false);
      const error = handleServerError(e);
      setErrorMessage(error);
    }
  };

  const onClickToPost = async (commentId: string) => {
    if (!isPostComment) {
      try {
        const { data } = await axios.get(`/posts/${commentId}/comment`);
        navigate(`/posts/${data.postId._id}`, { state: commentId });
      } catch (e) {
        const error = handleServerError(e);
        setErrorMessage(error);
      }
    }
  };

  const onClickLikeOrDislike = async (commentId: string) => {
    try {
      setDisabled(true);
      const {
        data: { post, isLike },
      }: { data: { post: IPost; isLike: boolean } } = await axios.patch(
        `/comments/${commentId}/post/${postId}`,
      );
      if (setPostData) {
        setPostData(post);
      }
      setLike(isLike);
      setDisabled(false);
    } catch (e) {
      setDisabled(false);
      const error = handleServerError(e);
      setErrorMessage(error);
    }
  };

  return (
    <React.Fragment key={comment._id}>
      <ListItem
        onClick={() => onClickToPost(comment._id)}
        sx={{ paddingBottom: '0px', cursor: isPostComment ? 'auto' : 'pointer' }}
        alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={comment?.user.name} src={comment?.user.avatar?.url} />
        </ListItemAvatar>
        <ListItemText primary={comment?.user.name} secondary={isCutText} />
      </ListItem>
      {isPostComment && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '7px',
            marginBottom: '9px',
          }}>
          <IconButton
            sx={{ marginLeft: '70px', padding: '0' }}
            disabled={disabledButton || !userInfo}
            onClick={() => onClickLikeOrDislike(comment._id)}
            edge="end"
            aria-label="delete">
            {isLikeCountShow ? (
              <Chip
                color={likeColor}
                icon={<FavoriteIcon sx={{ fontSize: '12px' }} />}
                label={`${isLikeCountShow}`}
              />
            ) : (
              <FavoriteIcon sx={{ fontSize: '22px' }} />
            )}
          </IconButton>

          {isAbleDelete && (
            <IconButton
              sx={{ marginLeft: '45px', padding: '0' }}
              disabled={disabledButton}
              onClick={() => onClickDel(comment._id)}
              edge="end"
              aria-label="delete">
              <Chip
                icon={<DeleteIcon color={isDisableDel} sx={{ fontSize: '16px' }} />}
                label="Удалить"
              />
            </IconButton>
          )}
        </div>
      )}
      <Divider variant="inset" component="li" />
    </React.Fragment>
  );
};

export default Comment;
