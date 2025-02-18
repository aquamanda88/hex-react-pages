import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { OrdersDatum, ProductsDatum } from '../core/models/order.model';
import {
  formatDate,
  formatPrice,
  formatUnknownText,
} from '../services/formatValue.service';
import ordersApiService from '../services/api/user/orders.service';
import { Button } from '@mui/material';
import { Spinners } from '../components/Index';

export default function OrderDetail() {
  const [isFullScreenLoading, setIsFullScreenLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrdersDatum>();
  const [products, setProducts] = useState<ProductsDatum>({});
  const { id } = useParams();

  /**
   * 呼叫取得訂單列表 API
   *
   * @param page - 選取頁數
   */
  const getOrders = async () => {
    setIsFullScreenLoading(true);

    ordersApiService
      .getOrders()
      .then(({ data: { orders } }) => {
        const selectedOrder =
          orders.find((item: OrdersDatum) => item.id === id) || null;
        setProducts(selectedOrder ? selectedOrder.products : {});
        setSelectedOrder(selectedOrder);
      })
      .finally(() => {
        setIsFullScreenLoading(false);
      });
  };

  useEffect(() => {
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h2 className='page-title'>訂單資訊</h2>
      <div className='container py-4'>
        <div className={`${isFullScreenLoading ? 'd-flex' : 'd-none'} loading`}>
          <Spinners />
        </div>
        <div className='table-responsive-lg'>
          <table className='cart-table table'>
            <thead className='text-center table-light'>
              <tr className='align-baseline'>
                <th>作品縮圖</th>
                <th>作品名稱</th>
                <th>作品資訊</th>
                <th className='text-end'>單價</th>
                <th>數量</th>
                <th className='text-end'>總計</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(products)?.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img
                      className='cart-image'
                      src={item.product.imageUrl}
                      alt={item.product.content?.name}
                    />
                  </td>
                  <td className='text-start'>
                    <p>{item.product.title}</p>
                    <p>
                      <small>({item.product.content?.name})</small>
                    </p>
                  </td>
                  <td className='text-start'>
                    <p>
                      作者：
                      {formatUnknownText(
                        'artists_zh_tw',
                        item.product.content?.artists_zh_tw
                      )}
                    </p>
                    <p>
                      媒材：
                      {item.product.category}
                    </p>
                  </td>
                  <td className='text-end col-md-2'>
                    <p className='font-en-p-medium'>
                      TWD {formatPrice(item.product.price)}
                    </p>
                  </td>
                  <td className='col-md-1'>{item.qty}</td>
                  <td className='text-end col-md-2'>
                    <p className='font-en-p-medium'>
                      TWD {formatPrice(item.final_total)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='row justify-content-end'>
          <div className='col-12 col-lg-6'>
            <ul className='mb-4'>
              <li>
                訂購人姓名：
                {selectedOrder?.user?.name}
              </li>
              <li>
                電子信箱：
                {selectedOrder?.user?.email}
              </li>
              <li>
                聯絡電話：
                {selectedOrder?.user?.tel}
              </li>
              <li>
                寄送地址：
                {selectedOrder?.user?.address}
              </li>
              <li>
                訂單成立時間：
                {formatDate(selectedOrder?.create_at ?? 0)}
              </li>
              <li>
                訂單付款狀態：
                {selectedOrder?.is_paid ? '已付款' : '未付款'}
              </li>
            </ul>
          </div>
          <div className='col-12 col-lg-6'>
            <div className='d-flex justify-content-between'>
              <h4>總金額</h4>
              <h3>TWD {formatPrice(selectedOrder?.total)}</h3>
            </div>
            <div className='row'>
              <div className='col-12'>
                <Link to='/products' className='w-100'>
                  <Button className='btn btn-primary w-100' variant='contained'>
                    先逛逛
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
