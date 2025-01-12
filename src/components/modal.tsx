import * as React from 'react';
import { Button, IconButton, Dialog, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function Modal({ open, setOpen, children, handleSave }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <React.Fragment>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <div className='modal-header bg-white sticky-top d-flex justify-content-end'>
            <DialogActions className='justify-content-center'>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </DialogActions>
          </div>
          <div className='modal-content'>
            <div className='container'>{children}</div>
          </div>
          <div className='bg-white d-flex justify-content-center'>
            <div className='justify-content-center py-2'>
              <Button onClick={handleClose}>取消</Button>
              <Button onClick={handleSave}>儲存</Button>
            </div>
          </div>
        </Dialog>
      </React.Fragment>
    </>
  );
}
