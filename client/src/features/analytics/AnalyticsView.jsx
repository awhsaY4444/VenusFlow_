import React, { useEffect, useState } from 'react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { tr } from '../../utils/i18n';
import { BarChart, Users, CheckCircle2 } from 'lucide-react';

export function AnalyticsView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call to /api/analytics
    // Mocking the data for demonstration as per point 12
    setTimeout(() => {
      setData({
        taskVolume: [
          { date: '2026-04-16', count: 5 },
          { date: '2026-04-17', count: 8 },
          { date: '2026-04-18', count: 12 },
          { date: '2026-04-19', count: 7 },
          { date: '2026-04-20', count: 15 },
          { date: '2026-04-21', count: 9 },
          { date: '2026-04-22', count: 4 },
        ],
        statusDistribution: [
          { status: 'todo', count: 25 },
          { status: 'in_progress', count: 14 },
          { status: 'done', count: 42 },
        ],
        activeUsers: [
          { name: 'Admin User', count: 28 },
          { name: 'John Doe', count: 15 },
          { name: 'Jane Smith', count: 12 },
        ]
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) return <div className="p-8 text-center animate-pulse text-ink-500">Loading Analytics...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionHeader 
        kicker={tr("Insights", "जानकारी")}
        title={tr("Analytics Dashboard", "एनालिटिक्स डैशबोर्ड")}
        description={tr("Overview of organization performance and task activity.", "संगठन के प्रदर्शन और टास्क गतिविधि का अवलोकन।")}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 border-l-4 border-brand-500">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="h-5 w-5 text-brand-500" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">{tr("Total Tasks", "कुल टास्क")}</h3>
          </div>
          <p className="text-4xl font-black text-ink-950">81</p>
        </div>
        
        <div className="glass-panel p-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-2">
            <BarChart className="h-5 w-5 text-blue-500" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">{tr("Completion Rate", "पूर्णता दर")}</h3>
          </div>
          <p className="text-4xl font-black text-ink-950">52%</p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-purple-500" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">{tr("Active Users", "सक्रिय उपयोगकर्ता")}</h3>
          </div>
          <p className="text-4xl font-black text-ink-950">{data.activeUsers.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-ink-950 mb-6">{tr("Task Volume (Last 7 Days)", "टास्क वॉल्यूम (पिछले 7 दिन)")}</h3>
          <div className="flex items-end gap-2 h-48">
            {data.taskVolume.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-brand-500/20 border-t-2 border-brand-500 rounded-t-sm transition-all hover:bg-brand-500/40" 
                  style={{ height: `${(day.count / 15) * 100}%` }}
                />
                <span className="text-[10px] font-bold text-ink-400 rotate-45 mt-2">{day.date.split('-')[2]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-bold text-ink-950 mb-6">{tr("Status Distribution", "स्थिति वितरण")}</h3>
          <div className="space-y-4">
            {data.statusDistribution.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-sm font-bold uppercase tracking-widest text-ink-600">
                  <span>{item.status}</span>
                  <span>{item.count}</span>
                </div>
                <div className="h-2 w-full bg-surface-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.status === 'done' ? 'bg-green-500' : item.status === 'in_progress' ? 'bg-blue-500' : 'bg-ink-300'}`}
                    style={{ width: `${(item.count / 81) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
