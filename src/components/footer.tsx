import { Link } from 'react-router';
import { GitHub } from './Icons';
import { IconButton } from '@mui/material';

export default function Footer() {
  return (
    <>
      <footer className='footer mt-auto py-3'>
        <div className='container text-center'>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='content'>
              <p className='mb-0'>本網站僅供作品使用，無包含任何商業用途</p>
              <span className='text-color-gray-400'>
                &copy; {new Date().getFullYear()} Olive Branch - All Rights
                Reserved.
              </span>
            </div>
            <div className='footer-links'>
              <Link className='link-light' to='/copyright-statement'>
                著作權聲明
              </Link>
              <a
                className='link-light'
                href='https://github.com/aquamanda88/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <IconButton>
                  <GitHub />
                </IconButton>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
