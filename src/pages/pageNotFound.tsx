import { Button } from '@mui/material';
import { Link } from 'react-router';

export default function PageNotFound() {
  return (
    <>
      <div className='page-not-found-container'>
        <div className='notfound'>
          <div className='notfound-404'>
            <h3>Oops! Page not found</h3>
            <h1>
              <span className='font-en-h1-medium'>4</span>
              <span>0</span>
              <span>4</span>
            </h1>
          </div>
          <h2>we are sorry, but the page you requested was not found</h2>
          <Link to='/home' className='d-inline-block'>
            <Button
              className='btn btn-secondary small mb-4'
              variant='contained'
            >
              GO BACK
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
