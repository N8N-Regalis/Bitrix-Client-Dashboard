import { useState, useMemo } from 'react';
import { PageHeader } from '../components/PageHeader';
import { FilterBar, FilterGroup } from '../components/FilterBar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useBitrixContacts } from '../hooks/useBitrixContacts';
import { cn } from '../utils/utils';
import { RefreshCw } from 'lucide-react';

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return dateString;
  }
}

export function ClientAssignments() {
  const { contacts, loading, error, refetch } = useBitrixContacts();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [selectedResponsible, setSelectedResponsible] = useState('All');
  const [selectedClientStatus, setSelectedClientStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const uniqueTeams = useMemo(() => {
    const teams = new Set(contacts.map(c => c.responsibleTeam));
    return ['All', ...Array.from(teams)];
  }, [contacts]);

  const uniqueResponsible = useMemo(() => {
    const people = new Set(contacts.map(c => c.responsiblePerson));
    return ['All', ...Array.from(people)];
  }, [contacts]);

  const uniqueClientStatuses = useMemo(() => {
    const statuses = new Set(contacts.map(c => c.clientStatus));
    return ['All', ...Array.from(statuses)];
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesTeam = selectedTeam === 'All' || contact.responsibleTeam === selectedTeam;
      const matchesResponsible = selectedResponsible === 'All' || contact.responsiblePerson === selectedResponsible;
      const matchesClientStatus = selectedClientStatus === 'All' || contact.clientStatus === selectedClientStatus;
      const matchesSearch = !searchQuery || 
        contact.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTeam && matchesResponsible && matchesClientStatus && matchesSearch;
    });
  }, [contacts, selectedTeam, selectedResponsible, selectedClientStatus, searchQuery]);

  async function handleRefresh() {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <PageHeader 
        title="Client Assignments" 
        subtitle="View and filter client assignments"
      >
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className={cn('w-5 h-5', refreshing && 'animate-spin')} />
        </button>
      </PageHeader>

      <FilterBar>
        <FilterGroup label="Team">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="select-field"
          >
            {uniqueTeams.map(team => (
              <option key={team} value={team}>{team}</option>
            ))}
          </select>
        </FilterGroup>
        <FilterGroup label="Responsible Person">
          <select
            value={selectedResponsible}
            onChange={(e) => setSelectedResponsible(e.target.value)}
            className="select-field"
          >
            {uniqueResponsible.map(person => (
              <option key={person} value={person}>{person}</option>
            ))}
          </select>
        </FilterGroup>
        <FilterGroup label="Client Status">
          <select
            value={selectedClientStatus}
            onChange={(e) => setSelectedClientStatus(e.target.value)}
            className="select-field"
          >
            {uniqueClientStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </FilterGroup>
        <FilterGroup label="Search">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Name..."
            className="select-field"
          />
        </FilterGroup>
      </FilterBar>

      <div className="card overflow-hidden mx-6 mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="table-th text-left">Client Name</th>
              <th className="table-th text-left">Team</th>
              <th className="table-th text-left">Client Status</th>
              <th className="table-th text-left">Responsible Person</th>
              <th className="table-th text-left">Deal Flow Start Date</th>
              <th className="table-th text-left">Onboarding Call Date</th>
              <th className="table-th text-left">Date Offboarded</th>
              <th className="table-th text-left">Date Paused</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map(contact => (
              <tr key={contact.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="table-td font-medium">{contact.fullName || 'N/A'}</td>
                <td className="table-td">
                  {contact.responsibleTeam && (
                    <span 
                      className={cn(
                        'inline-block px-2 py-0.5 rounded text-xs font-medium',
                        contact.responsibleTeam === 'EA' && 'bg-indigo-100 text-indigo-800',
                        contact.responsibleTeam === 'Lemon' && 'bg-yellow-100 text-yellow-800',
                        contact.responsibleTeam === 'Racquel' && 'bg-green-100 text-green-800',
                        contact.responsibleTeam === 'Rox' && 'bg-red-100 text-red-800',
                        contact.responsibleTeam === 'Unassigned' && 'bg-gray-100 text-gray-800'
                      )}
                    >
                      {contact.responsibleTeam}
                    </span>
                  )}
                  {!contact.responsibleTeam && 'Unassigned'}
                </td>
                <td className="table-td">
                  {contact.clientStatus && (
                    <span 
                      className={cn(
                        'inline-block px-2 py-0.5 rounded text-xs font-medium',
                        contact.clientStatus === 'Deal Flow' && 'bg-blue-100 text-blue-800',
                        contact.clientStatus === 'Post LOI' && 'bg-purple-100 text-purple-800',
                        contact.clientStatus === 'Closing Stage' && 'bg-yellow-100 text-yellow-800',
                        contact.clientStatus === 'Deal Closed' && 'bg-green-100 text-green-800',
                        contact.clientStatus === 'Closed Lost' && 'bg-red-100 text-red-800',
                        contact.clientStatus === 'Rescinded' && 'bg-red-100 text-red-800',
                        contact.clientStatus === 'Terminated' && 'bg-red-100 text-red-800',
                        contact.clientStatus === 'Paused' && 'bg-gray-100 text-gray-800',
                        contact.clientStatus === 'Setting Up' && 'bg-indigo-100 text-indigo-800',
                        contact.clientStatus === 'Unassigned' && 'bg-gray-100 text-gray-800'
                      )}
                    >
                      {contact.clientStatus}
                    </span>
                  )}
                  {!contact.clientStatus && 'Unassigned'}
                </td>
                <td className="table-td">
                  <span className="font-medium">{contact.responsiblePerson}</span>
                </td>
                <td className="table-td">{formatDate(contact.dealFlowStartDate)}</td>
                <td className="table-td">{formatDate(contact.onboardingCallDate)}</td>
                <td className="table-td">{formatDate(contact.dateOffboarded)}</td>
                <td className="table-td">{formatDate(contact.datePaused)}</td>
              </tr>
            ))}
            {filteredContacts.length === 0 && (
              <tr>
                <td colSpan={8} className="table-td text-center text-gray-500 py-8">
                  No contacts found matching the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
