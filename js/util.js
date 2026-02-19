'use strict'

function getCellEl(i, j) {
    return document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
}

function renderBoard() {
    var strHtml = ''

    for (var i = 0; i < gBoard.length; i++) {
        strHtml += `<tr>`

        for (var j = 0; j < gBoard[i].length; j++) {

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