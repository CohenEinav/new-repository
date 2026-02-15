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

function onInit() {
    console.log('start')
    gBoard = createBoardGame()

    createMines(gBoard)
    setAllMinesNegsCount()

    renderBoard(gBoard)
    // gGame.isOn = true
}


//TODO: לעשות רנדומלי
function createMines(gBoard) {
    gBoard[2][1].isMine = true
    gBoard[1][3].isMine = true
    gBoard[4][6].isMine = true
    gBoard[3][2].isMine = true
    gBoard[5][7].isMine = true
    gBoard[6][1].isMine = true

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

    cell.isRevealed = true
    elCell.classList.add('revealed')
    gGame.revealedCount++

    // console.log('cell', cell)
    // console.dir(elCell)

    if (cell.isMine) {
        elCell.innerText = mine
        gameOver()
    } else if (cell.minesAroundCount > 0) {
        elCell.innerText = cell.minesAroundCount
    } else if (cell.minesAroundCount === 0) {
        blowUpNegs(i, j)
    }
}

function onCellRightClick(ev,elCell){
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

    // console.log (cell)
    // console.log (elCell)
    gGame.markedCount++
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
            }
            if (cell.minesAroundCount > 0 && !cell.isMarked) {
                cell.isRevealed = true
                elCell.classList.add('revealed')
                elCell.innerText = cell.minesAroundCount
            }
        }
    }
}





function gameOver() {
    //TODO:
    console.log('Game Over!')
}


function createBoardGame() {
    var board = []
    for (var i = 0; i < 8; i++) {
        board[i] = []

        for (var j = 0; j < 8; j++) {
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