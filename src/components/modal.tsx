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
          <div className='modal-content'>{children}</div>
          <div className='sticky-bottom bg-white d-flex justify-content-center'>
            <div className='d-flex justify-content-center py-2 gap-2'>
              <Button
                className='btn btn-secondary'
                variant='contained'
                onClick={handleClose}
              >
                取消
              </Button>
              <Button
                className='btn btn-primary'
                variant='contained'
                onClick={handleSave}
              >
                儲存
              </Button>
            </div>
          </div>
        </Dialog>
      </React.Fragment>
    </>
  );
}
