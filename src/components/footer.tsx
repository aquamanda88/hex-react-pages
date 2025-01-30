export default function Footer() {
  return (
    <>
      <footer className='footer mt-auto py-3 bg-light'>
        <div className='container text-center'>
          <div className='row justify-content-center'>
            <div className='col-6'>
              <h4>關於圖片與描述使用說明</h4>
              <p>
                本站的所有畫作圖片均來自於
                <a
                  className='text-color-main d-inline-block'
                  href='https://www.nga.gov/notices/open-access-policy.html'
                  target='_blank'
                >
                  【華盛頓國家藝廊】
                </a>
                <br/>並根據其提供的 CC0 公眾領域授權使用。
              </p>
              <p>
                本站中關於畫作的文字描述由 ChatGPT
                自動生成，這些描述可能會包含不準確或錯誤的內容，僅供參考使用。如需更詳盡或準確的資訊，建議參考官方或學術資源。
              </p>
            </div>
          </div>
          <span className='text-muted'>
            &copy; {new Date().getFullYear()} - 六角學院
          </span>
        </div>
      </footer>
    </>
  );
}
