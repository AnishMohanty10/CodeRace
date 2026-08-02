import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

const TIMEOUT_MS = 15000;

// Serve the compiled Vite frontend
app.use(express.static(path.join(process.cwd(), 'dist')));

app.post('/api/run', async (req, res) => {
    const { code, lang, n } = req.body;
    
    if (!code || !lang || n === undefined) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    const runId = crypto.randomBytes(8).toString('hex');
    const tmpDir = path.join(process.cwd(), '.tmp_exec', runId);
    
    try {
        await fs.mkdir(tmpDir, { recursive: true });
        let execCmd = '';
        let resultTime = 'Err';

        if (lang === 'javascript') {
            const filePath = path.join(tmpDir, 'run.js');
            const wrapper = `
${code}
const n = ${n};
const arr = Array.from({length: n}, () => Math.floor(Math.random() * n));
const target = Math.floor(Math.random() * n);
const start = performance.now();
solution(arr, target);
const end = performance.now();
console.log((end - start).toFixed(4));
            `;
            await fs.writeFile(filePath, wrapper);
            execCmd = `node ${filePath}`;
        } else if (lang === 'python') {
            const filePath = path.join(tmpDir, 'run.py');
            const wrapper = `
import time
import random
import sys
${code}
n = ${n}
arr = [random.randint(0, max(1, n)) for _ in range(n)]
target = random.randint(0, max(1, n))
start = time.perf_counter()
solution(arr, target)
end = time.perf_counter()
print(f"{(end - start) * 1000:.4f}")
            `;
            await fs.writeFile(filePath, wrapper);
            execCmd = `python3 ${filePath}`;
        } else if (lang === 'cpp') {
            const filePath = path.join(tmpDir, 'run.cpp');
            const outPath = path.join(tmpDir, 'a.out');
            const wrapper = `
#include <iostream>
#include <vector>
#include <chrono>
#include <cstdlib>
using namespace std;
${code}
int main() {
    int n = ${n};
    vector<int> arr(n);
    for(int i=0; i<n; ++i) arr[i] = rand() % (n + 1);
    int target = rand() % (n + 1);
    auto start = chrono::high_resolution_clock::now();
    solution(arr, target);
    auto end = chrono::high_resolution_clock::now();
    chrono::duration<double, std::milli> elapsed = end - start;
    cout << elapsed.count() << endl;
    return 0;
}
            `;
            await fs.writeFile(filePath, wrapper);
            execCmd = `g++ -O3 ${filePath} -o ${outPath} && ${outPath}`;
        } else if (lang === 'java') {
            const filePath = path.join(tmpDir, 'Runner.java');
            const wrapper = `
import java.util.Random;
public class Runner {
    public static void main(String[] args) {
        int n = ${n};
        int[] arr = new int[n];
        Random rand = new Random();
        for(int i=0; i<n; i++) arr[i] = rand.nextInt(n + 1);
        int target = rand.nextInt(n + 1);
        long start = System.nanoTime();
        Solution.solution(arr, target);
        long end = System.nanoTime();
        System.out.println((end - start) / 1e6);
    }
}
${code}
            `;
            await fs.writeFile(filePath, wrapper);
            execCmd = `cd ${tmpDir} && javac Runner.java && java Runner`;
        } else {
            return res.status(400).json({ error: 'Unsupported language' });
        }

        const runPromise = new Promise((resolve, reject) => {
            exec(execCmd, { timeout: TIMEOUT_MS }, (error, stdout, stderr) => {
                if (error) {
                    if (error.killed) {
                        resolve('TLE');
                    } else {
                        console.error('Execution Error:', stderr || error.message);
                        resolve('Err');
                    }
                } else {
                    resolve(stdout.trim());
                }
            });
        });

        resultTime = await runPromise;
        await fs.rm(tmpDir, { recursive: true, force: true });
        res.json({ time: resultTime });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fallback for React Router (if added in the future) / SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('Execution API server running on port ' + PORT);
});
