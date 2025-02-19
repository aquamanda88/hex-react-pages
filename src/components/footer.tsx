import { Link } from 'react-router';
import { GitHub } from './Icons';

export default function Footer() {
  return (
    <>
      <footer className='footer mt-auto py-3'>
        <div className='container text-center'>
          <div className='footer-block flex-column flex-md-row'>
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
              <Link className='link-light' to='/admin'>
                後台
              </Link>
              <a
                className='link-light'
                href='https://github.com/aquamanda88/'
                target='_blank'
                rel='noopener noreferrer'
              >
                <GitHub />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
