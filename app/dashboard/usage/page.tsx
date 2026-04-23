'use client';

import { useEffect, useState } from 'react';

interface DayStat {
  date: string;
  requests: number;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  totalCost: string;
  avgDuration: number;
  errorCount: number;
}

interface ModelStat {
  model: string;
  requests: number;
  totalTokens: number;
  totalCost: string;
}

interface EndpointStat {
  endpoint: string;
  requests: number;
  totalTokens: number;
  totalCost: string;
  avgDuration: number;
}

interface Totals {
  requests: number;
  totalTokens: number;
  totalCost: string;
  errorCount: number;
}

interface UsageData {
  days: number;
  today: { requests: number; totalTokens: number; totalCost: string };
  totals: Totals;
  daily: DayStat[];
  byModel: ModelStat[];
  byEndpoint: EndpointStat[];
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatCost(s: string): string {
  const n = parseFloat(s);
  if (isNaN(n)) return '$0.00';
  return `$${n.toFixed(4)}`;
}

function formatDuration(ms: number | null): string {
  if (!ms) return '-';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function UsagePage() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/dashboard/usage?days=${days}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-500">
        Failed to load usage data.
      </div>
    );
  }

  const maxRequests = Math.max(...data.daily.map((d) => d.requests), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Usage</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track AI model requests, token usage, and costs
          </p>
        </div>
        <div className="flex gap-2">
          {[7, 14, 30].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                days === d
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Today's Requests"
          value={String(data.today.requests)}
          sub={`${formatTokens(data.today.totalTokens)} tokens`}
          color="blue"
        />
        <SummaryCard
          title="Today's Cost"
          value={formatCost(data.today.totalCost)}
          sub="estimated"
          color="green"
        />
        <SummaryCard
          title={`${days}d Total Requests`}
          value={String(data.totals.requests)}
          sub={`${formatTokens(data.totals.totalTokens)} tokens`}
          color="purple"
        />
        <SummaryCard
          title={`${days}d Total Cost`}
          value={formatCost(data.totals.totalCost)}
          sub={
            data.totals.errorCount > 0
              ? `${data.totals.errorCount} errors`
              : 'no errors'
          }
          color={data.totals.errorCount > 0 ? 'red' : 'emerald'}
        />
      </div>

      {/* Daily Chart */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Daily Requests
        </h2>
        {data.daily.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">
            No usage data yet. Start chatting to see stats here.
          </p>
        ) : (
          <div className="space-y-2">
            {data.daily.map((day) => (
              <div key={day.date} className="flex items-center gap-3 text-sm">
                <span className="w-20 text-gray-500 font-mono text-xs flex-shrink-0">
                  {day.date.slice(5)}
                </span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-end pr-2 transition-all"
                    style={{
                      width: `${Math.max(
                        (day.requests / maxRequests) * 100,
                        2,
                      )}%`,
                    }}
                  >
                    {day.requests > 0 && (
                      <span className="text-[10px] font-bold text-white">
                        {day.requests}
                      </span>
                    )}
                  </div>
                </div>
                <span className="w-16 text-right text-gray-500 text-xs flex-shrink-0">
                  {formatTokens(day.totalTokens)}
                </span>
                <span className="w-16 text-right text-gray-500 text-xs flex-shrink-0">
                  {formatCost(day.totalCost)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Model & Endpoint Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Model */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">By Model</h2>
          {data.byModel.length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b">
                  <th className="pb-2">Model</th>
                  <th className="pb-2 text-right">Requests</th>
                  <th className="pb-2 text-right">Tokens</th>
                  <th className="pb-2 text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {data.byModel.map((m) => (
                  <tr key={m.model} className="border-b border-gray-100">
                    <td className="py-2 font-mono text-xs text-gray-800 max-w-[180px] truncate">
                      {m.model}
                    </td>
                    <td className="py-2 text-right text-gray-700">
                      {m.requests}
                    </td>
                    <td className="py-2 text-right text-gray-500">
                      {formatTokens(m.totalTokens)}
                    </td>
                    <td className="py-2 text-right text-gray-500">
                      {formatCost(m.totalCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* By Endpoint */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            By Endpoint
          </h2>
          {data.byEndpoint.length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 text-xs uppercase tracking-wider border-b">
                  <th className="pb-2">Endpoint</th>
                  <th className="pb-2 text-right">Requests</th>
                  <th className="pb-2 text-right">Avg</th>
                  <th className="pb-2 text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {data.byEndpoint.map((e) => (
                  <tr key={e.endpoint} className="border-b border-gray-100">
                    <td className="py-2 font-mono text-xs text-gray-800">
                      {e.endpoint}
                    </td>
                    <td className="py-2 text-right text-gray-700">
                      {e.requests}
                    </td>
                    <td className="py-2 text-right text-gray-500">
                      {formatDuration(e.avgDuration)}
                    </td>
                    <td className="py-2 text-right text-gray-500">
                      {formatCost(e.totalCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  sub,
  color,
}: {
  title: string;
  value: string;
  sub: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    emerald: 'from-emerald-500 to-emerald-600',
  };
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 sm:p-5">
      <p className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">
        {title}
      </p>
      <p
        className={`text-2xl sm:text-3xl font-extrabold bg-gradient-to-r ${
          colorMap[color] ?? colorMap.blue
        } bg-clip-text text-transparent`}
      >
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-1">{sub}</p>
    </div>
  );
}
