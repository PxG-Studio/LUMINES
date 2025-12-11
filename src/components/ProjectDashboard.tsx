import { useState, useEffect } from 'react';
import { Activity, FolderOpen, Play, Settings, Package, TrendingUp } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useRuntimeSession, useBuildJob } from '@/hooks/useRuntime';

export interface ProjectDashboardProps {
  projectId: string;
}

export function ProjectDashboard({ projectId }: ProjectDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'builds' | 'settings'>('overview');

  return (
    <div className="flex flex-col h-full bg-slate-950">
      <DashboardHeader projectId={projectId} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-auto">
        {activeTab === 'overview' && <OverviewPanel projectId={projectId} />}
        {activeTab === 'files' && <FilesPanel projectId={projectId} />}
        {activeTab === 'builds' && <BuildsPanel projectId={projectId} />}
        {activeTab === 'settings' && <SettingsPanel projectId={projectId} />}
      </div>
    </div>
  );
}

interface DashboardHeaderProps {
  projectId: string;
  activeTab: string;
  onTabChange: (tab: 'overview' | 'files' | 'builds' | 'settings') => void;
}

function DashboardHeader({ projectId, activeTab, onTabChange }: DashboardHeaderProps) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'files', label: 'Files', icon: FolderOpen },
    { id: 'builds', label: 'Builds', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="border-b border-slate-800 bg-slate-900">
      <div className="px-6 py-4">
        <h1 className="text-xl font-semibold text-slate-100">Project Dashboard</h1>
      </div>
      <div className="flex gap-1 px-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === id
                ? 'bg-slate-950 text-blue-400 border-t border-x border-slate-800'
                : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
            }`}
          >
            <Icon size={16} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function OverviewPanel({ projectId }: { projectId: string }) {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Files" value="1,234" icon={FolderOpen} trend="+12" />
        <StatCard title="Assets" value="456" icon={Package} trend="+8" />
        <StatCard title="Active Builds" value="2" icon={Activity} trend="0" />
        <StatCard title="Performance" value="98%" icon={TrendingUp} trend="+5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity projectId={projectId} />
        <QuickActions projectId={projectId} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BuildHistory projectId={projectId} />
        <SystemStatus projectId={projectId} />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  trend?: string;
}

function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  const isPositive = trend?.startsWith('+');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-400">{title}</p>
          <p className="text-2xl font-semibold text-slate-100 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${isPositive ? 'text-green-400' : 'text-slate-400'}`}>
              {trend} from last week
            </p>
          )}
        </div>
        <div className="bg-blue-500/10 p-2 rounded-lg">
          <Icon size={20} className="text-blue-400" />
        </div>
      </div>
    </div>
  );
}

function RecentActivity({ projectId }: { projectId: string }) {
  const activities = [
    { type: 'file', message: 'Updated PlayerController.cs', time: '2 minutes ago' },
    { type: 'build', message: 'Build completed for Windows', time: '15 minutes ago' },
    { type: 'asset', message: 'Imported 12 textures', time: '1 hour ago' },
    { type: 'runtime', message: 'Started Unity runtime', time: '2 hours ago' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2" />
            <div className="flex-1">
              <p className="text-slate-200">{activity.message}</p>
              <p className="text-slate-500 text-xs mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickActions({ projectId }: { projectId: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <ActionButton icon={Play} label="Start Runtime" />
        <ActionButton icon={Package} label="Build Project" />
        <ActionButton icon={Settings} label="Configure" />
        <ActionButton icon={TrendingUp} label="View Metrics" />
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
}

function ActionButton({ icon: Icon, label }: ActionButtonProps) {
  return (
    <button className="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
      <Icon size={24} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function BuildHistory({ projectId }: { projectId: string }) {
  const { jobs } = useBuildJob(projectId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Build History</h3>
      <div className="space-y-2">
        {jobs.slice(0, 5).map((job) => (
          <div key={job.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-200">{job.target_platform}</p>
              <p className="text-xs text-slate-500">{job.build_type}</p>
            </div>
            <div className={`text-sm font-medium ${
              job.status === 'completed' ? 'text-green-400' :
              job.status === 'failed' ? 'text-red-400' :
              'text-blue-400'
            }`}>
              {job.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemStatus({ projectId }: { projectId: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">System Status</h3>
      <div className="space-y-3">
        <StatusItem label="Database" status="operational" />
        <StatusItem label="Cache" status="operational" />
        <StatusItem label="Message Bus" status="operational" />
        <StatusItem label="Container Runtime" status="operational" />
      </div>
    </div>
  );
}

function StatusItem({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full" />
        <span className="text-sm text-green-400 capitalize">{status}</span>
      </div>
    </div>
  );
}

function FilesPanel({ projectId }: { projectId: string }) {
  return (
    <div className="p-6">
      <p className="text-slate-400">File browser coming soon...</p>
    </div>
  );
}

function BuildsPanel({ projectId }: { projectId: string }) {
  return (
    <div className="p-6">
      <p className="text-slate-400">Build configuration coming soon...</p>
    </div>
  );
}

function SettingsPanel({ projectId }: { projectId: string }) {
  return (
    <div className="p-6">
      <p className="text-slate-400">Settings panel coming soon...</p>
    </div>
  );
}
