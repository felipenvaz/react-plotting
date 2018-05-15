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
        this.onElementsHover = this.onElementsHover.bind(this);
        this.onElementsClick = this.onElementsClick.bind(this);
        this.onElementsDragged = this.onElementsDragged.bind(this);
        this.images = [
            'https://www.roomsketcher.com/wp-content/uploads/2016/10/1-Bedroom-Floor-Plan-600x450.jpg',
            'https://www.roomsketcher.com/wp-content/uploads/2015/11/RoomSketcher-2-Bedroom-Floor-Plans.jpg'
        ];

        this.state = {
            dimensions: {
                width: 0,
                height: 0
            },
            elements: this.generateElements(50),
            image: this.images[0],
            hoverText: '',
            clickText: ''
        };
    }

    generateElements(amount) {
        let images = ['http://icon-park.com/imagefiles/config_tool_icon2_blue.png'];
        let elements = [];

        for (let i = 0; i < amount; i++) {
            elements.push({
                name: `Element ${i}`,
                imageUrl: images[Math.floor((Math.random() * 100 * images.length) % images.length)],
                x: (Math.random() * 600),
                y: (Math.random() * 450),
                height: 25,
                width: 25,
                elementScales: true
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

    onElementsHover(elements) {
        this.setState({ hoverText: elements.reduce((acc, cur) => acc + ` ${cur.name}`, '') });
    }

    onElementsClick(elements) {
        this.setState({ clickText: elements.reduce((acc, cur) => acc + ` ${cur.name}`, '') });
    }

    onElementsDragged(elementsDragged) {
        this.setState((prevState) => {
            let elements = [...prevState.elements];

            elementsDragged.forEach((element) => {
                let draggedElement = elements.find((e) => e.name === element.name);
                draggedElement.x = element.x;
                draggedElement.y = element.y;
            });

            return { elements };
        });
    }

    render() {
        return <Measure
            bounds
            onResize={(contentRect) => {
                this.setState({ dimensions: contentRect.bounds })
            }}>
            {({ measureRef }) =>
                <div ref={measureRef} style={style}>
                    <div style={{ position: 'fixed', top: '5px', left: '5px' }}>{this.state.hoverText}</div>
                    <div style={{ position: 'fixed', top: '20px', left: '5px' }}>{this.state.clickText}</div>
                    <ReactPlotting imageUrl={this.state.image}
                        height={this.state.dimensions.height}
                        width={this.state.dimensions.width}
                        elements={this.state.elements}
                        onElementsHover={this.onElementsHover}
                        onElementsClick={this.onElementsClick}
                        onElementsDragged={this.onElementsDragged} />
                </div>
            }
        </Measure>
    }
}

ReactDOM.render((
    <App />
), document.getElementById('root'));