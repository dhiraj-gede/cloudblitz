import React, { useState } from 'react';
import {
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import type { Enquiry } from '../../types/index.ts';

interface EnquiryTableProps {
  enquiries: Enquiry[];
  onView?: (enquiry: Enquiry) => void;
  onEdit?: (enquiry: Enquiry) => void;
  onDelete?: (enquiry: Enquiry) => void;
  canAssign?: boolean;
}

export const EnquiryTable: React.FC<EnquiryTableProps> = ({
  enquiries,
  onView,
  onEdit,
  onDelete,
}) => {
  const [sortField, setSortField] = useState<keyof Enquiry>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Enquiry) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedEnquiries = [...enquiries].sort((a, b) => {
    const aValue = a[sortField] ?? '';
    const bValue = b[sortField] ?? '';

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusBadgeClass = (status: Enquiry['status']) => {
    const baseClasses = 'px-2 py-1 text-xs rounded-full font-medium';
    switch (status) {
      case 'new':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'in-progress':
        return `${baseClasses} bg-amber-100 text-amber-800`;
      case 'closed':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return baseClasses;
    }
  };
  type StatusType = 'new' | 'in-progress' | 'closed';
  const getStatusConfig = (status: string) => {
    const configs: Record<StatusType, { icon: typeof AlertCircle; color: string; bg: string }> = {
      new: { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
      'in-progress': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
      closed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    };
    if (status in configs) {
      return configs[status as StatusType];
    }
    return configs.new;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const SortIcon = ({ field }: { field: keyof Enquiry }) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className='w-4 h-4' />
    ) : (
      <ChevronDown className='w-4 h-4' />
    );
  };

  const renderSortableHeader = (label: string, field: keyof Enquiry) => (
    <th
      className='px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground'
      onClick={() => handleSort(field)}
    >
      <div className='flex items-center gap-1'>
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  );

  return (
    <div className='overflow-x-auto rounded-xl border border-[hsl(var(--border))] shadow-lg bg-card'>
      <table className='min-w-full divide-y divide-border'>
        <thead className='bg-muted'>
          <tr>
            {renderSortableHeader('Customer', 'customerName')}
            {renderSortableHeader('Email', 'email')}
            <th className='px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
              Phone
            </th>
            {renderSortableHeader('Status', 'status')}
            <th className='px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
              Assigned To
            </th>
            {renderSortableHeader('Date', 'createdAt')}
            <th className='px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='bg-background divide-y divide-border'>
          {sortedEnquiries.map((enquiry) => (
            <tr key={enquiry.id} className='hover:bg-muted/50'>
              <td className='px-4 py-3 whitespace-nowrap'>
                <div className='font-medium text-foreground'>{enquiry.customerName}</div>
              </td>
              <td className='px-4 py-3 whitespace-nowrap'>
                <div className='text-muted-foreground'>{enquiry.email}</div>
              </td>
              <td className='px-4 py-3 whitespace-nowrap'>
                <div className='text-muted-foreground'>{enquiry.phone}</div>
              </td>
              <td className='px-4 py-3 whitespace-nowrap'>
                <span
                  className={
                    getStatusBadgeClass(enquiry.status) +
                    ' flex items-center gap-2 shadow-sm border border-border/30 bg-opacity-90 backdrop-blur-sm'
                  }
                  style={{ minWidth: 110, justifyContent: 'flex-start', display: 'inline-flex' }}
                >
                  <span className='flex items-center justify-center rounded-full bg-white/60 p-0.5 mr-1 shadow'>
                    {React.createElement(getStatusConfig(enquiry.status).icon, {
                      className: `w-4 h-4 ${getStatusConfig(enquiry.status).color}`,
                    })}
                  </span>
                  <span className='capitalize font-semibold tracking-wide'>
                    {enquiry.status.replace('-', ' ')}
                  </span>
                </span>
              </td>
              <td className='px-4 py-3 whitespace-nowrap'>
                <div className='text-muted-foreground'>{enquiry.assignedTo?.name}</div>
              </td>
              <td className='px-4 py-3 whitespace-nowrap text-muted-foreground'>
                {formatDate(enquiry.createdAt)}
              </td>
              <td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-start space-x-2'>
                <button
                  onClick={() => onView?.(enquiry)}
                  className='text-blue-600 hover:text-blue-900'
                >
                  <span className='sr-only'>View</span>
                  <Eye className='w-4 h-4' />
                </button>
                <button
                  onClick={() => onEdit?.(enquiry)}
                  className='text-amber-600 hover:text-amber-900'
                >
                  <span className='sr-only'>Edit</span>
                  <Pencil className='w-4 h-4' />
                </button>
                <button
                  onClick={() => onDelete?.(enquiry)}
                  className='text-rose-600 hover:text-rose-900'
                >
                  <span className='sr-only'>Delete</span>
                  <Trash2 className='w-4 h-4' />
                </button>
                {/* Assignment actions can be added here if canAssign is true */}
                {/* Example: {canAssign && <AssignButton ... />} */}
              </td>
            </tr>
          ))}
          {sortedEnquiries.length === 0 && (
            <tr>
              <td colSpan={6} className='px-4 py-8 text-center text-muted-foreground'>
                No enquiries found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
