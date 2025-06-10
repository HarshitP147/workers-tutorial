addEventListener('message', (event) => {
    const { type, payload } = event.data;

    if (type === 'calculateFactorial') {
        const result = calculateFactorial(payload);
        postMessage({ type: 'factorialResult', payload: result });
    } else if (type === 'getFibonacci') {
        const result = getFibonacci(payload);
        postMessage({ type: 'fibonacciResult', payload: result });
    } else {
        postMessage({ type: 'error', payload: 'Unknown request type' });
    }
});


function calculateFactorial(n) {
    if (n < 0) {
        return 'undefined';
    }
    if (n === 0 || n === 1) {
        return 1;
    }
    let result = BigInt(1);
    for (let i = 2; i <= n; i++) {
        result *= BigInt(i);
    }
    return result;
}

function getFibonacci(n) {
    // We are dealing with very big numbers, so we use BigInt
    if (n < 0) {
        return 'undefined';
    }
    if (n === 0) {
        return BigInt(0);
    }
    if (n === 1) {
        return BigInt(1);
    }
    let a = BigInt(0);
    let b = BigInt(1);
    let c;
    for (let i = 2; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }
    return c;
}