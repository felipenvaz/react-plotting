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

                let scaledImageRect = calculateScaledPosition(imageRect, this.state.scale);
                ctx.drawImage(this.state.image.image,
                    scaledImageRect.x,
                    scaledImageRect.y,
                    scaledImageRect.width,
                    scaledImageRect.height);
            }
        }
    }
    componentDidUpdate() {
        if (!this.state.image.loaded) {
            this.loadImage();
        }
        this.updateCanvas();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.imageUrl != this.state.image.url) {
            this.setState({
                image: {
                    loaded: false,
                    image: null,
                    url: nextProps.imageUrl
                }
            });
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
    render() {
        return <canvas style={{ display: 'block' }} ref={this.canvasRef}></canvas>;
    }
}