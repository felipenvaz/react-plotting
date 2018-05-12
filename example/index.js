import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';
import "babel-polyfill";
import Measure from 'react-measure';

import ReactPlotting from './../src/ReactPlotting';

let style = {
    height: '100%',
    width: '100%'
};

class App extends React.Component {
    constructor(props) {
        super(props);

        this.images = [
            'https://www.roomsketcher.com/wp-content/uploads/2016/10/1-Bedroom-Floor-Plan-600x450.jpg',
            'https://www.roomsketcher.com/wp-content/uploads/2015/11/RoomSketcher-2-Bedroom-Floor-Plans.jpg'
        ];

        this.state = {
            dimensions: {
                width: 0,
                height: 0
            },
            elements: this.generateElements(2),
            image: this.images[0]
        };
    }

    generateElements(amount) {
        let images = ['http://icon-park.com/imagefiles/config_tool_icon2_blue.png'];
        let elements = [];

        for (let i = 0; i < amount; i++) {
            elements.push({
                imageUrl: images[Math.floor((Math.random() * 100 * images.length) % images.length)],
                position: {
                    x: (Math.random() * 300) + 100,
                    y: (Math.random() * 200) + 50
                },
                height: 25,
                width: 25
            });
        }

        return elements;
    }

    componentDidMount() {
        /* setInterval(() => {
            let idx = Math.floor(Math.random() * 100) % this.images.length;
            this.setState({ image: this.images[idx] });
        }, 2000); */
    }

    render() {
        return <Measure
            bounds
            onResize={(contentRect) => {
                this.setState({ dimensions: contentRect.bounds })
            }}>
            {({ measureRef }) =>
                <div ref={measureRef} style={style}>
                    <ReactPlotting imageUrl={this.state.image}
                        height={this.state.dimensions.height}
                        width={this.state.dimensions.width}
                        elements={this.state.elements} />
                </div>
            }
        </Measure>
    }
}

ReactDOM.render((
    <App />
), document.getElementById('root'));