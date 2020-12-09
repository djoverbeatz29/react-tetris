import React from 'react';
import Piece from './Piece';
import { colorMap } from './pieces';
import cloneDeep from 'lodash/cloneDeep';

class Tetris extends React.Component {
    constructor() {
        super();
        this.state = {
            board: [...Array(21).keys()].map(i=>[...Array(10).keys()].map(j=>0)),
            current: {
                piece: new Piece(),
                location: [0,3]
            },
            gameOn: true,
            score: 0,
            level: 1,
            rowsCompleted: 0
        }
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {
        this.getPiece();
    }

    placePiece(coords=this.state.current.location) {
        const board = this.state.board;
        const [x, y] = coords;
        const [currX, currY] = this.state.current.location;
        const shape = this.state.current.piece.state.shape;
        const n = shape.length;
        const boardCopy = cloneDeep(board);
        for (let i=0; i<n; i++) {
            for (let j=0; j<n; j++) {
                if (shape[i][j]>0) boardCopy[currX+i][currY+j]=0;
            }
        }
        for (let i=0; i<n; i++) {
            for (let j=0; j<n; j++) {
                if (x+i<=20 && y+j>=0 && y+j<=9 && boardCopy[x+i][y+j]===0) boardCopy[x+i][y+j] = shape[i][j];
            }
        }
        this.setState(prevState=>{
            return {
                ...prevState,
                board: boardCopy,
                current: {
                    ...prevState.current,
                    location: [x,y]
                }
            }
        })            
    }

    getPiece() {
        const piece = new Piece();
        const {shape, code} = piece.state;
        const n = shape.length;
        this.setState(prevState => {
            return {
                ...prevState,
                current: {
                    piece: piece,
                    location: [4-n, 3],
                    code: code,
                }
            }
        })
        this.placePiece();
    }

    canMoveDown() {
        const board = this.state.board;
        const {piece, location} = this.state.current;
        const lows = piece.bottommost().map((num,i)=>num!==null?[location[0]+num,location[1]+i]:null)
        const checks = lows.map(low=>low!==null?[low[0]+1,low[1]]:null)
        return !checks.find(check=>(check && (check[0]>=21 || board[check[0]][check[1]])));
    }

    canMoveLeft() {
        const board = this.state.board;
        const {piece, location} = this.state.current;
        const lefts = piece.leftmost().map((num,i)=>num!==null?[location[0]+i,location[1]+num]:null);
        const checks = lefts.map(left=>left!==null?[left[0],left[1]-1]:null);
        return !checks.find(check=>(check && (check[1]<0 || board[check[0]][check[1]])));
    }

    canMoveRight() {
        const board = this.state.board;
        const {piece, location} = this.state.current;
        const rights = piece.rightmost().map((num,i)=>num!==null?[location[0]+i,location[1]+num]:null);
        const checks = rights.map(right=>right!==null?[right[0],right[1]+1]:null);
        return !checks.find(check=>(check && (check[1]>=10 || board[check[0]][check[1]])));
    }

    moveDown() {
        const {location} = this.state.current;
        if (this.canMoveDown()) this.placePiece([location[0]+1, location[1]]);
        else this.checkBoard();
    }

    moveLeft() {
        const {location} = this.state.current;
        if (this.canMoveLeft()) this.placePiece([location[0], location[1]-1]);
    }

    moveRight() {
        const {location} = this.state.current;
        if (this.canMoveRight()) this.placePiece([location[0], location[1]+1]);
    }

    rotate() {
        const {piece, location} = this.state.current;
        const board = this.state.board;
        const [x, y] = location;
        const shape = piece.state.shape;
        const n = shape.length;
        for (let i=0; i<n; i++) {
            for (let j=0; j<n; j++) {
                if (shape[i][j]) board[x+i][y+j]=0;
            }
        }
        piece.rotate();
        this.placePiece();
    }

    handleKeyDown(e) {
        let key = e.key;
        if (key==='ArrowUp') this.rotate();
        else if (key==='ArrowDown') this.moveDown();
        else if (key==='ArrowLeft') this.moveLeft();
        else if (key==='ArrowRight') this.moveRight();
    }

    checkBoard() {
        const board = this.state.board;
        const {location} = this.state.current;
        if (location[0] < 3 && !this.canMoveDown()) this.setState({gameOn: false});
        else {
            const boardCopy = cloneDeep(board);
            const completedRows = [...Array(board.length).keys()].filter(i=>board[i].find(col=>!col)===undefined);
            completedRows.forEach(i=>{
                boardCopy.splice(i,1);
                boardCopy.unshift([...Array(10).keys()].map(i=>0));
                this.setState(prevState => {
                    return {
                        score: prevState.score + 40 * prevState.level,
                        rowsCompleted: prevState.rowsCompleted + 1,
                    }
                })
                if (this.state.rowsCompleted % 10 === 0) {
                    this.setState(prevState=> {
                        return {
                            level: prevState.level + 1
                        }
                    })
                }
            })
            this.setState({ board: boardCopy });
            this.getPiece();
        }
    }

    render() {
        const { board, score, level, rowsCompleted } = this.state;
        return (
            <div
                onKeyDown={this.handleKeyDown}
                tabIndex={0}
            >
                <h2>SCORE: {score}</h2>
                <h2>LEVEL: {level}</h2>
                <h2>ROWS COMPLETED: {rowsCompleted}</h2>
                <table>
                    <tbody>
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
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Tetris;