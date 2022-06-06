let buttons = document
    .getElementById('calculator')
    .getElementsByTagName('button')
for (button of buttons) {
    button.addEventListener('click', buttonPress)
}

const calculator = {
    displayVal: document.getElementsByName('display'),
    vals: {},
    result: undefined,
    buttonPress: buttonPress,
    enterDigit: enterDigit,
    setOperator: setOperator,
    clear: clear,
    calculate: calculate,
}

function buttonPress() {
    console.log('Button pressed.')

    let handleButton = identifyButton(this)

    handleButton()
}

function identifyButton(buttonEl) {
    if (buttonEl.getAttribute('data-type') == 'digit') {
        return enterDigit
    } else if (buttonEl.getAttribute('data-type') == 'operator') {
        return setOperator
    } else if (buttonEl.getAttribute('data-type') == 'clear') {
        return clear
    } else if (buttonEl.getAttribute('data-type') == 'submit') {
        return calculate
    } else {
        console.error('Unrecognized button!')
    }
}

function enterDigit() {}
function setOperator() {}
function clear() {
    console.log('Clearing')
    calculator.vals = {}
    calculator.displayVal[0].textContent = '0'
}
function calculate() {}
