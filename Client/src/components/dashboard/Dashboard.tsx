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
        // Fetch enquiries based on the active tab
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

  // Filter enquiries based on search query
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

  // Handlers for enquiry actions
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
        // Refresh enquiries after deletion
        const updatedEnquiries = enquiries.filter((e) => e.id !== enquiry.id);
        setEnquiries(updatedEnquiries);
        toast.success(`Enquiry from ${enquiry.customerName} deleted successfully`);
      } catch (error) {
        console.error('Error deleting enquiry:', error);
        toast.error('Failed to delete enquiry');
      }
    }
  };

  // Refresh data after form submission
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
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold tracking-tight'>Enquiry Management</h1>
        <button
          className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
          onClick={() => {
            setSelectedEnquiry(undefined);
            setIsModalOpen(true);
          }}
        >
          New Enquiry
        </button>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <Tabs defaultValue='all' value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value='all'>All Enquiries</TabsTrigger>
          <TabsTrigger value='new'>New</TabsTrigger>
          <TabsTrigger value='in-progress'>In Progress</TabsTrigger>
          <TabsTrigger value='closed'>Closed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className='mt-6'>
          {loading ? (
            <div className='flex justify-center items-center h-48'>
              <div className='text-muted-foreground'>Loading enquiries...</div>
            </div>
          ) : error ? (
            <div className='flex justify-center items-center h-48'>
              <div className='text-destructive'>{error}</div>
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className='flex justify-center items-center h-48'>
              <div className='text-muted-foreground'>
                {searchQuery
                  ? 'No enquiries match your search criteria'
                  : 'No enquiries found in this category'}
              </div>
            </div>
          ) : (
            <EnquiryTable
              enquiries={filteredEnquiries}
              onView={handleViewEnquiry}
              onEdit={handleEditEnquiry}
              onDelete={handleDeleteEnquiry}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Enquiry Modal for Create/Edit */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        enquiry={selectedEnquiry}
        onSuccess={handleEnquirySuccess}
      />
    </div>
  );
};
