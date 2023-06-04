const container = document.querySelector(".container");
const calculator = document.querySelector(".calculator");
const display = document.querySelector(".display");
const buttons = document.querySelectorAll(".row > *");

const ANS_MAX_DECIMAL_PLACES = 10;
const DISPLAY_MAX_LEN = 10;
const MOBILE_VIEW_WIDTH_SAFETY_MARGIN = 50;

const opers = {
    "+": add,
    "-": subtract,
    "*": multiply,
    "/": divide,
};
const operators = Object.keys(opers);

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function isNum(input) {
    return !isNaN(input);
}

function trunc(decimal, places) {
    // retain said number of decimal places
    decimal = decimal.toString();
    return decimal.slice(0, decimal.indexOf(".") + places + 1);
}

function displayText(t) {
    display.textContent = t;
}

function handleClick(char, event) {
    if (char instanceof Object) char = this.textContent;

    char = char.toString();
    if (isNum(char) || char === "." || operators.includes(char)) {
        console.log(char);

        if (event !== undefined) event.preventDefault();
        parseInput(char);
    } else if (char === "=") solve();
}

let o1 = "";
let o2 = "";
let op = "";
let ans = "";
let temp = "";
let newTextTillOperInput = "";
let operatorGiven = false;
let clearScreen = false;
// let disableInput = false;

function parseInput(c) {
    console.log(o1, op, o2);

    if (clearScreen) displayText("");

    if (operators.includes(c)) {
        if (((o1 || clearScreen) && !op) || o2) {
            if (clearScreen) o1 = ans;
            if (o2) {
                const ans = performOperation();
                o1 = ans;
            }

            op = c;
            temp = [o1, op].join(" ");
            displayText(temp);

            operatorGiven = true;
            newTextTillOperInput = temp;
        }
    } else if (isNum(c) || c === ".") {
        // if (disableInput) return;

        if (!operatorGiven) {
            o1 += c;
            temp = o1;
        } else {
            o2 += c;
            temp = [newTextTillOperInput, o2].join(" ");
        }
        displayText(temp);
    }

    // if (temp.length > DISPLAY_MAX_LEN) disableInput = true;

    clearScreen = false;
    console.log(o1, op, o2);
}

function performOperation() {
    if (o1 && op && o2) {
        const operFunc = opers[op];
        ans = operFunc(Number(o1), Number(o2));
        ans = trunc(ans, ANS_MAX_DECIMAL_PLACES);

        clearVars();
        return ans;
    } else return false;
}

function solve() {
    const ans = performOperation();
    if (ans) displayText(ans);
}

function clearVars() {
    o1 = "";
    o2 = "";
    op = "";
    operatorGiven = false;
    clearScreen = true;
    // disableInput = false;
    temp = "";
}

function resetState() {
    clearVars();
    displayText("");
}

buttons.forEach((b) => {
    b.addEventListener("click", handleClick);
});

// unable to pass only the function name as this.key not working on other side
document.addEventListener("keydown", (e) => {
    handleClick(e.key, e);
});

document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() == "enter") solve();
    else if (e.key.toLowerCase() == "escape") resetState();
});

let deviceIsMobile = false;
if (window.innerHeight > window.innerWidth) deviceIsMobile = true;
if (deviceIsMobile)
    calculator.style.width = `${
        window.innerWidth - MOBILE_VIEW_WIDTH_SAFETY_MARGIN
    }px`;
