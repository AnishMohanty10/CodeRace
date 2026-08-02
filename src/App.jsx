import { useState } from 'react'
import Editor from '@monaco-editor/react' 
import './App.css'
import Navbar from './components/Navbar';
import ResultsTable from './components/ResultsTable'
import ResultsChart from './components/ResultsChart'
import { Code, LineChart, LayoutDashboard, TableProperties, BrainCircuit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { fetchAIInsights } from './utils/ai';

const defaultSnippets = {
  javascript: {
    a: `function solution(arr, target) {\n  for(let i = 0; i < arr.length; i++) {\n    if(arr[i] === target) return i;\n  }\n  return -1;\n}`,
    b: `function solution(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  while(left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if(arr[mid] === target) return mid;\n    if(arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`
  },
  python: {
    a: `def solution(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i\n    return -1`,
    b: `def solution(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1`
  },
  java: {
    a: `class Solution {\n    public static int solution(int[] arr, int target) {\n        for(int i = 0; i < arr.length; i++) {\n            if(arr[i] == target) return i;\n        }\n        return -1;\n    }\n}`,
    b: `class Solution {\n    public static int solution(int[] arr, int target) {\n        int left = 0;\n        int right = arr.length - 1;\n        while(left <= right) {\n            int mid = left + (right - left) / 2;\n            if(arr[mid] == target) return mid;\n            if(arr[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n}`
  },
  cpp: {
    a: `int solution(vector<int>& arr, int target) {\n    for(int i = 0; i < arr.size(); i++) {\n        if(arr[i] == target) return i;\n    }\n    return -1;\n}`,
    b: `int solution(vector<int>& arr, int target) {\n    int left = 0;\n    int right = arr.size() - 1;\n    while(left <= right) {\n        int mid = left + (right - left) / 2;\n        if(arr[mid] == target) return mid;\n        if(arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}`
  }
};

function App() {
  const [lang, setLang] = useState('javascript');
  const [codeA, setCodeA] = useState(defaultSnippets['javascript'].a);
  const [codeB, setCodeB] = useState(defaultSnippets['javascript'].b);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');

  const [results, setResults] = useState([
  { n: 10, timeA: 0.1, timeB: 0.2 },
  { n: 100, timeA: 0.5, timeB: 1.2 },
  { n: 1000, timeA: 'TLE', timeB: 15.0 }
]);

const handleLangChange = (e) => {
  const newLang = e.target.value;
  setLang(newLang);
  setCodeA(defaultSnippets[newLang].a);
  setCodeB(defaultSnippets[newLang].b);
};

const handleCompare = async () => {
  setResults([]); 
  setAiExplanation('');
  const testSizes = [10, 100, 1000, 10000, 100000, 1000000, 10000000]; 

  const finalResults = [];
  for (let n of testSizes) {
    const timeA = await runTest(codeA, n);
    const timeB = await runTest(codeB, n);
    finalResults.push({ n, timeA, timeB });
    setResults((prev) => [...prev, { n, timeA, timeB }]);
  }

  setIsAnalyzing(true);
  try {
    const explanation = await fetchAIInsights(codeA, codeB, finalResults);
    setAiExplanation(explanation);
  } catch (err) {
    console.error("AI Insights Error:", err);
    setAiExplanation("Failed to load AI Insights. Check your Hugging Face API Key or try again later. Error: " + err.message);
  } finally {
    setIsAnalyzing(false);
  }
};

const runTest = async (code, n) => {
  try {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code, lang, n })
    });
    const data = await res.json();
    return data.time || 'Err';
  } catch (err) {
    console.error(err);
    return 'Err';
  }
};


return (
  <div id="main-app">
    <Navbar onRun={handleCompare} />

    <div className="main-content">
      <div className="left-panel panel">
        <div className="panel-header">
          <div className="panel-title">
            <Code size={16} /> Editors
          </div>
          <select name="select" id="language-list" value={lang} onChange={handleLangChange}>
            <option value="python">Python</option> 
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        <div className="editor-section">
          <div className="editor-wrapper">
            <div className="editor-header">Solution A</div>
            <div className="editor-container">
              <Editor
                height="100%"
                language={lang}
                theme="vs-dark"
                value={codeA}
                onChange={(value) => setCodeA(value)}
                options={{ minimap: { enabled: false }, fontSize: 13, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", scrollBeyondLastLine: false }}
              />
            </div>
          </div>
          <div className="editor-wrapper border-top">
            <div className="editor-header">Solution B</div>
            <div className="editor-container">
              <Editor
                height="100%"
                language={lang}
                theme="vs-dark"
                value={codeB}
                onChange={(value) => setCodeB(value)}
                options={{ minimap: { enabled: false }, fontSize: 13, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", scrollBeyondLastLine: false }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="right-panel panel">
        <div className="panel-header">
          <div className="panel-title">
            <LayoutDashboard size={16} /> Analysis Results
          </div>
        </div>
        <div className="results-container">
          <div className="visualizer-zone">
            {results.length > 0 ? (
              <ResultsChart data={results} />
            ) : (
              <div className="empty-state">
                <LineChart size={32} className="empty-state-icon" />
                <p>Run comparison to generate performance graph</p>
              </div>
            )}
          </div>

          {(isAnalyzing || aiExplanation) && (
            <div className="ai-insights-zone">
              <div className="ai-header">
                <BrainCircuit size={14} className="ai-icon" /> AI Performance Insights
              </div>
              <div className="ai-content">
                {isAnalyzing ? (
                  <div className="skeleton-loader">
                    <div className="skeleton-line" style={{ width: '100%' }}></div>
                    <div className="skeleton-line" style={{ width: '75%' }}></div>
                    <div className="skeleton-line" style={{ width: '50%' }}></div>
                  </div>
                ) : (
                  <div className="markdown-body">
                    <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="table-zone">
            {results.length > 0 ? (
              <ResultsTable results={results} />
            ) : (
              <div className="empty-state">
                <TableProperties size={32} className="empty-state-icon" />
                <p>Run comparison to generate performance table</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)
}

export default App