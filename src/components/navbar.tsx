import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <>
      <nav className='bg-dark text-white'>
        <div className='container'>
          <div className='d-block'>
            <ul className='nav col-12 col-lg-auto mb-2 justify-content-between mb-md-0'>
              <li>
                <Link
                  className={`nav-link px-2 py-4 ${location.pathname === '/week01' ? 'text-secondary' : 'text-white'}`}
                  to='/week01'
                >
                  第一週
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-link px-2 py-4 ${location.pathname === '/week02' ? 'text-secondary' : 'text-white'}`}
                  to='/week02'
                >
                  第二週
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-link px-2 py-4 ${location.pathname === '/week03' ? 'text-secondary' : 'text-white'}`}
                  to='/week03'
                >
                  第三週
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-link px-2 py-4 ${location.pathname === '/week04' ? 'text-secondary' : 'text-white'}`}
                  to='/week04'
                >
                  第四週
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-link px-2 py-4 ${location.pathname === '/week05' ? 'text-secondary' : 'text-white'}`}
                  to='/week05'
                >
                  第五週
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-link px-2 py-4 ${location.pathname === '/week06' ? 'text-secondary' : 'text-white'}`}
                  to='/week06'
                >
                  第六週
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-link px-2 py-4 ${location.pathname === '/week07' ? 'text-secondary' : 'text-white'}`}
                  to='/week07'
                >
                  第七週
                </Link>
              </li>
              <li>
                <Link
                  className={`nav-link px-2 py-4 ${location.pathname === '/week08' ? 'text-secondary' : 'text-white'}`}
                  to='/week08'
                >
                  第八週
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
