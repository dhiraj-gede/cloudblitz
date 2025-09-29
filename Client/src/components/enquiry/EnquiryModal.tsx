import * as React from 'react';
import { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog.tsx';
import { EnquiryForm } from './EnquiryForm.tsx';
import { useToast } from '../../hooks/useToast.ts';
import type { Enquiry } from '../../types/index.ts';
import { createEnquiry, updateEnquiry } from '../../services/api.ts';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiry?: Enquiry;
  onSuccess: () => void;
  canAssign?: boolean;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  enquiry,
  onSuccess,
  canAssign = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();
  const isEditing = !!enquiry?.id;

  const handleSubmit = async (
    data: Omit<Enquiry, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ) => {
    try {
      setIsSubmitting(true);
      console.log(
        'handleSubmit called with data:',
        data,
        'isEditing:',
        isEditing,
        'enquiry:',
        enquiry
      );
      if (isEditing && enquiry?.id) {
        console.log('Submitting enquiry data:', data);
        await updateEnquiry(enquiry.id, { ...data, assignedTo: data.assignedTo?.id || undefined });
        success(`Enquiry from ${data.customerName} updated successfully`);
      } else {
        await createEnquiry({ ...data, assignedTo: data.assignedTo?.id || undefined });
        success(`New enquiry from ${data.customerName} created`);
      }

      onSuccess();
      onClose();
    } catch (err) {
      onClose();
      console.error('Failed to save enquiry:', err);
      error(`Failed to ${isEditing ? 'update' : 'create'} enquiry\n`);
      error(`${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className='sm:max-w-5xl w-full max-h-[90vh] overflow-y-auto'>
        <EnquiryForm
          enquiry={enquiry}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          canAssign={canAssign}
        />
      </DialogContent>
    </Dialog>
  );
};
