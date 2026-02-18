'use strict'

function getCellEl(i, j) {
    return document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
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

function stopTimer() {
    if (!gIntervalId) return
    clearInterval(gIntervalId)
    gIntervalId = null
}

function renderCell(i, j) {
    const elCell = getCellEl(i, j)
    var cell = gBoard[i][j]

    if (cell.isMarked) return

    if (cell.isRevealed) {
        elCell.classList.add('revealed')
        gGame.revealedCount++
    }

    if (cell.isMine) {
        elCell.innerText = mine
        return
    }

    elCell.innerText = cell.minesAroundCount > 0 ? cell.minesAroundCount : ''

    const elCount = document.querySelector('.count')
    elCount.innerText = String(gCountLeftMines).padStart(3, '0')
}

function renderBoard(board) {
    var strHtml = ''

    for (var i = 0; i < board.length; i++) {
        strHtml += `<tr>`

        for (var j = 0; j < board[i].length; j++) {

            const className = `cell cell-${i}-${j}`
            strHtml +=
                `<td 
                    data-i="${i}" data-j="${j}"
                    onclick="onCellClick(this)"
                    oncontextmenu="onCellRightClick(event, this)"
                    class="${className}"
                </td>`
        }
        strHtml += `</tr>`
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHtml
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}