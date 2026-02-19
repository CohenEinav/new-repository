'use strict'

const MINE = '💣'
const FLAG = '🚩'

const gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isFirstClick: true
}

const gLeveles = {
    beginner: { size: 4, mines: 2 },
    medium: { size: 8, mines: 14 },
    expert: { size: 12, mines: 32 },
}

var gLevel = gLeveles.medium
var gIntervalId = null
var gBoard
var gMines
var gCountLeftMines


function onInit() {
    startGame()
}

function startGame() {
    clearInterval(gIntervalId)
    gIntervalId = null

    gGame.isOn = true
    gGame.revealedCount = 0
    gGame.markedCount = 0
    gGame.isFirstClick = true
    gCountLeftMines = gLevel.mines


    console.log('start here')
    gBoard = createBoardGame(gLevel.size)

    const elTimer = document.querySelector('.timer')
    elTimer.innerText = '000'.padStart(3, '0')

    const elCount = document.querySelector('.count')
    elCount.innerText = String(gLevel.mines).padStart(3, '0')

    const elSmily = document.querySelector('.smily span')
    elSmily.innerText = '😁'

    renderBoard()
}

function onSetLevel(level) {
    gLevel = gLeveles[level]
    startGame()
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
    return {
        minesAroundCount: 0,
        isRevealed: false,
        isMine: false,
        isMarked: false,
    }
}

function startTimer() {
    if (gIntervalId) return

    const elTimer = document.querySelector('.timer')
    const startTime = Date.now()

    gIntervalId = setInterval(() => {
        const timeDiff = Date.now() - startTime
        const timePassed = Math.floor(timeDiff / 1000)
        elTimer.innerText = String(timePassed).padStart(3, '0')
    }, 100)
}

function renderCell(i, j) {
    const elCount = document.querySelector('.count')
    elCount.innerText = String(gCountLeftMines).padStart(3, '0')

    const elCell = getCellEl(i, j)
    var cell = gBoard[i][j]

    elCell.classList.remove('revealed', 'marked')

    if (cell.isMarked) {
        elCell.classList.add('marked')
        elCell.innerText = FLAG
        return
    }

    if (!cell.isRevealed) {
        elCell.innerText = ''
        return
    }
    elCell.classList.add('revealed')
    // gGame.revealedCount++

    if (cell.isMine) elCell.innerText = MINE
    else elCell.innerText = cell.minesAroundCount > 0 ? cell.minesAroundCount : ''
}

//mines
function getMines(gBoard, firstI, firstJ) {
    var mines = []
    var countMines = 0

    while (countMines < gLevel.mines) {
        var i = getRandomInt(0, gLevel.size)
        var j = getRandomInt(0, gLevel.size)

        if (i === firstI && j === firstJ) continue
        if (gBoard[i][j].isMine) continue

        gBoard[i][j].isMine = true
        mines.push(gBoard[i][j])
        countMines++
    }
    return mines
}

function setAllMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            getMinesNegsCount(i, j)
        }
    }
}

function getMinesNegsCount(posI, posJ) {
    var count = 0

    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === posI && j === posJ) continue

            if (gBoard[i][j].isMine) count++
        }
    }
    gBoard[posI][posJ].minesAroundCount = count
}