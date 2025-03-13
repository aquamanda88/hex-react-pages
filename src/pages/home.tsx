import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { toggleToast, updateMessage } from '../redux/toastSlice';
import { AxiosError } from 'axios';
import { ProductFullDatum } from '../core/models/utils.model';
import { formatPrice } from '../services/formatValue.service';
import productApiService from '../services/api/user/products.service';
import AOS from 'aos';

export default function Home() {
  const [products, setProducts] = useState<ProductFullDatum[]>([]);
  const [couponCode] = useState('happy2025');
  const dispatch = useDispatch();

  const contentItems = [
    {
      imgUrl:
        'https://storage.googleapis.com/vue-course-api.appspot.com/olive-branch/1739985852802.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=lW4J08of3JXG3AQaGz8JXZCWyUH7Fo5yIMNQHxuTx9FetGi7YkRM1DIlgAQYIL8gkMq6W7liBsVP7Z9DeHr4e%2BL%2FyBO7dB9Mm1JpKqsj6clIBCMyKnt6CwivcCssehSBQ6hx61GLpiCjAAsB9lJe3MJ9A2Uwcfm6lZ2aFLFQvtxyDQOkmaqxlIiPTiJ%2F1BoNcvOmFHjV4Qza5zdjGAlXyKyRF1OkOPlSTSR6skA3D%2BbpnCWkl8ln0t6Ro44z89Lydeq4nTMN6FVe6IIEcBCQIekaOTUnPBFYY3VTmU0NJVbDY5Wh%2B%2BoREusl%2FsBKRUqznbIr3%2BfCfWHdxFID8E3BuQ%3D%3D',
      title: '博物館級細節還原',
      content: '採用高精度技術與頂級畫布，重現大師筆下的光影與質感。',
    },
    {
      imgUrl:
        'https://storage.googleapis.com/vue-course-api.appspot.com/olive-branch/1739985500663.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=FxCKUkI9zBnoVTdQ2IGZUNUCCUXHMKXE40S9Cjbs916K3uVRVfKvYKrBZTxJnERyqNxqesIAdCMqSQraESTRYYhtjU%2F5lBP83yP9mHFErkVPdbGpMMopfQCGTYWk3DHbPcw0YQsINoDwcNnD1WtK3VL9%2FrTtGsvEXbSOuqxaDEFUEHY6f0IFOXLKxmlOIeXRH4AGsXA5yndqCmpC5DAQibOZ5XwqFjuj1tbkj736jfOt9cQFzO35h2g1e55MOk6Qk6JCCmdpTVpC%2BSzxX8D2zWe5KSu0muzW7cPgGgOCJsKIYr5K77KinOtluuzHEKrr75RTQZWitJo4N0aIgKdQLw%3D%3D',
      title: '多種尺寸與客製化選擇',
      content: '滿足不同空間需求，讓藝術成為您生活的一部分。',
    },
    {
      imgUrl:
        'https://storage.googleapis.com/vue-course-api.appspot.com/olive-branch/1739986028820.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=OmJ2b4WfsLHrJIeurzOXsqxIyheTi%2BHX0jbzztO%2B6XpZNwQ6QvtKKaALJXWAKtG3HyZaBfQPFwQZKSguwEZKBjWmRTA9kZORxe7Qpj2sILQixro4ZVF%2Bp25JB0Kp2I5jf4lolBrTlyBoVyQ5PiGxDP47WVyhx9OB%2Bw1yruV%2F7IInlZaype8Ex17BT6Ul69bLKh4kFqjExDbfox%2FAtMPfVV5TneucMyz1uzgbUE3qQCxYS7F3HXXkuOqSEPxUzyBmtBjHa54uelqzCz%2Byy9FO3oKeWLpilzQ3ECfzLrlmW6jbqv7yOqs%2B4ab9ME%2FblGEVrEWZMYmDXYBNDpdz5uB8SQ%3D%3D',
      title: '價格親民，收藏無負擔',
      content: '讓人人都能擁有經典名作，輕鬆提升居家品味。',
    },
  ];

  /**
   * 處理複製優惠券代碼到剪貼簿事件
   *
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(couponCode ?? '');
      dispatch(toggleToast(true));
      dispatch(
        updateMessage({
          text: '已複製優惠碼：' + couponCode,
          status: true,
        })
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(toggleToast(true));
        dispatch(
          updateMessage({
            text: error.response?.data?.message,
            status: false,
          })
        );
      }
    }
  };

  /**
   * 呼叫取得商品列表 API
   *
   */
  const getAllProducts = async () => {
    productApiService.getAllProducts().then(({ data: { products } }) => {
      const randomProducts = products
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      setProducts(randomProducts);
    });
  };

  useEffect(() => {
    AOS.init();
    getAllProducts();
  }, []);

  return (
    <>
      <div className='container-fluid'>
        <div className='primary-content-block row'>
          <div className='col-12 col-md-6 primary-text'>
            <h2>讓藝術走進您的生活</h2>
            <h4>
              <span className='logo-text font-en-h2'>Olive Branch</span>{' '}
              用最精緻的工藝，將世界級的藝術珍寶帶到您的所在之處。
            </h4>
            <p className='text-color-gray-600'>
              無論是梵谷的星空、莫內的睡蓮，還是達文西的經典之作，我們精心製作高品質的名畫複製畫，讓每一筆觸、每一層色彩都能完美呈現原作的魅力。
            </p>
            <Link to='/products' className='w-100'>
              <Button className='btn btn-primary w-100' variant='contained'>
                現在就去逛逛
              </Button>
            </Link>
          </div>
          <div className='col-12 col-md-6 px-0'>
            <div className='primary-cover'>
              <div className='mask'></div>
              <div className='col-12 col-md-6 primary-text-mobile'>
                <h2>讓藝術走進您的生活</h2>
                <h4>
                  <span className='logo-text font-en-h2'>Olive Branch</span>{' '}
                  用最精緻的工藝
                  <br />
                  將世界級的藝術珍寶帶到您的所在之處
                </h4>
                <p>
                  無論是梵谷的星空、莫內的睡蓮，還是達文西的經典之作，我們精心製作高品質的名畫複製畫，讓每一筆觸、每一層色彩都能完美呈現原作的魅力。
                </p>
                <Link to='/products' className='w-100'>
                  <Button className='btn btn-primary w-100' variant='contained'>
                    現在就去逛逛
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='secondary-content-container'>
        <div className='container'>
          <ul className='secondary-content-items row'>
            {contentItems.map((item, index) => (
              <li
                className={`${index === 1 ? 'flex-md-row-reverse' : 'flex-md-row'}`}
                data-aos={`${index === 1 ? 'fade-left' : 'fade-right'}`}
                key={index}
              >
                <img
                  className='col-12 col-md-6'
                  src={item.imgUrl}
                  alt={item.title}
                />
                <div className='secondary-text col-12 col-md-6'>
                  <h3>{item.title}</h3>
                  <p>{item.content}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='container-fluid position-relative p-0'>
        <div className='coupon-mask'></div>
        <div className='coupon-block'>
          <h2 className='text-white z-1'>使用 coupon 取得七折優惠</h2>
          <Button
            className='btn btn-primary'
            variant='contained'
            onClick={handleCopy}
          >
            點擊複製 coupon
          </Button>
        </div>
      </div>
      <div className='container'>
        <h2 className='block-title'>熱門作品</h2>
        <ul className='top-product-items'>
          {products.map((item) => (
            <li className='top-product-item' key={item.id} data-aos='flip-up'>
              <Link to={`/product/${item.id}`}>
                <img
                  src={item.imageUrl}
                  className='top-image-item'
                  alt={item.title}
                ></img>
              </Link>
              <div className='top-info-item'>
                <h3 className='font-zh-h3'>{item.title}</h3>
                <p className='font-en-h4-medium mb-0'>
                  TWD {formatPrice(item.price)}
                </p>
                <p className='font-en-p-regular text-secondary mb-0'>
                  <del>TWD {formatPrice(item.origin_price)}</del>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
