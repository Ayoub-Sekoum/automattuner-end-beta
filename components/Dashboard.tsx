import React from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { IntuneApp, AppStatus } from '../types';
import { Activity, ShieldCheck, AlertOctagon, Layers, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  apps: IntuneApp[];
}

const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-panel)] border border-[var(--border-color)] p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-[var(--text-primary)] text-sm font-medium mb-1">{label}</p>
        <p className="text-indigo-500 text-xs font-mono">
          {payload[0].value} units
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard: React.FC<DashboardProps> = ({ apps }) => {
  const successCount = apps.filter(a => a.status === AppStatus.SUCCESS).length;
  const errorCount = apps.filter(a => a.status === AppStatus.ERROR).length;
  const processingCount = apps.filter(a => a.status === AppStatus.PACKAGING || a.status === AppStatus.UPLOADING).length;

  const data = [
    { name: 'Deployed', value: successCount },
    { name: 'Processing', value: processingCount },
    { name: 'Failed', value: errorCount },
  ];

  const activityData = [
    { name: 'Mon', uploads: 4 },
    { name: 'Tue', uploads: 7 },
    { name: 'Wed', uploads: 2 },
    { name: 'Thu', uploads: 12 },
    { name: 'Fri', uploads: 9 },
    { name: 'Sat', uploads: 5 },
    { name: 'Sun', uploads: 3 },
  ];

  const StatCard = ({ title, value, icon: Icon, colorClass, trend }: any) => (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 p-24 opacity-5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity group-hover:opacity-10 ${colorClass.replace('text-', 'bg-')}`}></div>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
           <span className="flex items-center text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
             <ArrowUpRight className="w-3 h-3 mr-1" />
             {trend}
           </span>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-1 tracking-tight">{value}</h3>
        <p className="text-[var(--text-secondary)] text-sm font-medium">{title}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Applications" value={apps.length} icon={Layers} colorClass="text-blue-500" trend="+12%" />
        <StatCard title="Successful Deploys" value={successCount} icon={ShieldCheck} colorClass="text-emerald-500" trend="+8%" />
        <StatCard title="Critical Failures" value={errorCount} icon={AlertOctagon} colorClass="text-red-500" />
        <StatCard title="Active Processes" value={processingCount} icon={Activity} colorClass="text-amber-500" />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        {/* Bar Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-[var(--border-color)] shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Upload Volume</h4>
            <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                <span className="text-xs text-[var(--text-secondary)]">Packages</span>
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip cursor={{ fill: 'var(--bg-card)' }} content={<CustomTooltip />} />
                <Bar dataKey="uploads" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-[var(--border-color)] shadow-xl flex flex-col">
          <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2 tracking-tight">Status Distribution</h4>
          <p className="text-xs text-[var(--text-secondary)] mb-6">Live breakdown of current batch</p>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="text-2xl font-bold text-[var(--text-primary)]">{apps.length}</div>
                <div className="text-[10px] uppercase text-[var(--text-secondary)] font-bold tracking-wider">Total</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {data.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-[var(--text-secondary)]">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;