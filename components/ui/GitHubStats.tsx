'use client';
import { useEffect, useState } from 'react';
import { FiCalendar } from 'react-icons/fi';

interface GitHubData {
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
}

interface EventData {
  totalCommits: number;
  totalPRs: number;
  totalStars: number;
  languages: string[];
}

export default function GitHubStats({ username }: { username: string }) {
  const [data, setData] = useState<GitHubData | null>(null);
  const [events, setEvents] = useState<EventData>({ totalCommits: 0, totalPRs: 0, totalStars: 0, languages: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Fetch user profile
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userRes.json();
        setData(userData);

        // Fetch recent events for commit count
        const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public?per_page=100`);
        const eventsData = await eventsRes.json();

        let commits = 0;
        let prs = 0;
        if (Array.isArray(eventsData)) {
          eventsData.forEach((e: { type: string; payload?: { commits?: unknown[]; size?: number } }) => {
            if (e.type === 'PushEvent') commits += e.payload?.size || (e.payload?.commits?.length || 0);
            if (e.type === 'PullRequestEvent') prs++;
          });
        }

        // If events returned 0 commits, try search API
        if (commits === 0) {
          try {
            const searchRes = await fetch(`https://api.github.com/search/commits?q=author:${username}&per_page=1`);
            const searchData = await searchRes.json();
            if (searchData.total_count) commits = searchData.total_count;
          } catch { /* ignore */ }
        }

        // Fetch repos for stars & languages
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        const reposData = await reposRes.json();

        let stars = 0;
        const langSet = new Set<string>();
        if (Array.isArray(reposData)) {
          reposData.forEach((r: { stargazers_count: number; language?: string }) => {
            stars += r.stargazers_count || 0;
            if (r.language) langSet.add(r.language);
          });
        }

        setEvents({ totalCommits: commits, totalPRs: prs, totalStars: stars, languages: Array.from(langSet).slice(0, 5) });
      } catch (err) {
        console.error('GitHub fetch error:', err);
      }
      setLoading(false);
    };
    fetchAll();
  }, [username]);

  return (
    <div>
      <div className="stats-card">
        <div className="stats-card-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
          <span>GitHub</span>
          <span style={{ marginLeft: 'auto', fontSize: '.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>@{username}</span>
        </div>
        {loading ? (
          <div className="stats-loading"><div className="admin-spinner"></div></div>
        ) : data?.public_repos !== undefined ? (
          <>
            <div className="stats-grid">
              <div className="stat-item"><span className="stat-value">{data.public_repos}</span><span className="stat-label">Repos</span></div>
              <div className="stat-item"><span className="stat-value">{events.totalCommits}</span><span className="stat-label">Commits</span></div>
              <div className="stat-item"><span className="stat-value">{events.totalStars}</span><span className="stat-label">Stars</span></div>
              <div className="stat-item"><span className="stat-value">{data.followers}</span><span className="stat-label">Followers</span></div>
            </div>
            {events.languages.length > 0 && (
              <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {events.languages.map(l => (
                  <span key={l} className="card-tech">{l}</span>
                ))}
              </div>
            )}
          </>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>Unable to load stats</p>
        )}
        <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="stats-link">
          View Full Profile →
        </a>
      </div>
      {/* Contribution Graph - green boxes */}
      <div className="contrib-graph">
        <span className="contrib-graph-label"><FiCalendar style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Contribution Activity</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://ghchart.rshah.org/2da44e/${username}`}
          alt={`${username}'s GitHub contribution graph`}
          loading="lazy"
        />
      </div>
    </div>
  );
}
