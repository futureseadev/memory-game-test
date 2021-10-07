import React, { Component } from 'react'
export default class MemoryCard extends Component {
    render() {
        return (
            <div className="w-36 h-20 m-1 cursor-pointer relative" onClick={this.props.pickCard}>
                <div className="absolute w-full h-full duration-700 border-4 border-gray-800 shadow-sm"
                    style={(this.props.isFlipped) ? 
                        {transformStyle: `preserve-3d`, transform: "rotateY(180deg)"} 
                        :
                        {transformStyle: `preserve-3d`, transform: "rotateY(0deg)"}}
                >
                    <div className="absolute w-full h-full"
                        style={{backgroundImage: 
                            `repeating-radial-gradient(circle, #16a7a2, #16a7a2 10px, #13807c 10px, #13807c 20px)` 
                        }}
                    >
                    </div>
                    <div className="bg-white text-3xl pt-5 transform absolute w-full h-full text-center"
                        style={{transform: `rotateY(180deg)`}}
                    >
                        {this.props.symbol}
                    </div>                       
                </div>
            </div>
        )
    }
}
