'use client';
import { useEffect, useState, useMemo } from 'react';
import { FiCalendar, FiAward } from 'react-icons/fi';

interface LCData {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  totalQuestions: number;
  submissionCalendar: string;
  totalActiveDays: number;
}

function ContributionHeatmap({ calendar }: { calendar: Record<string, number> }) {
  const { weeks, months } = useMemo(() => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 364); // ~52 weeks
    startDate.setDate(startDate.getDate() - startDate.getDay()); // align to Sunday

    const weeksArr: { date: Date; count: number }[][] = [];
    let currentWeek: { date: Date; count: number }[] = [];
    const monthsArr: { label: string; col: number }[] = [];
    let lastMonth = -1;

    const d = new Date(startDate);
    let col = 0;
    while (d <= now) {
      const ts = Math.floor(d.getTime() / 1000).toString();
      currentWeek.push({ date: new Date(d), count: calendar[ts] || 0 });

      if (d.getMonth() !== lastMonth) {
        monthsArr.push({ label: d.toLocaleString('en', { month: 'short' }), col });
        lastMonth = d.getMonth();
      }

      if (currentWeek.length === 7) {
        weeksArr.push(currentWeek);
        currentWeek = [];
        col++;
      }
      d.setDate(d.getDate() + 1);
    }
    if (currentWeek.length > 0) weeksArr.push(currentWeek);

    return { weeks: weeksArr, months: monthsArr };
  }, [calendar]);

  const getColor = (count: number) => {
    if (count === 0) return 'var(--heatmap-empty, rgba(99,102,241,.06))';
    if (count <= 1) return '#4ade80';
    if (count <= 3) return '#22c55e';
    if (count <= 5) return '#16a34a';
    return '#15803d';
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={weeks.length * 15 + 30} height={120} style={{ display: 'block' }}>
        {/* Month labels */}
        {months.map((m, i) => (
          <text key={i} x={m.col * 15 + 30} y={12} fontSize={10} fill="var(--text-muted)">{m.label}</text>
        ))}
        {/* Day labels */}
        {['Mon', 'Wed', 'Fri'].map((day, i) => (
          <text key={day} x={0} y={20 + (i * 2 + 1) * 15 + 9} fontSize={9} fill="var(--text-muted)">{day}</text>
        ))}
        {/* Cells */}
        {weeks.map((week, wi) =>
          week.map((day, di) => (
            <rect
              key={`${wi}-${di}`}
              x={wi * 15 + 30}
              y={di * 15 + 20}
              width={12}
              height={12}
              rx={2}
              fill={getColor(day.count)}
              style={{ transition: 'fill .2s' }}
            >
              <title>{`${day.date.toLocaleDateString()}: ${day.count} submission${day.count !== 1 ? 's' : ''}`}</title>
            </rect>
          ))
        )}
      </svg>
    </div>
  );
}

export default function LeetCodeStats({ username }: { username: string }) {
  const [data, setData] = useState<LCData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/leetcode?username=${username}`);
        const d = await res.json();
        if (d.totalSolved !== undefined) setData(d);
      } catch { /* fallback */ }
      setLoading(false);
    };
    fetchStats();
  }, [username]);

  const solvedPercent = data && data.totalQuestions ? Math.round((data.totalSolved / data.totalQuestions) * 100) : 0;
  const calendar: Record<string, number> = useMemo(() => {
    if (!data?.submissionCalendar) return {};
    try { return JSON.parse(data.submissionCalendar); } catch { return {}; }
  }, [data?.submissionCalendar]);

  return (
    <div>
      <div className="stats-card">
        <div className="stats-card-header">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l.842.691a1.38 1.38 0 0 0 1.94-.153 1.38 1.38 0 0 0-.153-1.94l-.842-.689a5.318 5.318 0 0 0-.786-.5z"/></svg>
          <span>LeetCode</span>
          <span style={{ marginLeft: 'auto', fontSize: '.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>@{username}</span>
        </div>
        {loading ? (
          <div className="stats-loading"><div className="admin-spinner"></div></div>
        ) : data ? (
          <>
            <div className="stats-grid">
              <div className="stat-item"><span className="stat-value">{data.totalSolved}</span><span className="stat-label">Solved</span></div>
              <div className="stat-item"><span className="stat-value" style={{ color: '#4ade80' }}>{data.easySolved}</span><span className="stat-label">Easy</span></div>
              <div className="stat-item"><span className="stat-value" style={{ color: '#facc15' }}>{data.mediumSolved}</span><span className="stat-label">Medium</span></div>
              <div className="stat-item"><span className="stat-value" style={{ color: '#f87171' }}>{data.hardSolved}</span><span className="stat-label">Hard</span></div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', color: 'var(--text-muted)', marginBottom: '.3rem' }}>
                <span>Progress</span><span>{solvedPercent}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(99,102,241,.1)', borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${data.easySolved}%`, background: '#4ade80' }}></div>
                <div style={{ width: `${data.mediumSolved}%`, background: '#facc15' }}></div>
                <div style={{ width: `${data.hardSolved}%`, background: '#f87171' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '.85rem', color: 'var(--text-muted)', marginBottom: '.75rem' }}>
              {data.ranking > 0 && <span><FiAward style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Rank: <strong style={{ color: 'var(--text-primary)' }}>#{data.ranking.toLocaleString()}</strong></span>}
              {data.totalActiveDays > 0 && <span><FiCalendar style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Active: <strong style={{ color: 'var(--text-primary)' }}>{data.totalActiveDays} days</strong></span>}
            </div>
          </>
        ) : (
          <div className="stats-grid">
            <div className="stat-item"><span className="stat-value">—</span><span className="stat-label">Solved</span></div>
            <div className="stat-item"><span className="stat-value" style={{ color: '#4ade80' }}>—</span><span className="stat-label">Easy</span></div>
            <div className="stat-item"><span className="stat-value" style={{ color: '#facc15' }}>—</span><span className="stat-label">Medium</span></div>
            <div className="stat-item"><span className="stat-value" style={{ color: '#f87171' }}>—</span><span className="stat-label">Hard</span></div>
          </div>
        )}
        <a href={`https://leetcode.com/u/${username}`} target="_blank" rel="noopener noreferrer" className="stats-link">
          View Full Profile →
        </a>
      </div>
      {/* LeetCode Contribution Heatmap */}
      {Object.keys(calendar).length > 0 && (
        <div className="contrib-graph">
          <span className="contrib-graph-label"><FiCalendar style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Submission Activity</span>
          <ContributionHeatmap calendar={calendar} />
        </div>
      )}
    </div>
  );
}
