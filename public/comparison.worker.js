self.onmessage = function(e) {
    const { code, n, type } = e.data;
    
    try {

        const input = Array.from({ length: n }, () => Math.floor(Math.random() * n));
        

        const userFunction = new Function('input', `${code}\nreturn solution(input);`);


        const start = performance.now();
        userFunction(input);
        const end = performance.now();

        self.postMessage({ 
            time: (end - start).toFixed(4), 
            type: type 
        });
    } catch (err) {
        self.postMessage({ error: err.message, type: type });
    }
};