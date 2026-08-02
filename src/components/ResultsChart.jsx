import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function ResultsChart({ data }) {
  const chartData = data.map(item => ({
    ...item,
    n_label: `10^${Math.log10(item.n)}`,
    timeA: typeof item.timeA === 'number' ? item.timeA : (item.timeA === 'TLE' || item.timeA === 'Err' ? null : parseFloat(item.timeA) || null),
    timeB: typeof item.timeB === 'number' ? item.timeB : (item.timeB === 'TLE' || item.timeB === 'Err' ? null : parseFloat(item.timeB) || null),
  }));

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px 0', fontSize: '13px', fontWeight: '500', color: '#c9d1d9', fontFamily: 'Inter, sans-serif' }}>Performance Profile</div>
      <div style={{ flex: 1, minHeight: 0, padding: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 16,  
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="0" stroke="#21262d" vertical={false} />
            <XAxis dataKey="n_label" stroke="#8b949e" tick={{ fill: '#8b949e', fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: '#21262d' }} tickLine={false} tickMargin={12} />
            <YAxis stroke="#8b949e" tick={{ fill: '#8b949e', fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }} axisLine={{ stroke: '#21262d' }} tickLine={false} tickMargin={8} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363d', borderRadius: '6px', color: '#c9d1d9', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', fontFamily: "'JetBrains Mono', monospace" }} 
              itemStyle={{ color: '#c9d1d9', fontSize: '13px' }}
              labelStyle={{ color: '#8b949e', marginBottom: '8px', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}
            />
            <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px', fontFamily: "'Inter', sans-serif" }} iconType="circle" />
            <Line type="monotone" dataKey="timeA" name="Solution A" stroke="#58a6ff" strokeWidth={2.5} dot={{ r: 4, fill: '#0D1117', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#58a6ff', strokeWidth: 0 }} connectNulls={true} />
            <Line type="monotone" dataKey="timeB" name="Solution B" stroke="#3fb950" strokeWidth={2.5} dot={{ r: 4, fill: '#0D1117', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#3fb950', strokeWidth: 0 }} connectNulls={true} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ResultsChart;
