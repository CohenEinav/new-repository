'use strict'
//game
function onCellClick(elCell) {
    if (!gGame.isOn) return

    const i = +elCell.dataset.i
    const j = +elCell.dataset.j
    var cell = gBoard[i][j]

    if (cell.isMarked) return
    if (cell.isRevealed) return

    startTimer()

    if (gGame.isFirstClick) {
        gMines = getMines(gBoard, i, j)
        setAllMinesNegsCount()
        blowUpNegs(i, j)
        gGame.isFirstClick = false
    }
    cell.isRevealed = true
    gGame.revealedCount++
    renderCell(i, j)

    if (cell.isMine) {
        clickOnMine(i, j)
        return
    }

    if (cell.minesAroundCount === 0) blowUpNegs(i, j)
    userWin()
}

function onCellRightClick(ev, elCell) {
    ev.preventDefault()
    if (!gGame.isOn) return

    const i = +elCell.dataset.i
    const j = +elCell.dataset.j
    var cell = gBoard[i][j]

    if (cell.isRevealed) return

    cell.isMarked = !cell.isMarked

    if (cell.isMarked) {
        gGame.markedCount++
        gCountLeftMines--
    } else {
        gGame.markedCount--
        gCountLeftMines++
    }
    
    renderCell(i, j)
    userWin()
}

function blowUpNegs(posI, posJ) {

    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue

        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === posI && j === posJ) continue

            var cell = gBoard[i][j]

            if (cell.isRevealed) continue
            if (cell.isMarked) continue
            if (cell.isMine) continue

            cell.isRevealed = true
            renderCell(i, j)

            if (cell.minesAroundCount > 0) continue
            if (cell.minesAroundCount === 0) blowUpNegs(i, j)
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
                elCell.innerText = MINE
                elCell.classList.add('revealed')
                gGame.revealedCount++
            }
        }
    }
    userLost()
}

function gameOver() {
    gGame.isOn = false
    clearInterval(gIntervalId)
    gIntervalId = null
}

function userLost() {
    const elSmily = document.querySelector('.smily span')
    elSmily.innerText = '😣'
    gameOver()
}

function userWin() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]

            if (cell.isMine && !cell.isMarked) return
            if (!cell.isMine && cell.isMarked) return
            if (!cell.isRevealed && !cell.isMarked) return
        }
    }
    const elSmily = document.querySelector('.smily span')
    elSmily.innerText = '😎'
    gameOver()
}