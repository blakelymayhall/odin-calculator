const digitButtons  = document.querySelectorAll('.digitButton');
const opButtons     = document.querySelectorAll('.opButton');
const funcButtons   = document.querySelectorAll('.funcButton');
const MAX_DIGITS    = 8;
const CalculatorModes = {
	INIT: Symbol("init"),
	NUM1_ENTRY: Symbol("num1_entry"),
    AWAIT_NUM2: Symbol("await_num2"),
	NUM2_ENTRY: Symbol("num2_entry"),
	DISP_RESULT: Symbol("disp_result")
}

/*

Write the process by which if the user enters a digit after enter is sent, 
overwrite the / re-init

Need to error check this code, I think there is another bug somewhere
    - Fix the fact you cant type mulitple digits after first input

*/

let num1 = null;
let num2 = null;
let operator = null;
let dispNumber = "";
let calculatorMode = CalculatorModes.INIT;

digitButtons.forEach((digitButton) => {
    digitButton.addEventListener('click', () => {
        if(calculatorMode === CalculatorModes.INIT || calculatorMode === CalculatorModes.DISP_RESULT) {
            num1 = null;
            num2 = null;
            operator = null;
            dispNumber = "";
            deleteDigitsFromScreen();
            calculatorMode = CalculatorModes.NUM1_ENTRY;
        }

        if (calculatorMode === CalculatorModes.AWAIT_NUM2 || calculatorMode === CalculatorModes.DISP_RESULT) {
            dispNumber = "";
            deleteDigitsFromScreen();
            calculatorMode = CalculatorModes.NUM2_ENTRY;
        }

        if (dispNumber.length < MAX_DIGITS) {
            addDigitsToScreen(digitButton.dataset.digit);
            dispNumber += digitButton.dataset.digit;
        }
    });
});

opButtons.forEach((opButton) => {
    opButton.addEventListener('click', () => {
        if (calculatorMode != CalculatorModes.AWAIT_NUM2) {
            if (calculatorMode === CalculatorModes.NUM1_ENTRY) {
                num1 = +dispNumber;
                deleteDigitsFromScreen();
                calculatorMode = CalculatorModes.AWAIT_NUM2;
            }
            else if (calculatorMode === CalculatorModes.NUM2_ENTRY) {
                num2 = +dispNumber;
                num1 = operate(num1,num2,operator);
                dispNumber = num1.toString();
                deleteDigitsFromScreen();
                addDigitsToScreen(dispNumber);
                calculatorMode = CalculatorModes.AWAIT_NUM2;
            }
        }
        operator = opButton.dataset.operator;
    });
});

funcButtons.forEach((funcButton) => {
    funcButton.addEventListener('click', () => {
        if (calculatorMode !== CalculatorModes.AWAIT_NUM2) {
            if (funcButton.dataset.func == "enter") {
                num2 = +dispNumber;
                num1 = operate(num1,num2,operator);
                dispNumber = num1.toString();
                deleteDigitsFromScreen();
                addDigitsToScreen(dispNumber);
                calculatorMode = CalculatorModes.DISP_RESULT;
            }
        }  

        if (funcButton.dataset.func == "clear") {
            deleteDigitsFromScreen();
            calculatorMode = CalculatorModes.INIT;
        }
    });
});

// Support function - Adds digits to the screen from a string
function addDigitsToScreen(dispNumber) {
    for (let ii = 0; ii < dispNumber.length; ii++) {
        const digit = document.createElement("p");
        digit.textContent = dispNumber[ii];
        digit.classList.add("digit");
        document.querySelector(".calculatorScreen").appendChild(digit);
    }
}

// Support function - Removes HTML DOM elements for the digits 
// (clears the screen)
function deleteDigitsFromScreen() {
    document.querySelectorAll(".digit").forEach((e) => {
        e.parentElement.removeChild(e);
    });
}

// Calculator functions
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
    let result;
    switch (operator) {
        case "+":
            result = add(a, b);
            break;
        case "-":
            result = subtract(a, b);
            break;
        case "/":
            result = divide(a, b);
            break;
        case "*":
            result = multiply(a, b);
            break;                    
    }
    return result;
}