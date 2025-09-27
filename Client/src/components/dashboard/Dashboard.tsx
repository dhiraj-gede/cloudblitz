import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs.tsx';
import { EnquiryTable } from '../enquiry/EnquiryTable.tsx';
import { EnquiryModal } from '../enquiry/EnquiryModal.tsx';
import { useToast } from '../../hooks/useToast.ts';
import type { Enquiry } from '../../types/index.ts';
import { fetchEnquiries, deleteEnquiry } from '../../services/api.ts';
import { SearchBar } from './SearchBar.tsx';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | undefined>();
  const toast = useToast();

  useEffect(() => {
    const getEnquiries = async () => {
      setLoading(true);
      try {
        const statusFilter = activeTab !== 'all' ? activeTab : undefined;
        const response = await fetchEnquiries({ status: statusFilter });
        setEnquiries(response);
        setError('');
      } catch (err) {
        setError('Failed to load enquiries. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getEnquiries();
  }, [activeTab]);

  const filteredEnquiries = enquiries.filter((enquiry) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      enquiry.customerName.toLowerCase().includes(query) ||
      enquiry.email.toLowerCase().includes(query) ||
      enquiry.phone.includes(query) ||
      enquiry.message.toLowerCase().includes(query)
    );
  });

  const handleViewEnquiry = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

  const handleEditEnquiry = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

  const handleDeleteEnquiry = async (enquiry: Enquiry) => {
    if (
      window.confirm(`Are you sure you want to delete the enquiry from ${enquiry.customerName}?`)
    ) {
      try {
        await deleteEnquiry(enquiry.id);
        const updatedEnquiries = enquiries.filter((e) => e.id !== enquiry.id);
        setEnquiries(updatedEnquiries);
        toast.success(`Enquiry from ${enquiry.customerName} deleted successfully`);
      } catch (error) {
        console.error('Error deleting enquiry:', error);
        toast.error('Failed to delete enquiry');
      }
    }
  };

  const handleEnquirySuccess = async () => {
    try {
      const statusFilter = activeTab !== 'all' ? activeTab : undefined;
      const response = await fetchEnquiries({ status: statusFilter });
      setEnquiries(response);
    } catch (error) {
      console.error('Error refreshing enquiries:', error);
    }
  };

  return (
    <div className='space-y-8 max-w-6xl mx-auto'>
      <div className='flex justify-between items-center bg-card rounded-xl shadow-md p-6 border border-[hsl(var(--border))]'>
        <h1 className='text-3xl font-extrabold tracking-tight text-foreground'>
          Enquiry Management
        </h1>
        <button
          className='inline-flex items-center justify-center rounded-lg text-base font-semibold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/80 shadow-md h-11 px-6 py-2'
          onClick={() => {
            setSelectedEnquiry(undefined);
            setIsModalOpen(true);
          }}
        >
          <span className='mr-2 text-lg'>+</span> New Enquiry
        </button>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='mb-6 flex gap-2'>
          <TabsTrigger
            value='all'
            className='rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors'
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value='new'
            className='rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-colors'
          >
            New
          </TabsTrigger>
          <TabsTrigger
            value='in-progress'
            className='rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-colors'
          >
            In Progress
          </TabsTrigger>
          <TabsTrigger
            value='closed'
            className='rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-green-600 data-[state=active]:text-white transition-colors'
          >
            Closed
          </TabsTrigger>
        </TabsList>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <TabsContent value={activeTab} className='mt-6'>
          <div className='bg-card rounded-xl shadow-lg p-8 border border-[hsl(var(--border))]'>
            {loading ? (
              <div className='text-center text-muted-foreground py-12 text-lg animate-pulse'>
                Loading enquiries...
              </div>
            ) : error ? (
              <div className='text-center text-destructive py-12 text-lg'>{error}</div>
            ) : (
              <EnquiryTable
                enquiries={filteredEnquiries}
                onView={handleViewEnquiry}
                onEdit={handleEditEnquiry}
                onDelete={handleDeleteEnquiry}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        enquiry={selectedEnquiry}
        onSuccess={handleEnquirySuccess}
      />
    </div>
  );
};
