const calculator = {
    displayVal: document.getElementsByName('display'),
    resetState: true,
    lastInputNum: true,
    decimelPlaced: false,
}
// Calculator Functions
calculator.buttonPress = function buttonPress() {
    let buttonFunction = calculator.identifyButton(this)

    let updateData = buttonFunction(this)

    calculator.updateDisplay(updateData)

    calculator.updateStates(updateData)
}

calculator.identifyButton = function identifyButton(buttonEl) {
    if (buttonEl.getAttribute('data-type') == 'digit') {
        return this.addDigit
    } else if (buttonEl.getAttribute('data-type') == 'decimel') {
        return this.placeDecimel
    } else if (buttonEl.getAttribute('data-type') == 'operator') {
        return this.addOperator
    } else if (buttonEl.getAttribute('data-type') == 'clear') {
        return this.clear
    } else if (buttonEl.getAttribute('data-type') == 'submit') {
        return this.calculate
    } else {
        console.error('Unrecognized button!')
    }
}

calculator.addDigit = function addDigit(button) {
    let digit = button.textContent.trim()

    if (calculator.resetState) {
        return {val: digit, updateType: 'replaceLast', num: true}
    } else {
        return {val: digit, updateType: 'add', num: true}
    }
}

calculator.placeDecimel = function placeDecimel() {
    if (calculator.resetState) {
        return {val: '.', updateType: 'replaceLast', num: true, decimel: true}
    } else {
        if (calculator.decimelPlaced) {
            return {
                val: undefined,
                updateType: 'pass',
                num: calculator.lastInputNum,
            }
        } else {
            return {val: '.', updateType: 'add', num: true, decimel: true}
        }
    }
}

calculator.addOperator = function addOperator(button) {
    let operator = button.textContent.trim()
    if (calculator.lastInputNum == false) {
        return {
            val: ' ' + operator + ' ',
            updateType: 'swapOp',
            num: false,
            decimel: false,
        }
    } else {
        return {
            val: ' ' + operator + ' ',
            updateType: 'add',
            num: false,
            decimel: false,
        }
    }
}

calculator.clear = function clear() {
    return {val: '0', updateType: 'replaceAll', num: true, decimel: false}
}

calculator.calculate = function calculate() {
    let equation = calculator.displayVal[0].textContent.split(' ')

    for (let opIndex = 1; equation[opIndex] != undefined; ) {
        let operator = equation[opIndex]
        let leftNum = equation[opIndex - 1]
        let rightNum = equation[opIndex + 1]
        if (operator == '*') {
            equation.splice(opIndex - 1, 3, Number(leftNum) * Number(rightNum))
        } else if (operator == '/') {
            result = Number(leftNum) / Number(rightNum)
            if (isFinite(result)) {
                equation.splice(opIndex - 1, 3, result)
            } else {
                alert('Cannot divide by 0!')
                return {
                    val: '0',
                    updateType: 'replaceAll',
                    num: true,
                    decimel: false,
                }
            }
        } else {
            opIndex += 2
        }
    }
    for (let opIndex = 1; equation.length > 1; ) {
        operator = equation[opIndex]
        let leftNum = equation[opIndex - 1]
        let rightNum = equation[opIndex + 1]
        if (operator == '+') {
            equation.splice(opIndex - 1, 3, Number(leftNum) + Number(rightNum))
        } else {
            equation.splice(opIndex - 1, 3, Number(leftNum) - Number(rightNum))
        }
    }

    calculator.result = equation.toString()
    decimelPresent = calculator.result.includes('.')

    return {
        val: calculator.result,
        updateType: 'replaceAll',
        num: true,
        decimel: decimelPresent,
    }
}

calculator.updateDisplay = function updateDisplay(data) {
    if (data.updateType == 'add') {
        this.displayVal[0].textContent += data.val
    } else if (data.updateType == 'swapOp') {
        this.displayVal[0].textContent = this.displayVal[0].textContent.slice(
            0,
            -3
        )
        this.displayVal[0].textContent += data.val
    } else if (data.updateType == 'replaceLast') {
        let vals = this.displayVal[0].textContent.split(' ')
        vals[vals.length - 1] = data.val
        this.displayVal[0].textContent = vals.join(' ')
    } else if (data.updateType == 'replaceAll') {
        this.displayVal[0].textContent = data.val
    } else if (data.updateType == 'pass') {
    } else {
        console.error('Unknown display update type!')
    }
}

// data keys: val (str), updateType (str), num (bool), decimel (bool)
calculator.updateStates = function updateStates(data) {
    this.lastInputNum = data.num

    let vals = this.displayVal[0].textContent.split(' ')
    if (
        vals[vals.length - 1].charAt(0) == '0' ||
        data.updateType == 'replaceAll'
    ) {
        this.resetState = true
    } else {
        this.resetState = false
    }

    if (data.decimel != undefined) {
        this.decimelPlaced = data.decimel
    }
}

// Event Listeners
let buttons = document
    .getElementById('calculator')
    .getElementsByTagName('button')
for (button of buttons) {
    button.addEventListener('click', calculator.buttonPress)
}
