import { useMemo } from 'react';
import { PageHeader } from '../components/PageHeader';
import { KpiCard } from '../components/KpiCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { useBitrixContacts } from '../hooks/useBitrixContacts';
import { TEAMS } from '../utils/utils';
import { 
  Users, 
  Building, 
  AlertTriangle, 
  User,
  TrendingUp,
  Award
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, CartesianGrid, Cell, PieChart, Pie } from 'recharts';


export function ContactsDashboard() {
  const { contacts, loading, error } = useBitrixContacts();

  const kpiData = useMemo(() => {
    const total = contacts.length;
    const contactsByTeam = {};
    TEAMS.forEach(team => {
      contactsByTeam[team] = contacts.filter(c => c.responsibleTeam === team).length;
    });
    const unassigned = contacts.filter(c => c.clientStatus === 'Deal Flow' && c.responsiblePerson === 'Admin Account').length;
    const active = contacts.filter(c => c.clientStatus === 'Deal Flow').length;

    return {
      total,
      contactsByTeam,
      unassigned,
      active,
    };
  }, [contacts]);

  const statusColors = {
    'Deal Flow': '#3b82f6',
    'Post LOI': '#a855f7',
    'Closing Stage': '#eab308',
    'Deal Closed': '#22c55e',
    'Closed Lost': '#ef4444',
    'Rescinded': '#ef4444',
    'Terminated': '#ef4444',
    'Paused': '#6b7280',
    'Setting Up': '#6366f1',
    'Unassigned': '#9ca3af',
  };

  const clientStatusDistribution = useMemo(() => {
    const statusCounts = {};
    contacts.forEach(contact => {
      const status = contact.clientStatus || 'Unassigned';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts)
      .map(([name, value]) => ({ 
        name, 
        value,
        fill: statusColors[name] || '#9ca3af'
      }))
      .sort((a, b) => b.value - a.value);
  }, [contacts]);

  const teamMetrics = useMemo(() => {
    return TEAMS.map(team => {
      const teamContacts = contacts.filter(c => c.responsibleTeam === team);
      const assigned = teamContacts.length;

      return {
        team,
        assigned,
      };
    });
  }, [contacts]);

  const teamAllocationData = useMemo(() => {
    const colors = ['#3b82f6', '#22c55e', '#a855f7', '#eab308'];
    return teamMetrics.map((metric, index) => ({
      name: `Team ${metric.team}`,
      value: metric.assigned,
      fill: colors[index % colors.length],
    })).filter(item => item.value > 0);
  }, [teamMetrics]);

  const dealFlowStartsByMonth = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const yearMonthMap = {};

    contacts.forEach(contact => {
      if (contact.dealFlowStartDate && contact.clientStatus === 'Deal Flow') {
        const date = new Date(contact.dealFlowStartDate);
        if (!isNaN(date)) {
          const year = date.getFullYear();
          const month = date.getMonth();
          const key = `${year}-${month}`;

          if (!yearMonthMap[key]) {
            yearMonthMap[key] = { year, month, count: 0 };
          }
          yearMonthMap[key].count++;
        }
      }
    });

    const monthData = monthNames.map((monthName, monthIndex) => {
      const yearCounts = {};
      Object.values(yearMonthMap).forEach(({ year, month, count }) => {
        if (month === monthIndex) {
          yearCounts[year] = count;
        }
      });

      return {
        name: monthName,
        ...yearCounts,
      };
    });

    const allYears = [...new Set(Object.values(yearMonthMap).map(({ year }) => year))].sort((a, b) => b - a);
    const years = allYears.slice(0, 5);
    const yearColors = {
      [years[0]]: '#3b82f6',
      [years[1]]: '#22c55e',
      [years[2]]: '#a855f7',
      [years[3]]: '#eab308',
      [years[4]]: '#f97316',
    };

    return { data: monthData, years, yearColors, hasMoreYears: allYears.length > 5 };
  }, [contacts]);

  const offboardedByMonth = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const yearMonthMap = {};

    contacts.forEach(contact => {
      if (contact.dateOffboarded) {
        const date = new Date(contact.dateOffboarded);
        if (!isNaN(date)) {
          const year = date.getFullYear();
          const month = date.getMonth();
          const key = `${year}-${month}`;

          if (!yearMonthMap[key]) {
            yearMonthMap[key] = { year, month, count: 0 };
          }
          yearMonthMap[key].count++;
        }
      }
    });

    const monthData = monthNames.map((monthName, monthIndex) => {
      const yearCounts = {};
      Object.values(yearMonthMap).forEach(({ year, month, count }) => {
        if (month === monthIndex) {
          yearCounts[year] = count;
        }
      });

      return {
        name: monthName,
        ...yearCounts,
      };
    });

    const allYears = [...new Set(Object.values(yearMonthMap).map(({ year }) => year))].sort((a, b) => b - a);
    const years = allYears.slice(0, 5);

    return { data: monthData, years, hasMoreYears: allYears.length > 5 };
  }, [contacts]);


  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <PageHeader 
        title="Client Dashboard" 
        subtitle="Overview of clients in Bitrix"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6 pb-4">
        <KpiCard 
          label="Total Clients" 
          value={kpiData.total} 
          color="indigo"
          icon={Users}
          description="Total number of contacts in Bitrix CRM"
        />
        <KpiCard 
          label="Clients Assigned to Team" 
          value={Object.values(kpiData.contactsByTeam).reduce((a, b) => a + b, 0)} 
          color="blue"
          icon={Building}
          description="Contacts assigned to teams"
        />
        <KpiCard 
          label="Unassigned Clients" 
          value={kpiData.unassigned} 
          color="yellow"
          icon={AlertTriangle}
          description="Contacts with Deal Flow status assigned to Admin Account"
        />
        <KpiCard 
          label="Active Clients" 
          value={kpiData.active} 
          color="indigo"
          icon={User}
          description="Contacts with Deal Flow status"
        />
      </div>

      <div className="card mx-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Status Distribution</h3>
        <div className="h-80">
          {clientStatusDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientStatusDistribution} margin={{ top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 'dataMax + 20']} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Count" fillKey="fill" label={{ position: 'top' }} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>

      <div className="card mx-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Distribution by Team</h3>
        <div className="h-80">
          {teamAllocationData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={teamAllocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {teamAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-6 mb-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Flow Starts by Year/Month</h3>
          <div className="overflow-x-auto">
            {dealFlowStartsByMonth.years.length > 0 ? (
              <table className="min-w-[600px] divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    {dealFlowStartsByMonth.years.map(year => (
                      <th key={year} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{year}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dealFlowStartsByMonth.data.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.name}</td>
                      {dealFlowStartsByMonth.years.map(year => (
                        <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row[year] || 0}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-500">
                No Deal Flow start date data available
              </div>
            )}
          </div>
          {dealFlowStartsByMonth.hasMoreYears && (
            <p className="text-xs text-gray-500 mt-2 px-6">Showing most recent 5 years. Scroll horizontally for more years.</p>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Offboarded Clients by Year/Month</h3>
          <div className="overflow-x-auto">
            {offboardedByMonth.years.length > 0 ? (
              <table className="min-w-[600px] divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    {offboardedByMonth.years.map(year => (
                      <th key={year} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{year}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {offboardedByMonth.data.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.name}</td>
                      {offboardedByMonth.years.map(year => (
                        <td key={year} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row[year] || 0}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-40 text-gray-500">
                No offboarded date data available
              </div>
            )}
          </div>
          {offboardedByMonth.hasMoreYears && (
            <p className="text-xs text-gray-500 mt-2 px-6">Showing most recent 5 years. Scroll horizontally for more years.</p>
          )}
        </div>
      </div>

    </div>
  );
}
