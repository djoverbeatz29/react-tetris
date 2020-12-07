import React from 'react';
import Piece from './Piece';
import { colorMap } from './pieces';

class Tetris extends React.Component {
    constructor() {
        super();
        this.state = {
            board: [...Array(21).keys()].map(i=>[...Array(10).keys()].map(j=>0)),
            current: {},
            gameOn: true,
            score: 0,
            level: 1,
            rowsCompleted: 0
        }
    }

    placePiece(coords=this.current.location) {
        const [currX, currY] = this.current.location;
        const [x, y] = coords;
        const shape = this.current.piece.piece;
        for (let i=0; i<this.current.len; i++) {
            for (let j=0; j<this.current.len; j++) {
                if (shape[i][j]===1) this.board[currX+i][currY+j]=0;
            }
        }
        for (let i=0; i<this.current.len; i++) {
            for (let j=0; j<this.current.len; j++) {
                if (this.board[x+i]!==undefined && this.board[x+i][y+j]!==undefined && this.board[x+i][y+j]===0) this.board[x+i][y+j] = shape[i][j];
            }
        }
        this.current.location = [x,y];
        this.renderBoard();
    }

    getPiece() {
        this.board = this.board.map(row=>row.map(col=>col?2:0));
        const piece = new Piece();
        const n = piece.piece.length;
        this.current = {
            piece: piece,
            location: [4-n, 3],
            len: n
        }
        this.placePiece();
    }

    canMoveDown() {
        const lows = this.current.piece.bottommost().map((num,i)=>num!==null?[this.current.location[0]+num,this.current.location[1]+i]:null)
        const checks = lows.map(low=>low!==null?[low[0]+1,low[1]]:null)
        return !checks.find(check=>(check && (check[0]>=21 || this.board[check[0]][check[1]])));
    }

    canMoveLeft() {
        const lefts = this.current.piece.leftmost().map((num,i)=>num!==null?[this.current.location[0]+i,this.current.location[1]+num]:null);
        const checks = lefts.map(left=>left!==null?[left[0],left[1]-1]:null);
        return !checks.find(check=>(check && (check[1]<0 || this.board[check[0]][check[1]])));
    }

    canMoveRight() {
        const rights = this.current.piece.rightmost().map((num,i)=>num!==null?[this.current.location[0]+i,this.current.location[1]+num]:null);
        const checks = rights.map(right=>right!==null?[right[0],right[1]+1]:null);
        return !checks.find(check=>(check && (check[1]>=10 || this.board[check[0]][check[1]])));
    }

    moveDown() {
        if (this.canMoveDown()) this.placePiece([this.current.location[0]+1, this.current.location[1]]);
        else this.checkBoard();
    }

    moveLeft() {
        if (this.canMoveLeft()) this.placePiece([this.current.location[0], this.current.location[1]-1]);
    }

    moveRight() {
        if (this.canMoveRight()) this.placePiece([this.current.location[0], this.current.location[1]+1]);
    }

    rotate() {
        const [x, y] = this.current.location;
        for (let i=0; i<this.current.len; i++) {
            for (let j=0; j<this.current.len; j++) {
                if (this.current.piece.piece[i][j]) this.board[x+i][y+j]=0;
            }
        }
        this.current.piece.rotate();
        this.placePiece();
    }

    checkBoard() {
        if (this.current.location[0] < 3 && !this.canMoveDown()) this.gameOn = false;
        else {
            const completedRows = [...Array(this.board.length).keys()].filter(i=>this.board[i].find(col=>!col)===undefined);
            completedRows.forEach(i=>{
                this.board.splice(i,1);
                this.board.unshift([...Array(10).keys()].map(i=>0));
                this.score += 40 * this.level;
                this.rowsCompleted += 1;
                if (this.rowsCompleted % 10 === 0) this.level += 1;
            })
            this.getPiece();
        }
    }

    render() {
        const { board, score, level, rowsCompleted } = this.state;
        console.log(board);
        return (
            <div>
                <h2>SCORE: {score}</h2>
                <h2>LEVEL: {level}</h2>
                <h2>ROWS COMPLETED: {rowsCompleted}</h2>
                {board.map((row, i)=>(
                    <tr key={i}>
                        {row.map((col, i)=>
                            <td style={{
                                    width: "50px",
                                    height: "50px",
                                    backgroundColor: colorMap[col]
                                }} key={i}>
                            </td>)
                        }
                    </tr>)
                )}
            </div>
        )
    }
}

export default Tetris;