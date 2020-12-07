import { pieces } from './pieces';
import React from 'react';

class Piece extends React.Component {
    constructor(props) {
        super(props);
        const piece = pieces[parseInt(props.index)];
        this.state = {
            shape: piece.shape,
            code: piece.code
        };
    }

    rotate() {
        const copy = JSON.parse(JSON.stringify(this.shape));
        const shape = this.shape;
        const n = shape.length;
        for (let i=0;i<n;i++) {
            for (let j=0;j<n;j++) {
                copy.shape[i][n-1-j] = shape[j][i];
            }
        }
        this.setState({
            piece: copy.piece,
            shape: copy.shape
        })
    }

    leftmost() {
        const n = this.piece.length;
        return [...Array(n).keys()].map(i=> {
            for (let j=0;j<n;j++) {
                if (this.piece[i][j]) {
                    return j;
                }
            }
            return null;
        })
    }

    rightmost() {
        const n = this.piece.length;
        return [...Array(n).keys()].map(i=> {
            for (let j=n-1;j>=0;j--) {
                if (this.piece[i][j]) {
                    return j;
                }
            }
            return null;
        })
    }

    bottommost() {
        const n = this.piece.length;
        return [...Array(n).keys()].map(i=> {
            for (let j=n-1;j>=0;j--) {
                if (this.piece[j][i]) {
                    return j;
                }
            }
            return null;
        })
    }

    render() {
        const {shape, color} = this.state;
        return (shape ?
            <table>
                <tbody>
                {shape.map((row, i)=>(
                    <tr key={i}>
                        {row.map((col, i)=>
                            <td style={{
                                width: "50px",
                                height: "50px",
                                backgroundColor: col? color: 'none'
                                }}
                                key={i}></td>)
                        }
                    </tr>)
                )}
                </tbody>
            </table> :
            <div></div>
        )          
    }

}

export default Piece;

Piece.defaultProps = {
    index: Math.floor(7 * Math.random())
}