import * as React from 'react';
import { calculateCenterPosition, calculateScaledPosition } from './calcUtils.js';
import { MouseEvents, Position, Element, IImageHash, IImage } from './types';

export interface IReactPlottingProps {
    width: number;
    height: number;
    imageUrl: string;
    elements?: Array<Element>;
}

export interface IReactPlottingState {
    scale: number;
    displacement: Position;
    images: IImageHash;
}

export default class ReactPlotting extends React.Component<IReactPlottingProps, IReactPlottingState> {
    canvasRef: HTMLCanvasElement;
    mouseEvents: MouseEvents;

    constructor(props) {
        super(props);
        this.handleWheel = this.handleWheel.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.mouseDown = this.mouseDown.bind(this);

        this.state = {
            images: {},
            scale: 1,
            displacement: {
                x: 0,
                y: 0,
            }
        };
        if (props.imageUrl) {
            this.state.images[props.imageUrl] = {
                url: props.imageUrl
            };
        }

        this.mouseEvents = {
            isDown: false,
            previousPos: {
                x: 0,
                y: 0
            }
        };
    }

    setImage(image: IImage) {
        image.loading = true;
        var img = new Image();
        img.onload = () => {
            this.setState((prevState) => {
                let newState = { images: { ...prevState.images } };
                newState.images[image.url].loaded = true;
                newState.images[image.url].loading = false;
                return newState;
            });
        };
        img.onerror = () => {
            this.setState((prevState) => {
                let newState = { images: { ...prevState.images } };
                newState.images[image.url].loaded = false;
                newState.images[image.url].loading = false;
                return newState;
            });
        };
        img.src = image.url;
        image.image = img;
    }

    loadImages() {
        this.setState((prevState) => {
            let stateShouldChange = false;
            let newState = { images: { ...prevState.images } };
            for (let key in newState.images) {
                let image = newState.images[key];
                if (image.loaded === undefined && !image.loading) {
                    stateShouldChange = true;
                    this.setImage(image);
                }
            }
            return stateShouldChange ? newState : null;
        });
    }

    updateCanvas() {
        if (this.canvasRef) {
            let canvas = this.canvasRef;
            let canvasDimensions = { width: this.props.width, height: this.props.height };
            canvas.height = canvasDimensions.height;
            canvas.width = canvasDimensions.width;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (this.state.images[this.props.imageUrl] && this.state.images[this.props.imageUrl].loaded) {
                let mainImage = this.state.images[this.props.imageUrl];
                let imageDimensions = {
                    width: mainImage.image.width,
                    height: mainImage.image.height
                };
                let imageRect = calculateCenterPosition(canvasDimensions, imageDimensions);
                imageRect.x += this.state.displacement.x;
                imageRect.y += this.state.displacement.y;

                let scaledImageRect = calculateScaledPosition(canvasDimensions, imageRect, this.state.scale);
                ctx.drawImage(mainImage.image,
                    scaledImageRect.x,
                    scaledImageRect.y,
                    scaledImageRect.width,
                    scaledImageRect.height);

                this.renderElements();
                /* ctx.strokeStyle = "red";
                ctx.strokeRect(canvasDimensions.width / 2 - 2, canvasDimensions.height / 2 - 2, 4, 4); */
            }
        }
    }

    renderElements() {
        if (this.props.elements) {
            //how to calculate the position? answer: relative to the image, as if the image would be plotted with its original size
            //if the screen size changes, the position would be wrong
        }
    }

    handleWheel(event) {
        this.setState((prevState) => {
            return { scale: prevState.scale * (1 - event.deltaY / 1000) }
        });
    }

    mouseMove(event) {
        if (this.mouseEvents.isDown) {
            let diffX = event.x - this.mouseEvents.previousPos.x;
            let diffY = event.y - this.mouseEvents.previousPos.y;
            this.setState((prevState) => {
                return {
                    displacement: {
                        x: prevState.displacement.x + diffX / prevState.scale,
                        y: prevState.displacement.y + diffY / prevState.scale
                    }
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
        this.canvasRef.addEventListener('mousemove', this.mouseMove);
        this.canvasRef.addEventListener('mouseup', this.mouseUp);
        this.canvasRef.addEventListener('mouseleave', this.mouseUp);
        this.canvasRef.addEventListener('mousedown', this.mouseDown);
    }

    componentWillUnmount() {
        window.removeEventListener('wheel', this.handleWheel);
        this.canvasRef.removeEventListener('mousemove', this.mouseMove);
        this.canvasRef.removeEventListener('mouseup', this.mouseUp);
        this.canvasRef.addEventListener('mouseleave', this.mouseUp);
        this.canvasRef.removeEventListener('mousedown', this.mouseDown);
    }

    componentDidUpdate() {
        this.loadImages();
        this.updateCanvas();
    }

    componentWillReceiveProps(nextProps) {
        let nextState = { ...this.state };
        if (nextProps.imageUrl != this.props.imageUrl) {
            if (nextState.images[nextProps.imageUrl] === undefined) {
                nextState.images[nextProps.imageUrl] = {
                    url: nextProps.imageUrl
                };
            }
        } else if (this.state.images[nextProps.imageUrl] && this.state.images[nextProps.imageUrl].loaded) {
            let calculateProportionalDisplacement = (currDisplacement, currDim, nextDim) => {
                if (!currDim || !nextDim) {
                    return currDisplacement;
                }
                return (nextDim / currDim) * currDisplacement;
            };

            let mainImage = this.state.images[nextProps.imageUrl];
            let imageDimensions = {
                width: mainImage.image.width,
                height: mainImage.image.height
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
        return <canvas style={{ display: 'block' }} ref={(canvas) => { this.canvasRef = canvas; }}></canvas>;
    }
}