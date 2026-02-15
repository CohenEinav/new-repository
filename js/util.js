'use strict'

function renderBoard(board) {
    var strHtml = ''

    for (var i = 0; i < board.length; i++) {
        strHtml += `<tr>`

        for (var j = 0; j < board[i].length; j++) {
            const className = `cell cell-${i}-${j}`
            strHtml +=
                `<td 
                    data-i="${i}" data-j="${j}"
                    onclick="onCellClick(${i}, ${j}, this)"
                    class="${className}"
                </td>`
        }
        strHtml += `</tr>`
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHtml

}

