// src/components/ResultsTable.jsx

function ResultsTable({ results }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Input Size (n)</th>
            <th>Code A (ms)</th>
            <th>Code B (ms)</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row, index) => {
            const timeAClass = row.timeA === 'TLE' || row.timeA === 'Err' ? 'tle-text' : (row.timeA > 1000 ? 'time-warning' : 'time-good');
            const timeBClass = row.timeB === 'TLE' || row.timeB === 'Err' ? 'tle-text' : (row.timeB > 1000 ? 'time-warning' : 'time-good');
            
            return (
              <tr key={index}>
                <td>{row.n.toLocaleString()}</td>
                <td className={timeAClass}>
                  {typeof row.timeA === 'number' ? row.timeA.toFixed(2) : row.timeA}
                </td>
                <td className={timeBClass}>
                  {typeof row.timeB === 'number' ? row.timeB.toFixed(2) : row.timeB}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;