export default function Footer() {
  return (
    <>
      <footer className='footer mt-auto py-3 bg-white'>
        <div className='container text-center'>
          <span className='text-muted'>
            &copy; {new Date().getFullYear()} - 六角學院
          </span>
        </div>
      </footer>
    </>
  )
}