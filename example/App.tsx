import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Measure from 'react-measure';

import ReactPlotting, {
    IPosition,
    IRectangle,
    Polygon
} from '../src';
import { IElement } from '../src/types/IElement';

const style: React.CSSProperties = {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

export interface IExampleElement extends IElement {
    name: string;
}

export interface IOwnState {
    elements: IExampleElement[];
    polygons: Polygon[];
    dimensions: { width: number; height: number };
    image: string;
    hoverText: string;
    clickText: string;
}

class App extends React.Component<{}, IOwnState> {
    private images = [
        'https://www.roomsketcher.com/wp-content/uploads/2016/10/1-Bedroom-Floor-Plan-600x450.jpg',
        'https://www.roomsketcher.com/wp-content/uploads/2015/11/RoomSketcher-2-Bedroom-Floor-Plans.jpg'
    ];

    constructor(props) {
        super(props);
        this.onElementsHover = this.onElementsHover.bind(this);
        this.onElementsClick = this.onElementsClick.bind(this);
        this.onElementsDragged = this.onElementsDragged.bind(this);
        this.onResize = this.onResize.bind(this);

        this.state = {
            dimensions: {
                width: 0,
                height: 0
            },
            elements: this.generateElements(5),
            polygons: [
                new Polygon('rgba(255, 0, 0, 0.5)', [
                    [50, 100],
                    [100, 100],
                    [100, 50],
                    [200, 50],
                    [200, 100],
                    [250, 100],
                    [200, 200],
                    [100, 200],
                ])
            ],
            image: this.images[0],
            hoverText: '',
            clickText: ''
        };
    }

    public render() {
        const {
            polygons,
            elements
        } = this.state;

        return (
            <div style={style}>
                <Measure bounds={true} onResize={this.onResize}>
                    {({ measureRef }) => {
                        return <div ref={measureRef} style={{ height: '80%', width: '80%', border: '1px solid gray' }} >
                            <div style={{ position: 'fixed', top: '5px', left: '5px' }}>{this.state.hoverText}</div>
                            <div style={{ position: 'fixed', top: '20px', left: '5px' }}>{this.state.clickText}</div>
                            <ReactPlotting imageUrl={this.state.image}
                                height={this.state.dimensions.height}
                                width={this.state.dimensions.width}
                                elements={elements}
                                polygons={polygons}
                                onElementsHover={this.onElementsHover}
                                onElementsClick={this.onElementsClick}
                                onElementsDragged={this.onElementsDragged} />
                        </div>;
                    }}
                </Measure>
            </div>
        );
    }

    private generateElements(amount) {
        const images = [// 'http://icon-park.com/imagefiles/config_tool_icon2_blue.png',
            'https://www.easycalculation.com/area/images/big-square.gif'];
        const elements = [] as IExampleElement[];

        for (let i = 0; i < amount; i++) {
            const shape: IRectangle = {
                x: (Math.random() * 600),
                y: (Math.random() * 450),
                height: 25,
                width: 25,
            };

            elements.push({
                name: `Element ${i}`,
                imageUrl: images[Math.floor((Math.random() * 100 * images.length) % images.length)],
                plottedShape: shape,

                elementScales: true
            });
        }

        return elements;
    }

    private onElementsHover(position: IPosition, elements: IExampleElement[]) {
        this.setState({ hoverText: elements.reduce((acc, cur) => acc + ` ${cur.name}`, '') });
    }

    private onElementsClick(position: IPosition, elements: IExampleElement[]) {
        this.setState({ clickText: elements.reduce((acc, cur) => acc + ` ${cur.name}`, '') });
    }

    private onElementsDragged(position: IPosition, elementsDragged: IExampleElement[]) {
        this.setState((prevState) => {
            const elements = [...prevState.elements];

            // instead of forEach, some is used to only allow the user to drag one element at a time
            elementsDragged.some((element) => {
                const draggedElement = elements.find((e) => e.name === element.name);
                draggedElement.plottedShape.x = element.plottedShape.x;
                draggedElement.plottedShape.y = element.plottedShape.y;
                return true;
            });

            return { elements };
        });
    }

    private onResize(contentRect) {
        this.setState({ dimensions: contentRect.bounds });
    }
}

ReactDOM.render((
    <App />
), document.getElementById('root'));