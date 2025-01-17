import * as React from 'react';
import { Button, IconButton, Dialog, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReactNode } from 'react';

/** 元件參數型別 */
interface ModalProps {
  /** 控制 Modal 的開啟狀態 */
  open: boolean;
  /** 更新開啟狀態的函式 */
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** 子元件，可以是任何 React 元素 */
  children: ReactNode;
  /** 是否全螢幕，為選填 */
  isFullScreen?: boolean;
  /** 確認按鈕的顯示文字 */
  confirmBtnText?: string;
  /** 確認按鈕的處理函式 */
  handleConfirm: () => void;
}

export default function Modal({
  open,
  setOpen,
  children,
  isFullScreen = false,
  confirmBtnText,
  handleConfirm,
}: ModalProps) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <React.Fragment>
        <Dialog
          open={open}
          fullScreen={isFullScreen}
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
          <div className='modal-footer sticky-bottom bg-white d-flex justify-content-center'>
            <div className='d-flex justify-content-center py-2 gap-2'>
              {confirmBtnText === '刪除' ? (
                <>
                  <Button
                    className='btn btn-secondary'
                    variant='contained'
                    onClick={handleConfirm}
                  >
                    {confirmBtnText ? confirmBtnText : '儲存'}
                  </Button>
                  <Button
                    className='btn btn-primary'
                    variant='contained'
                    onClick={handleClose}
                  >
                    取消
                  </Button>
                </>
              ) : (
                <>
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
                    onClick={handleConfirm}
                  >
                    {confirmBtnText ? confirmBtnText : '儲存'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </Dialog>
      </React.Fragment>
    </>
  );
}
