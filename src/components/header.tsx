import React from 'react';

type HeaderProps = {
  /** 章節標題 */
  title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className='py-3 mb-4 border-bottom'>
      <div className='container d-flex flex-wrap justify-content-center'>
        <div className='d-flex align-items-center mb-lg-0 me-lg-auto text-dark text-decoration-none'>
          <h2 className='mb-0'>{title}</h2>
        </div>
      </div>
    </header>
  );
};

export default Header;