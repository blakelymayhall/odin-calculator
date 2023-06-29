const buttons       = document.querySelectorAll('button');
const digitButtons  = document.querySelectorAll('.digitButton');
const opButtons     = document.querySelectorAll('.opButton');
const funcButtons   = document.querySelectorAll('.funcButton');
const MAX_DIGITS    = 8;
const CalculatorModes = {
	INIT: Symbol("init"),
	NUM1_ENTRY: Symbol("num1_entry"),
    NUM2_STDBY: Symbol("num2_stdby"),
	NUM2_ENTRY: Symbol("num2_entry"),
	ENTR_STDBY: Symbol("entr_stdby")
}

let num1 = null;
let num2 = null;
let operator = null;
let dispNumber = "";
let calculatorMode = CalculatorModes.INIT;

digitButtons.forEach((digitButton) => {
    digitButton.addEventListener('click', () => {
        digitSequence(digitButton);
    });
});

opButtons.forEach((opButton) => {
    opButton.addEventListener('click', () => {
        operationSequence(opButton);
    });
});

funcButtons.forEach((funcButton) => {
    funcButton.addEventListener('click', () => {

        enterFunction(funcButton);

        if (funcButton.dataset.func == "clear") {
            deleteDigitsFromScreen();
            calculatorMode = CalculatorModes.INIT;
        }
    });
});

/* Digit Sequence 
 * runs when the user strikes a digit key
 * 
 * If in init mode or enter standby mode, reset the system and
 * begin from null into num1 entry
 * 
 * If in num2 standby, proceed to num2 entry
 * 
 * Add digits to the screen
 * 
 */
function digitSequence(digitButton) {
    if (calculatorMode === CalculatorModes.INIT || calculatorMode === CalculatorModes.ENTR_STDBY) {
        num1 = null;
        num2 = null;
        operator = null;
        dispNumber = "";
        deleteDigitsFromScreen();
        calculatorMode = CalculatorModes.NUM1_ENTRY;
    }

    if (calculatorMode === CalculatorModes.NUM2_STDBY) {
        deleteDigitsFromScreen();
        calculatorMode = CalculatorModes.NUM2_ENTRY;
    }

    if (dispNumber.length < MAX_DIGITS) {
        addDigitsToScreen(digitButton.dataset.digit);
        dispNumber += digitButton.dataset.digit;
    }
}

/* Operator Sequence 
 * runs when the user strikes an operator key
 * 
 * if in enter standby mode, revert to num1 entry
 * so that num1 is set and we go through num2 entry 
 * again
 * 
 * if in num1 entry mode, set num1 and proceed to num2 
 * entry
 * 
 * if in num2 entry, calculate interim result and 
 * dispaly to the user. Revert back to num2 standby
 * 
 */
function operationSequence(opButton) {
    if(calculatorMode === CalculatorModes.ENTR_STDBY) {
        calculatorMode = CalculatorModes.NUM1_ENTRY;
    }

    if (calculatorMode === CalculatorModes.NUM1_ENTRY) {
        num1 = +dispNumber;
        dispNumber = "";
    }

    if (calculatorMode === CalculatorModes.NUM2_ENTRY) {
        num2 = +dispNumber;
        num1 = operate(num1, num2, operator);
        if (num1 % 1 !== 0) {
            num1 = num1.toFixed(2);
        }
        dispNumber = num1.toString();
        deleteDigitsFromScreen();
        addDigitsToScreen(dispNumber);
    }

    dispNumber = "";
    operator = opButton.dataset.operator;
    calculatorMode = CalculatorModes.NUM2_STDBY;
}

/* Enter Function 
 * runs when the user strikes the enter key from 
 * calculator mode NUM2_ENTRY
 * 
 * Displays the queued operation result
 * and puts the calculator in enter standby mode
 * 
 */
function enterFunction(funcButton) {
    if (funcButton.dataset.func == "enter" && calculatorMode === CalculatorModes.NUM2_ENTRY) {
        num2 = +dispNumber;
        num1 = operate(num1, num2, operator);
        if (num1 % 1 !== 0) {
            num1 = num1.toFixed(2);
        }
        dispNumber = num1.toString();
        deleteDigitsFromScreen();
        addDigitsToScreen(dispNumber);
        calculatorMode = CalculatorModes.ENTR_STDBY;
    }
}

// Support function - Adds digits to the screen from a string
function addDigitsToScreen(dispNumber) {
    if (dispNumber.length > 8) {
        dispNumber = "OVERFLW"
    } 

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