import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Snackbar } from '@mui/material';
import { Close } from './Icons';
import { messages, toastOpen, toggleToast } from '../redux/toastSlice';

export default function Toast() {
  const toastMessages = useSelector(messages);
  const isToastOpen = useSelector(toastOpen);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(toggleToast(false));
  };

  const action = (
    <IconButton onClick={handleClose}>
      <Close />
    </IconButton>
  );

  return (
    <>
      {toastMessages.map((message) => {
        return (
          <Snackbar
            key={message.id}
            open={isToastOpen}
            className={message.status ? 'toast-success' : 'toast-danger'}
            autoHideDuration={5000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            onClose={handleClose}
            action={action}
            message={message.text}
          />
        );
      })}
    </>
  );
}
