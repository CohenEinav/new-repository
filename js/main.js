'use strict'

const mine = '💣'
const flag = '🚩'

const gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

var gBoard
var gMines


function onInit() {
    startGame()
}

function startGame() {
    console.log('start here')
    gBoard = createBoardGame(8)
    gMines = createMines(gBoard)

    setAllMinesNegsCount()

    renderBoard(gBoard)
    // gGame.isOn = true
}


function createMines(gBoard) {
    // gBoard[2][1].isMine = true
    // gBoard[1][3].isMine = true
    // gBoard[4][6].isMine = true
    // gBoard[3][2].isMine = true
    // gBoard[5][7].isMine = true
    // gBoard[6][1].isMine = true

    var mines = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var currCell = gBoard[i][j]

            currCell.isMine = (Math.random() > 0.82) ? true : false
            if (currCell.isMine) mines.push(gBoard[i][j])
        }
    }
    return mines
}

function setAllMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            setMinesNegsCount(i, j)
        }
    }
}

function setMinesNegsCount(posI, posJ) {
    var count = 0

    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === posI && j === posJ) continue


            if (gBoard[i][j].isMine) count++
        }
    }
    // console.log('count', count)
    gBoard[posI][posJ].minesAroundCount = count
}

function onCellClick(elCell) {

    const i = +elCell.dataset.i
    const j = +elCell.dataset.j

    var cell = gBoard[i][j]

    if (cell.isMarked) return
    if (cell.isRevealed) return

    cell.isRevealed = true
    elCell.classList.add('revealed')
    gGame.revealedCount++

    // console.log('cell', cell)

    if (cell.isMine) {
        elCell.innerText = mine
        clickOnMine(i, j)
        gameOver()

    } else if (cell.minesAroundCount > 0) {
        elCell.innerText = cell.minesAroundCount
    } else if (cell.minesAroundCount === 0) {
        blowUpNegs(i, j)
    }
}

function onCellRightClick(ev, elCell) {
    ev.preventDefault()

    const i = +elCell.dataset.i
    const j = +elCell.dataset.j

    var cell = gBoard[i][j]
    if (cell.isRevealed) return

    cell.isRevealed = true
    elCell.classList.add('revealed')
    gGame.revealedCount++

    cell.isMarked = true
    elCell.innerText = flag
    gGame.markedCount++

    // console.log('cell', cell)
}

function blowUpNegs(posI, posJ) {

    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === posI && j === posJ) continue

            const selector = `[data-i="${i}"][data-j="${j}"]`
            var elCell = document.querySelector(selector)
            var cell = gBoard[i][j]

            if (cell.minesAroundCount === 0) {

                cell.isRevealed = true
                // console.log('cell', cell)
                elCell.classList.add('revealed')
                gGame.revealedCount++
            }
            if (cell.minesAroundCount > 0 && !cell.isMarked) {
                cell.isRevealed = true
                elCell.classList.add('revealed')
                gGame.revealedCount++
                elCell.innerText = cell.minesAroundCount
            }
        }
    }
}

function clickOnMine(posI, posJ) {
    i = posI
    j = posJ

    const selector = `[data-i="${i}"][data-j="${j}"]`
    var elCell = document.querySelector(selector)

    elCell.classList.add('boom')

    for (var i = 0; i < gMines.length; i++) {
        if (!gMines[i].isRevealed) gMines[i].isRevealed = true
    }

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {

            const selector = `[data-i="${i}"][data-j="${j}"]`
            var elCell = document.querySelector(selector)

            if (gBoard[i][j].isMine && !gBoard[i][j].isMarked) {

                elCell.isRevealed = true
                gGame.revealedCount++
                elCell.classList.add('revealed')
                elCell.innerText = mine

            }
        }
    }
}


function gameOver() {
    // console.log('mines number', gMines.length)
    console.log('gGame', gGame)
}

function createBoardGame(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []

        for (var j = 0; j < size; j++) {
            board[i][j] = createCellOnBoard()
        }
    }
    return board
}

function createCellOnBoard() {
    const cell = {
        minesAroundCount: 0,
        isRevealed: false,
        isMine: false,
        isMarked: false,
    }
    return cell
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}