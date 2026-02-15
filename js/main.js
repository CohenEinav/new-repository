'use strict'

const mine = '💣'

const gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0,
}

var gBoard

onInit()
function onInit() {
    console.log('start')
    gBoard = createBoardGame()

    // createMines(gBoard)
    gBoard[2][1].isMine = true
    gBoard[1][3].isMine = true
    setAllMinesNegsCount()

    renderBoard(gBoard)
    // gGame.isOn = true
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
    console.log('count', count)
    gBoard[posI][posJ].minesAroundCount = count
}


function onCellClick(i, j, elCell) {
    console.log('click')
}


function createBoardGame() {
    var board = []
    for (var i = 0; i < 4; i++) {
        board[i] = []

        for (var j = 0; j < 4; j++) {
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