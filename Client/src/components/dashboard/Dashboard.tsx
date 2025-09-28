import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs.tsx';
import { EnquiryTable } from '../enquiry/EnquiryTable.tsx';
import { EnquiryModal } from '../enquiry/EnquiryModal.tsx';
import { useToast } from '../../hooks/useToast.ts';
import type { Enquiry } from '../../types/index.ts';
import { fetchEnquiries, deleteEnquiry } from '../../services/api.ts';
import type { User } from '../../types/index.ts';
import { fetchUsers } from '../../services/api.ts';
import { SearchBar } from './SearchBar.tsx';
import {
  Plus,
  Search,
  Filter,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  ChevronDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card.tsx';

export const Dashboard: React.FC<{ role?: string }> = ({ role }) => {
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [userOptions, setUserOptions] = useState<{ id: string; name: string }[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | undefined>();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [meta, setMeta] = useState<{ [key: string]: string | number | boolean | undefined }>({});
  const [showFilters, setShowFilters] = useState(false);
  const toast = useToast();

  // Only admin can assign enquiries, so pass assignment props only if role is 'admin'
  const isAdmin = role === 'admin';

  useEffect(() => {
    // Fetch users for admin filter
    if (role === 'admin') {
      fetchUsers().then((users: User[]) => {
        setUserOptions(users.map((u) => ({ id: u.id, name: u.name })));
      });
    }
    const getEnquiries = async () => {
      setLoading(true);
      try {
        const statusFilter = activeTab !== 'all' ? activeTab : undefined;
        const response = await fetchEnquiries({
          status: statusFilter,
          page,
          limit,
          search: searchQuery,
          assignedTo: isAdmin && assignedTo ? assignedTo : undefined,
        });
        if (response && response.meta) {
          setEnquiries(response.data || []);
          setTotalPages(response.meta.totalPages || 1);
          setTotal(response.meta.total || 0);
          setMeta(response.meta || {});
        } else {
          setEnquiries(response.data || []);
          setMeta(response.meta || {});
          setTotalPages(1);
          setTotal(response.data?.length || 0);
        }
        setError('');
      } catch (err) {
        setError('Failed to load enquiries. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getEnquiries();
  }, [activeTab, page, limit, assignedTo, searchQuery, role, isAdmin]);

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
      const response = await fetchEnquiries({ status: statusFilter, page, limit });
      if (response && response.meta) {
        setEnquiries(response.data || []);
        setTotalPages(response.meta.totalPages || 1);
        setTotal(response.meta.total || 0);
      } else {
        setEnquiries(response.data || []);
        setTotalPages(1);
        setTotal(response?.meta?.total || 0);
      }
    } catch (error) {
      console.error('Error refreshing enquiries:', error);
    }
  };

  // Helper functions for stats
  const getTabCount = (status: string) => {
    if (status === 'all') return meta?.absoluteTotal ? meta.absoluteTotal : enquiries.length;
    if (status === 'new')
      return meta?.newCount ? meta.newCount : enquiries.filter((e) => e.status === 'new').length;
    if (status === 'in-progress')
      return meta?.inProgressCount
        ? meta.inProgressCount
        : enquiries.filter((e) => e.status === 'in-progress').length;
    if (status === 'closed')
      return meta?.closedCount
        ? meta.closedCount
        : enquiries.filter((e) => e.status === 'closed').length;
  };

  // type StatusType = 'new' | 'in-progress' | 'closed';
  // const getStatusConfig = (status: string) => {
  //   const configs: Record<StatusType, { icon: typeof AlertCircle; color: string; bg: string }> = {
  //     new: { icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  //     'in-progress': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  //     closed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  //   };
  //   if (status in configs) {
  //     return configs[status as StatusType];
  //   }
  //   return configs.new;
  // };

  return (
  <div className='space-y-6 max-w-7xl mx-auto dashboard-tutorial'>
      {/* Enhanced Header */}
      <div className='bg-card rounded-xl shadow-sm p-6 border border-[hsl(var(--border))]'>
        <div className='flex justify-between items-center'>
          <div className='space-y-1'>
            <h1 className='text-3xl font-bold tracking-tight text-foreground'>
              Enquiry Management
            </h1>
            <p className='text-muted-foreground'>Manage and track customer enquiries efficiently</p>
          </div>

          <button
            className='inline-flex items-center justify-center rounded-lg text-base font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md h-11 px-6 py-2 gap-2 new-enquiry-tutorial'
            onClick={() => {
              setSelectedEnquiry(undefined);
              setIsModalOpen(true);
            }}
          >
            <Plus className='w-5 h-5' />
            New Enquiry
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {[
          {
            status: 'all',
            label: 'Total Enquiries',
            icon: BarChart3,
            color: 'text-primary',
            bgColor: 'bg-primary/10',
            borderColor: 'border-primary/20',
          },
          {
            status: 'new',
            label: 'New Enquiries',
            icon: AlertCircle,
            color: 'text-info',
            bgColor: 'bg-info/10',
            borderColor: 'border-info/20',
          },
          {
            status: 'in-progress',
            label: 'In Progress',
            icon: Clock,
            color: 'text-warning',
            bgColor: 'bg-warning/10',
            borderColor: 'border-warning/20',
          },
          {
            status: 'closed',
            label: 'Completed',
            icon: CheckCircle,
            color: 'text-success',
            bgColor: 'bg-success/10',
            borderColor: 'border-success/20',
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.status} className={`border ${stat.borderColor} hover-lift`}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  {stat.label}
                </CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-foreground'>{getTabCount(stat.status)}</div>
                <p className='text-xs text-muted-foreground'>
                  {stat.status === 'all' ? 'All enquiries' : `${stat.label.toLowerCase()} cases`}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={(e: string) => {
          setActiveTab(e);
          setPage(1);
        }}
        className='w-full'
      >
        {/* Enhanced Tabs */}
        <div className='bg-card rounded-xl shadow-sm border border-[hsl(var(--border))] p-6'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
            <TabsList className='inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid w-full grid-cols-4 lg:w-auto'>
              {[
                { value: 'all', label: 'All' },
                { value: 'new', label: 'New' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'closed', label: 'Closed' },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className='inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2'
                >
                  {tab.label}
                  <span className='ml-1 rounded-full bg-muted-foreground/20 px-1.5 py-0.5 text-xs font-medium data-[state=active]:bg-primary/20 data-[state=active]:text-primary'>
                    {getTabCount(tab.value)}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Search and Filter Controls */}
            <div className='flex items-center gap-3 flex-1 lg:flex-none'>
              <div className='relative flex-1 lg:w-80'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
              </div>

              {isAdmin && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                    showFilters || assignedTo
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Filter className='w-4 h-4' />
                  Filters
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                  />
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {isAdmin && showFilters && (
            <div className='bg-muted/50 rounded-lg p-4 mb-6 border border-border/50'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-foreground'>Assigned To</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    <option className='text-black' value=''>
                      All Team Members
                    </option>
                    {userOptions.map((user) => (
                      <option className='text-black' key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {assignedTo && (
                <div className='flex items-center gap-2 mt-3'>
                  <span className='text-xs text-muted-foreground'>Active filter:</span>
                  <span className='inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium'>
                    <Users className='w-3 h-3' />
                    {userOptions.find((u) => u.id === assignedTo)?.name}
                    <button
                      onClick={() => setAssignedTo('')}
                      className='ml-1 hover:bg-primary/20 rounded-sm p-0.5'
                    >
                      ×
                    </button>
                  </span>
                </div>
              )}
            </div>
          )}

          <TabsContent value={activeTab} className='mt-0'>
            <div className='space-y-4'>
              {loading ? (
                <div className='bg-card rounded-lg p-12 text-center border border-[hsl(var(--border))]'>
                  <div className='inline-flex items-center gap-2 text-muted-foreground'>
                    <div className='w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin'></div>
                    Loading enquiries...
                  </div>
                </div>
              ) : error ? (
                <div className='bg-card rounded-lg p-12 text-center border border-destructive/20'>
                  <div className='text-destructive space-y-2'>
                    <AlertCircle className='w-12 h-12 mx-auto mb-3 opacity-50' />
                    <p className='font-medium'>{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className='text-sm text-muted-foreground hover:text-foreground underline'
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <EnquiryTable
                    enquiries={filteredEnquiries}
                    onView={handleViewEnquiry}
                    onEdit={handleEditEnquiry}
                    onDelete={handleDeleteEnquiry}
                    canAssign={isAdmin}
                  />

                  {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                    <div className='flex items-center justify-between pt-6 border-t border-border'>
                      <div className='text-sm text-muted-foreground'>
                        Showing page {page} of {totalPages} ({total} enquiries)
                      </div>
                      <div className='flex items-center gap-2'>
                        <button
                          className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2'
                          disabled={page === 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                          Previous
                        </button>
                        <div className='flex items-center gap-1'>
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (page <= 3) {
                              pageNum = i + 1;
                            } else if (page >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = page - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10 ${
                                  page === pageNum
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2'
                          disabled={page === totalPages}
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        enquiry={selectedEnquiry}
        onSuccess={handleEnquirySuccess}
        canAssign={isAdmin}
      />
    </div>
  );
};
