import React from 'react';
import { IconButton } from '@mui/material';
import { ProductFullDatum } from '../core/models/utils.model';
import { Check, Close, Delete, Edit } from './icons';
import {
  formatPrice,
  formatUnknownText,
} from '../services/formatValue.service';

type TableProps = {
  /** 資料 */
  data: ProductFullDatum[];
  /** 處理開啟編輯商品 modal 事件 */
  handleEditOpen: (editItem?: ProductFullDatum) => void;
  /** 處理開啟刪除商品 modal 事件 */
  handleDeleteOpen: (deleteItem: ProductFullDatum) => void;
};

const Table: React.FC<TableProps> = ({
  data,
  handleEditOpen,
  handleDeleteOpen,
}) => {
  return (
    <table className='table table-striped table-bordered table-sm mb-0'>
      <thead className='text-center'>
        <tr>
          <th>作品名稱</th>
          <th>作品原文名稱</th>
          <th>作者名稱</th>
          <th>原價</th>
          <th>售價</th>
          <th>是否啟用</th>
          <th>修改</th>
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          data.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{formatUnknownText('name', item.content?.name)}</td>
              <td>{formatUnknownText('artists_zh_tw', item.content?.artists_zh_tw)}</td>
              <td className='text-end'>{formatPrice(item.origin_price)}</td>
              <td className='text-end'>{formatPrice(item.price)}</td>
              <td
                className={`${item.is_enabled ? 'text-success' : 'text-danger'} text-center`}
              >
                {item.is_enabled ? <Check /> : <Close />}
              </td>
              <td className='text-center'>
                <IconButton
                  onClick={() => {
                    handleEditOpen(item);
                  }}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleDeleteOpen(item);
                  }}
                >
                  <Delete sx={{ color: '#dc3545' }} />
                </IconButton>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td className='text-center' colSpan={7}>
              尚無產品資料
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
