import { pieces, colorMap } from './pieces';
import React from 'react';

class Piece extends React.Component {
    constructor() {
        super();
        const piece = pieces[Math.floor(7 * Math.random())];
        this.state = {
            shape: piece.shape,
            code: piece.code
        };
    }

    rotate() {
        const copy = JSON.parse(JSON.stringify(this.state.shape));
        const shape = this.state.shape;
        const n = shape.length;
        for (let i=0;i<n;i++) {
            for (let j=0;j<n;j++) {
                copy[i][n-1-j] = shape[j][i];
            }
        }
        this.setState({
            shape: copy
        })
    }

    leftmost() {
        const n = this.state.shape.length;
        return [...Array(n).keys()].map(i=> {
            for (let j=0;j<n;j++) {
                if (this.state.shape[i][j]) {
                    return j;
                }
            }
            return null;
        })
    }

    rightmost() {
        const n = this.state.shape.length;
        return [...Array(n).keys()].map(i=> {
            for (let j=n-1;j>=0;j--) {
                if (this.state.shape[i][j]) {
                    return j;
                }
            }
            return null;
        })
    }

    bottommost() {
        const n = this.state.shape.length;
        return [...Array(n).keys()].map(i=> {
            for (let j=n-1;j>=0;j--) {
                if (this.state.shape[j][i]) {
                    return j;
                }
            }
            return null;
        })
    }

    render() {
        const {shape, code} = this.state;
        return (shape ?
            <table>
                <tbody>
                {shape.map((row, i)=>(
                    <tr key={i}>
                        {row.map((col, i)=>
                            <td style={{
                                width: "50px",
                                height: "50px",
                                backgroundColor: col? colorMap[code]: 'none'
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