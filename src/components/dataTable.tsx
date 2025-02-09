import { ReactNode } from 'react';

export type Column<T> = {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  thClass?: string;
  tdClass?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  actions?: (item: T) => ReactNode;
};

const DataTable = <T,>({ data, columns, actions }: DataTableProps<T>) =>{
  return (
    <table className='table table-striped table-bordered table-sm mb-0'>
      <thead className='text-center'>
      <tr>
          {columns.map((col, index) => (
            <th key={index} className={col.thClass}>{col.header}</th>
          ))}
          {actions && <th>操作</th>}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex} className={col.tdClass}>
                  {typeof col.accessor === 'function'
                    ? col.accessor(item)
                    : (item[col.accessor] as ReactNode)}
                </td>
              ))}
              {actions && <td className='text-center'>{actions(item)}</td>}
            </tr>
          ))
        ) : (
          <tr>
            <td className='text-center' colSpan={columns.length + (actions ? 1 : 0)}>
              尚無資料
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DataTable;
