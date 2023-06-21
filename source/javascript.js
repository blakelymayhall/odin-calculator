const digitButtons = document.querySelectorAll('.digitButton');
const opButtons = document.querySelectorAll('.opButton');
const funcButtons = document.querySelectorAll('.funcButton');

let a;
let b;
let operator;

digitButtons.forEach((digitButton) => {
    digitButton.addEventListener('click', () => {
        const digit = document.createElement("p");
        digit.textContent = digitButton.dataset.digit;
        digit.classList.add("digit");
        document.querySelector(".calculatorScreen").appendChild(digit);
    });
});

function add(a,b) {
    return a+b;
}

function subtract(a,b) {
    return a-b;
}

function multiply(a,b) {
    return a*b;
}

function divide(a,b) {
    return a/b;
}

function operate(a,b,operator) {

}