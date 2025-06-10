import { animate, press, hover } from "https://cdn.jsdelivr.net/npm/motion@12.16.0/+esm"

const numberInput = document.getElementById('numberInput');
const calcButton = document.getElementById('calculateButton');
const factorialResult = document.getElementById('factorialResult')
const fibonacciResult = document.getElementById('fibonacciResult')
const resetButton = document.getElementById('reset');
const factDone = document.querySelector('#factDone')
const fibDone = document.querySelector('#fibDone')
const choiceBox = document.getElementById("workerChoice");




const gestureState = new WeakMap()

const transition = { type: "spring", stiffness: 500, damping: 25 }

const initialState = {
    isHovered: false,
    isPressed: false,
}

function setGesture(element, update) {
    const state = gestureState.get(element) || { ...initialState }
    const newState = { ...state, ...update }
    gestureState.set(element, newState)

    let scale = 1
    if (newState.isPressed) {
        scale = 0.8
    } else if (newState.isHovered) {
        scale = 1.2
    }

    animate(element, { scale }, transition)
}

hover(".box", (element) => {
    setGesture(element, { isHovered: true })
    return () => setGesture(element, { isHovered: false })
})

press(".box", (element) => {
    setGesture(element, { isPressed: true })
    return () => setGesture(element, { isPressed: false })
})


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

const factWorker = new Worker(new URL('./worker.js', import.meta.url))
const fibWorker = new Worker(new URL('./worker.js', import.meta.url));

function withWorker(value) {
    factWorker.postMessage({
        type: 'calculateFactorial',
        payload: value
    });

    fibWorker.postMessage({
        type: 'getFibonacci',
        payload: value
    })

    factWorker.addEventListener('message', (ev) => {
        // console.log(ev.data);
        factorialResult.textContent = ev.data.payload;
        factDone.style.display = 'block'
    })

    fibWorker.addEventListener('message', (ev) => {
        fibonacciResult.textContent = ev.data.payload;
        fibDone.style.display = 'block';
    })
}

function withoutWorker(value) {
    const fibonacciValue = getFibonacci(value);
    const factorialValue = calculateFactorial(value);

    if (fibonacciResult) {
        fibonacciResult.textContent = fibonacciValue;
        fibDone.style.display = 'block';
    }
    if (factorialValue) {
        factorialResult.textContent = factorialValue;
        factDone.style.display = 'block';
    }
}

calcButton.addEventListener('click', () => {
    // if there's no value we consider it as 1
    const value = numberInput.value ? parseInt(numberInput.value, 10) : 1;

    if (isNaN(value) || value < 0) {
        alert('Please enter a valid non-negative integer.');
        return;
    }

    const choice = choiceBox.checked;

    // if choice is true, we use workers
    if (choice) {
        withWorker(value)
    } else {
        withoutWorker(value)
    }


});


resetButton.addEventListener('click', (ev) => {
    fibDone.style.display = 'none';
    factDone.style.display = 'none'

    fibonacciResult.textContent = ''
    factorialResult.textContent = ''

    numberInput.value = ''


})