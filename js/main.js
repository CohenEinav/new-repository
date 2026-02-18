'use strict'

const mine = '💣'
const flag = '🚩'

const gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

const gLeveles = {
    beginner: { size: 4, mines: 2 },
    intermediate: { size: 8, mines: 14 },
    expert: { size: 12, mines: 32 },
}

var gLevel = gLeveles.intermediate
var gIntervalId = null
var gBoard
var gMines
var gCountLeftMines


function onInit() {
    startGame()
}

function startGame() {

    gGame.isOn = true
    gGame.revealedCount = 0
    gGame.markedCount = 0

    console.log('start here')
    gBoard = createBoardGame(gLevel.size)
    // gMines = createMines(gBoard)
    gMines = setMines(gBoard)
    gCountLeftMines = gMines.length
    setAllMinesNegsCount()
    renderBoard(gBoard)
}

function onSetLevel(level) {
    gLevel = gLeveles[level]
    startGame()
}


function setMines(gBoard) {
    var mines = []
    var countMines = 0
    var maxMines = gLevel.mines

    while (countMines < maxMines) {

        var i = getRandomInt(0, gLevel.size)
        var j = getRandomInt(0, gLevel.size)

        if (gBoard[i][j].isMine) continue

        gBoard[i][j].isMine = true
        mines.push(gBoard[i][j])

        countMines++
    }
    return mines
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
    if (!gGame.isOn) return

    const i = +elCell.dataset.i
    const j = +elCell.dataset.j
    var cell = gBoard[i][j]

    if (cell.isMarked) return
    if (cell.isRevealed) return

    startTimer()

    cell.isRevealed = true
    renderCell(i, j)

    if (cell.isMine) {
        clickOnMine(i, j)
        return
    }
    if (cell.minesAroundCount === 0) blowUpNegs(i, j)
}


function onCellRightClick(ev, elCell) {
    ev.preventDefault()
    if (!gGame.isOn) return

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
    if (cell.isMine) gCountLeftMines--

}

function blowUpNegs(posI, posJ) {

    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === posI && j === posJ) continue

            var cell = gBoard[i][j]

            if (cell.minesAroundCount === 0) cell.isRevealed = true
            if (cell.minesAroundCount > 0 && !cell.isMarked) cell.isRevealed = true

            renderCell(i, j)
        }
    }
}

function clickOnMine(i, j) {
    var elCell = getCellEl(i, j)
    elCell.classList.add('boom')

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            var cell = gBoard[i][j]

            if (cell.isMine && !cell.isMarked) {
                var elCell = getCellEl(i, j)
                elCell.innerText = mine
                elCell.classList.add('revealed')
                gGame.revealedCount++

            }
        }
    }
    gameOver()
}

function gameOver() {
    gGame.isOn = false
    stopTimer()
    
    var countLeftMines = 0

    for (var i = 0; i < gMines.length; i++) {
        if (!gMines[i].isRevealed) countLeftMines++
    }

    const elCount = document.querySelector('.count')
    elCount.innerText = String(countLeftMines).padStart(3, '0')
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
