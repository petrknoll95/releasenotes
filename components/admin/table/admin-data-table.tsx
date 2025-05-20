import React, { ReactNode } from 'react';
import AdminTable from './admin-table';
import AdminTableHeader from './admin-table-header';

interface AdminDataTableProps<T> {
  columns: string[];
  data: T[];
  renderRow: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  className?: string;
}

/**
 * Complete data table component that handles rendering,
 * loading states, and empty states with consistent styling
 */
export default function AdminDataTable<T>({
  columns,
  data,
  renderRow,
  keyExtractor,
  loading = false,
  loadingText = 'Loading...',
  emptyText = 'No data found',
  className = '',
}: AdminDataTableProps<T>) {
  return (
    <AdminTable
      loading={loading}
      isEmpty={data.length === 0 && !loading}
      loadingText={loadingText}
      emptyText={emptyText}
      className={className}
    >
      <AdminTableHeader columns={columns} />
      <tbody>
        {data.map((item, index) => (
          <React.Fragment key={keyExtractor(item)}>
            {renderRow(item, index)}
          </React.Fragment>
        ))}
      </tbody>
    </AdminTable>
  );
} 