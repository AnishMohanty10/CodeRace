import { Play, Code2 } from 'lucide-react';

function Navbar({onRun}){
    return (
        <nav className="navbar">
        <div className="logo">
            <Code2 size={22} color="#58a6ff" />
            <div className="logo-text"><span className="logo-highlight">Code</span>Race</div>
        </div>
        
        <div className="controls">
            <button className="run-btn" onClick={onRun}>
            <Play size={14} /> Run Comparison
            </button>
        </div>
        </nav>
    );
}
export default Navbar;