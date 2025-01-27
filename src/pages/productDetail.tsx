import { useEffect, useState } from 'react';
import productApiService from '../services/user/products.service';
import { useParams } from 'react-router-dom';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { ProductDatum } from '../core/models/utils.model';
import { Spinners } from '../components';

export default function ProductDetail() {
  const [isProductLoading, setIsProductLoading] = useState(true);
  const [product, setProduct] = useState<ProductDatum>({});
  const { id } = useParams();

  /**
   * 呼叫取得商品列表 API
   *
   * @prop page - 選取頁數
   */
  const getProductDetail = async (id: string) => {
    setIsProductLoading(true);

    productApiService
      .getProductDetail(id)
      .then(({ data: { product } }) => {
        setProduct(product);
      })
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  useEffect(() => {
    getProductDetail(id ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='container py-4'>
      <div className={`${isProductLoading ? 'd-flex' : 'd-none'} loading`}>
        <Spinners />
      </div>
      <h2>商品詳情頁</h2>
      <div className='row'>
        <div className='col col-6'>
          {product.imageUrl ? (
            <img src={product.imageUrl} className='object-fit' alt='主圖' />
          ) : (
            <InsertPhotoIcon className='no-image-icon' color='disabled' />
          )}
        </div>
        <div className='col col-6'>
          <h5>
            {product.content?.artists_zh_tw} ({product.content?.artists})
          </h5>
          <h2>{product.title}</h2>
          <h3><i>{product.content?.name}</i></h3>
          <h4>{product.content?.year}</h4>
          <h5><span className="badge rounded-pill bg-primary">{product.category}</span></h5>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}
