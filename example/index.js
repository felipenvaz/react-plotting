import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';
import "babel-polyfill";
import Measure from 'react-measure'

import ReactPlotting from './../src/ReactPlotting';

let style = {
    height: '100%',
    width: '100%'
};

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dimensions: {}
        };
    }

    render() {
        return <Measure
            bounds
            onResize={(contentRect) => {
                this.setState({ dimensions: contentRect.bounds })
            }}>
            {({ measureRef }) =>
                <div ref={measureRef} style={style}>
                    <ReactPlotting imageUrl="https://www.roomsketcher.com/wp-content/uploads/2016/10/1-Bedroom-Floor-Plan-600x450.jpg"
                        height={this.state.dimensions.height}
                        width={this.state.dimensions.width} />
                </div>
            }
        </Measure>
    }
}

ReactDOM.render((
    <App />
), document.getElementById('root'));