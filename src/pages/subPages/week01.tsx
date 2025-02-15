import { useState } from 'react';
import Header from '../../components/Header';
import { ProductFullDatum } from '../../core/models/utils.model';

export default function Week01() {
  const [selectedProduct, setSelectedProduct] = useState<ProductFullDatum>();
  const [products] = useState<ProductFullDatum[]>([
    {
      category: '甜甜圈',
      content: {content: '尺寸：14x14cm'},
      description:
        '濃郁的草莓風味，中心填入滑順不膩口的卡士達內餡，帶來滿滿幸福感！',
      id: '-L9tH8jxVb2Ka_DYPwng',
      is_enabled: 1,
      origin_price: 150,
      price: 99,
      title: '草莓莓果夾心圈',
      unit: '元',
      num: 10,
      imageUrl: 'https://images.unsplash.com/photo-1583182332473-b31ba08929c8',
      imagesUrl: [
        'https://images.unsplash.com/photo-1626094309830-abbb0c99da4a',
        'https://images.unsplash.com/photo-1559656914-a30970c1affd',
      ],
    },
    {
      category: '蛋糕',
      content: {content: '尺寸：6寸'},
      description:
        '蜜蜂蜜蛋糕，夾層夾上酸酸甜甜的檸檬餡，清爽可口的滋味讓人口水直流！',
      id: '-McJ-VvcwfN1_Ye_NtVA',
      is_enabled: 1,
      origin_price: 1000,
      price: 900,
      title: '蜂蜜檸檬蛋糕',
      unit: '個',
      num: 1,
      imageUrl:
        'https://images.unsplash.com/photo-1627834377411-8da5f4f09de8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1001&q=80',
      imagesUrl: [
        'https://images.unsplash.com/photo-1618888007540-2bdead974bbb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=987&q=80',
      ],
    },
    {
      category: '蛋糕',
      content: {content: '尺寸：6寸'},
      description: '法式煎薄餅加上濃郁可可醬，呈現經典的美味及口感。',
      id: '-McJ-VyqaFlLzUMmpPpm',
      is_enabled: 1,
      origin_price: 700,
      price: 600,
      title: '暗黑千層',
      unit: '個',
      num: 15,
      imageUrl:
        'https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDZ8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60',
      imagesUrl: [
        'https://images.unsplash.com/flagged/photo-1557234985-425e10c9d7f1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTA5fHxjYWtlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60',
        'https://images.unsplash.com/photo-1540337706094-da10342c93d8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDR8fGNha2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60',
      ],
    },
    {
      category: '蛋糕',
      content: {content: '尺寸：6寸'},
      description: '好好吃杯子蛋糕。',
      id: '-Jd3-N8dLFlLzUMPS3pm',
      is_enabled: 1,
      origin_price: 60,
      price: 40,
      title: '杯子蛋糕',
      unit: '個',
      num: 20,
      imageUrl:
        'https://plus.unsplash.com/premium_photo-1663840296989-bea67a6925c3?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      imagesUrl: [
        'https://plus.unsplash.com/premium_photo-1663840297086-dbd47bccef74?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      ],
    },
  ]);
  return (
    <>
      <Header title='從函式拆解認識設計模式' />
      <div className='container py-4'>
        <div className='row flex-column justify-content-center align-items-center'>
          <div className='col-lg-6'>
            <h2>產品列表</h2>
            <div className='card mb-4'>
              <table className='table table-hover mb-0'>
                <thead className='text-center'>
                  <tr>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody className='text-center'>
                  {products && products.length > 0 ? (
                    products.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.origin_price}</td>
                        <td>{item.price}</td>
                        <td
                          className={
                            item.is_enabled ? 'text-success' : 'text-danger'
                          }
                        >
                          {item.is_enabled ? '啟用' : '未啟用'}
                        </td>
                        <td>
                          <button
                            className='btn btn-secondary rounded-pill w-100'
                            onClick={() => setSelectedProduct(item)}
                          >
                            查看細節
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>尚無產品資料</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className='col-lg-6'>
            <h2>單一產品細節</h2>
            {selectedProduct ? (
              <div className='card mb-3'>
                <img
                  src={selectedProduct.imageUrl}
                  className='rounded'
                  style={{objectFit: 'cover', maxWidth: '100%', height: '250px'}}
                  height={200}
                  alt='主圖'
                />
                <div className='card-body'>
                  <h5 className='card-title'>
                    {selectedProduct.title}
                    <span className='badge rounded-pill bg-secondary ms-2'>
                      {selectedProduct.category}
                    </span>
                  </h5>
                  <p className='card-text'>
                    商品描述：{selectedProduct?.content?.content}
                  </p>
                  <div className='d-flex align-items-center'>
                    <p className='fs-5 mb-0 me-2'>
                      <strong>${selectedProduct.price}</strong>
                    </p>
                    <p className='card-text text-secondary'>
                      <del>${selectedProduct.origin_price}</del>
                    </p>
                  </div>
                  <h5 className='mt-3'>更多圖片：</h5>
                  <div className='d-flex flex-wrap'>
                    {selectedProduct.imagesUrl?.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        style={{objectFit: 'cover', width: '150px', height: '150px', marginRight: '8px'}}
                        width={200}
                        height={200}
                        alt='副圖'
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className='text-secondary'>請選擇一個商品查看</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
