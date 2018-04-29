import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import { calculateCenterPosition, calculateScaledPosition } from './calcUtils.js';

export default class ReactPlotting extends React.Component {
    constructor(props) {
        super(props);
        this.handleWheel = this.handleWheel.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseDown = this.mouseDown.bind(this);

        this.canvasRef = React.createRef();
        this.state = {
            image: {
                loaded: false,
                image: null,
                url: props.imageUrl
            },
            scale: 1,
            displacement: {
                x: 0,
                y: 0,
            }
        };
        this.mouseEvents = {
            isDown: false,
            previousPos: {
                x: 0,
                y: 0
            }
        };
    }
    loadImage() {
        var img = new Image();
        img.onload = () => {
            this.setState({ image: { ...this.state.image, image: img, loaded: true } });
        };
        img.src = this.state.image.url;
    }

    updateCanvas() {
        if (this.canvasRef.current) {
            let canvas = this.canvasRef.current;
            let canvasDimensions = { width: this.props.width, height: this.props.height };
            canvas.height = canvasDimensions.height;
            canvas.width = canvasDimensions.width;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (this.state.image.loaded) {
                let imageDimensions = {
                    width: this.state.image.image.width,
                    height: this.state.image.image.height
                };
                let imageRect = calculateCenterPosition(canvasDimensions, imageDimensions);
                imageRect.x += this.state.displacement.x;
                imageRect.y += this.state.displacement.y;

                let scaledImageRect = calculateScaledPosition(canvasDimensions, imageRect, this.state.scale);
                ctx.drawImage(this.state.image.image,
                    scaledImageRect.x,
                    scaledImageRect.y,
                    scaledImageRect.width,
                    scaledImageRect.height);

                ctx.strokeStyle = "red";
                ctx.strokeRect(canvasDimensions.width / 2 - 2, canvasDimensions.height / 2 - 2, 4, 4);
            }
        }
    }

    handleWheel(event) {
        this.setState({ scale: this.state.scale * (1 - event.deltaY / 1000) });
    }

    mouseMove(event) {
        if (this.mouseEvents.isDown) {
            let diffX = event.x - this.mouseEvents.previousPos.x;
            let diffY = event.y - this.mouseEvents.previousPos.y;
            this.setState({
                displacement: {
                    x: this.state.displacement.x + diffX / this.state.scale,
                    y: this.state.displacement.y + diffY / this.state.scale
                }
            });
            this.mouseEvents.previousPos = { x: event.x, y: event.y };
        }
    }

    mouseUp(event) {
        this.mouseEvents.isDown = false;
    }

    mouseDown(event) {
        this.mouseEvents.isDown = true;
        this.mouseEvents.previousPos = { x: event.x, y: event.y };

    }

    componentDidMount() {
        window.addEventListener('wheel', this.handleWheel);
        this.canvasRef.current.addEventListener('mousemove', this.mouseMove);
        this.canvasRef.current.addEventListener('mouseup', this.mouseUp);
        this.canvasRef.current.addEventListener('mouseleave', this.mouseUp);
        this.canvasRef.current.addEventListener('mousedown', this.mouseDown);
    }

    componentWillUnmount() {
        window.removeEventListener('wheel', this.handleWheel);
        this.canvasRef.current.removeEventListener('mousemove', this.mouseMove);
        this.canvasRef.current.removeEventListener('mouseup', this.mouseUp);
        this.canvasRef.current.addEventListener('mouseleave', this.mouseUp);
        this.canvasRef.current.removeEventListener('mousedown', this.mouseDown);
    }

    componentDidUpdate() {
        if (!this.state.image.loaded) {
            this.loadImage();
        }
        this.updateCanvas();
    }

    componentWillReceiveProps(nextProps) {
        let nextState = { ...this.state };
        if (nextProps.imageUrl && nextProps.imageUrl != this.state.image.url) {
            nextState.image = {
                loaded: false,
                image: null,
                url: nextProps.imageUrl
            };
            nextState.displacement = { x: 0, y: 0 };
        } else if (nextState.image.loaded) {
            let calculateProportionalDisplacement = (currDisplacement, currDim, nextDim) => {
                if (!currDim || !nextDim) {
                    return currDisplacement;
                }
                return (nextDim / currDim) * currDisplacement;
            };

            let imageDimensions = {
                width: this.state.image.image.width,
                height: this.state.image.image.height
            };
            let imageRect = calculateCenterPosition({ width: this.props.width, height: this.props.height },
                imageDimensions);
            let newImageRect = calculateCenterPosition({ width: nextProps.width, height: nextProps.height },
                imageDimensions);

            if (newImageRect.width != imageRect.width) {
                nextState.displacement.x = calculateProportionalDisplacement(this.state.displacement.x, imageRect.width, newImageRect.width);
            }
            if (newImageRect.height != imageRect.height) {
                nextState.displacement.y = calculateProportionalDisplacement(this.state.displacement.y, imageRect.height, newImageRect.height);
            }
        }
        this.setState(nextState);
    }

    render() {
        return <canvas style={{ display: 'block' }} ref={this.canvasRef}></canvas>;
    }
}