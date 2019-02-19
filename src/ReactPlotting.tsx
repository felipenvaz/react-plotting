import * as React from 'react';
import {
    calculateCenterPosition,
    calculateScaledPosition,
    calculateProportion,
    calculateProportionalDisplacement
} from './utils/calcUtils';
import {
    isHoveringPlottedShape,
    isRectangle
} from './utils/shapeUtils';
import {
    IMouseEvents,
    IImageHash,
    IImage
} from './types';
import { IElement } from './types/Element';
import {
    IPosition,
    IRectangle,
    IPlottedShape
} from './types/Shapes';

export interface IReactPlottingProps {
    width: number;
    height: number;
    imageUrl: string;
    elements?: IElement[];
    onElementsHover?: (position: IPosition, elements: IElement[]) => void;
    onElementsClick?: (position: IPosition, elements: IElement[]) => void;
    onElementsDragged?: (position: IPosition, elements: IElement[]) => void;
}

export interface IReactPlottingState {
    scale: number;
    displacement: IPosition;
    images: IImageHash;
}

export default class ReactPlotting extends React.Component<IReactPlottingProps, IReactPlottingState> {
    public canvasRef: HTMLCanvasElement;
    public mouseEvents: IMouseEvents = {
        isDown: false,
        dragging: false,
        previousPos: {
            x: 0,
            y: 0
        }
    };
    public bgImageProportion = 1;
    public renderedElements: { plottedShape: IPlottedShape; element: IElement }[] = [];
    public canvasStyle: React.CSSProperties = {
        display: 'block'
    };

    constructor(props) {
        super(props);
        this.onWheel = this.onWheel.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.setCanvasRef = this.setCanvasRef.bind(this);

        this.state = {
            images: {},
            scale: 1,
            displacement: {
                x: 0,
                y: 0
            }
        };

        if (props.imageUrl) {
            this.state.images[props.imageUrl] = {
                url: props.imageUrl
            };
        }
    }

    public render() {
        return (<canvas
            style={this.canvasStyle}
            ref={this.setCanvasRef}
            onWheel={this.onWheel}
            onMouseMove={this.onMouseMove}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
            onMouseLeave={this.onMouseLeave}
        />);
    }

    public componentDidUpdate() {
        this.loadImages();
        this.updateCanvas();
    }

    public componentWillReceiveProps(nextProps) {
        const nextState = { ...this.state };
        if (nextProps.imageUrl !== this.props.imageUrl) {
            if (nextState.images[nextProps.imageUrl] === undefined) {
                nextState.images[nextProps.imageUrl] = {
                    url: nextProps.imageUrl
                };
            }
            nextState.displacement = { x: 0, y: 0 };
        } else if (this.state.images[nextProps.imageUrl] && this.state.images[nextProps.imageUrl].loaded
            && (this.props.width !== nextProps.width || this.props.height !== nextProps.height)) {
            const mainImage = this.state.images[nextProps.imageUrl];
            const imageDimensions = {
                width: mainImage.image.width,
                height: mainImage.image.height
            };
            const imageRect = calculateCenterPosition({ width: this.props.width, height: this.props.height },
                imageDimensions);
            const newImageRect = calculateCenterPosition({ width: nextProps.width, height: nextProps.height },
                imageDimensions);

            if (newImageRect.width !== imageRect.width) {
                nextState.displacement.x = calculateProportionalDisplacement(this.state.displacement.x, imageRect.width, newImageRect.width);
            }
            if (newImageRect.height !== imageRect.height) {
                nextState.displacement.y = calculateProportionalDisplacement(this.state.displacement.y, imageRect.height, newImageRect.height);
            }
        }

        if (nextProps.elements) {
            nextProps.elements.forEach((element) => {
                if (nextState.images[element.imageUrl] === undefined) {
                    nextState.images[element.imageUrl] = {
                        url: element.imageUrl
                    };
                }
            });
        }

        this.setState(nextState);
    }

    private setImage(image: IImage) {
        image.loading = true;
        const img = new Image();
        img.onload = () => {
            this.setState((prevState) => {
                const newState = { images: { ...prevState.images } };
                newState.images[image.url].loaded = true;
                newState.images[image.url].loading = false;
                return newState;
            });
        };
        img.onerror = () => {
            this.setState((prevState) => {
                const newState = { images: { ...prevState.images } };
                newState.images[image.url].loaded = false;
                newState.images[image.url].loading = false;
                return newState;
            });
        };
        img.src = image.url;
        image.image = img;
    }

    private loadImages() {
        this.setState((prevState) => {
            let stateShouldChange = false;
            const newState = { images: { ...prevState.images } };
            Object.keys(newState.images).forEach(key => {
                const image = newState.images[key];
                if (image.loaded === undefined && !image.loading) {
                    stateShouldChange = true;
                    this.setImage(image);
                }
            });

            return stateShouldChange ? newState : null;
        });
    }

    private isImageLoaded(url: string): boolean {
        return this.state.images[url] && this.state.images[url].loaded;
    }

    private updateCanvas() {
        if (this.canvasRef) {
            const canvas = this.canvasRef;
            const canvasDimensions = { width: this.props.width, height: this.props.height };
            canvas.height = canvasDimensions.height;
            canvas.width = canvasDimensions.width;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (this.isImageLoaded(this.props.imageUrl)) {
                const mainImage = this.state.images[this.props.imageUrl];
                const imageDimensions = {
                    width: mainImage.image.width,
                    height: mainImage.image.height
                };

                this.bgImageProportion = calculateProportion(canvasDimensions, imageDimensions);
                const imageRect = calculateCenterPosition(canvasDimensions, imageDimensions, this.bgImageProportion);
                imageRect.x += this.state.displacement.x;
                imageRect.y += this.state.displacement.y;

                const scaledImageRect = calculateScaledPosition(canvasDimensions, imageRect, this.state.scale);
                ctx.drawImage(mainImage.image,
                    scaledImageRect.x,
                    scaledImageRect.y,
                    scaledImageRect.width,
                    scaledImageRect.height);

                this.renderElements(scaledImageRect.x, scaledImageRect.y, this.bgImageProportion * this.state.scale);

                /* ctx.strokeStyle = "red";
                ctx.strokeRect(canvasDimensions.width / 2 - 2, canvasDimensions.height / 2 - 2, 4, 4);
                ctx.strokeRect(scaledImageRect.x,
                    scaledImageRect.y,
                    scaledImageRect.width,
                    scaledImageRect.height); */
            }
        }
    }

    private renderElements(bgX, bgY, scale) {
        this.renderedElements = [];
        if (this.canvasRef && this.props.elements) {
            const canvas = this.canvasRef;
            const ctx = canvas.getContext('2d');
            this.props.elements.forEach((element) => {
                if (this.isImageLoaded(element.imageUrl)) {
                    let plottedRect;
                    // let elementIsCircle = false;
                    if (isRectangle(element.plottedShape)) {
                        plottedRect = element.plottedShape as IRectangle;
                    }/*  else if (isCircle(element.plottedShape)) {
                        elementIsCircle = true;
                        let plottedCircle = element.plottedShape as ICircle;
                        plottedRect = {
                            x: plottedCircle.x,
                            y: plottedCircle.y,
                            width: plottedCircle.radius / 2,
                            height: plottedCircle.radius / 2
                        } as IRectangle;
                    } */
                    let width = plottedRect.width;
                    let height = plottedRect.height;
                    if (element.elementScales) {
                        width *= scale;
                        height *= scale;
                    }

                    const elementRect = {
                        x: bgX + plottedRect.x * scale - (width / 2),
                        y: bgY + plottedRect.y * scale - (height / 2),
                        width,
                        height
                    };

                    this.renderedElements.push({ plottedShape: elementRect, element });
                    const image = this.state.images[element.imageUrl].image;

                    ctx.drawImage(image,
                        elementRect.x,
                        elementRect.y,
                        elementRect.width,
                        elementRect.height);

                }
            });
        }
    }

    private onWheel(event: React.WheelEvent<HTMLCanvasElement>) {
        const deltaY = event.deltaY;
        this.setState((prevState) => {
            return { scale: prevState.scale * (1 - deltaY / 1000) };
        });
    }

    private getHoveredElements(mousePosition: IPosition): IElement[] {
        return this.renderedElements
            .filter((value) => {
                return isHoveringPlottedShape(value.plottedShape, mousePosition);
            }).map((value) => ({ ...value.element }));
    }

    private onMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
        const mousePosition: IPosition = { x: event.clientX, y: event.clientY };
        if (this.mouseEvents.isDown) {
            if (this.props.onElementsHover) {
                this.props.onElementsHover(mousePosition, []);
            }
            this.mouseEvents.dragging = true;
            const diffX = mousePosition.x - this.mouseEvents.previousPos.x;
            const diffY = mousePosition.y - this.mouseEvents.previousPos.y;

            if (this.mouseEvents.draggedElements && this.props.onElementsDragged) {
                this.mouseEvents.draggedElements = this.mouseEvents.draggedElements.map((element) => {
                    return {
                        ...element,
                        plottedShape: {
                            ...element.plottedShape,
                            x: element.plottedShape.x + diffX / (this.bgImageProportion * this.state.scale),
                            y: element.plottedShape.y + diffY / (this.bgImageProportion * this.state.scale)
                        }
                    };
                });
                this.props.onElementsDragged(mousePosition, this.mouseEvents.draggedElements);
            } else {
                this.setState((prevState) => {
                    return {
                        displacement: {
                            x: prevState.displacement.x + diffX / prevState.scale,
                            y: prevState.displacement.y + diffY / prevState.scale
                        }
                    };
                });
            }
            this.mouseEvents.previousPos = mousePosition;
        } else {
            if (this.props.onElementsHover) {
                const hoveredElements = this.getHoveredElements(mousePosition);
                this.props.onElementsHover(mousePosition, hoveredElements);
            }
        }
    }

    private onMouseUp(event: React.MouseEvent<HTMLCanvasElement>) {
        const mousePosition: IPosition = { x: event.clientX, y: event.clientY };
        if (this.mouseEvents.isDown
            && !this.mouseEvents.dragging
            && this.props.onElementsClick) {
            const hoveredElements = this.getHoveredElements({ x: event.clientX, y: event.clientY });
            this.props.onElementsClick(mousePosition, hoveredElements);
        }
        this.mouseEvents.isDown = false;
        this.mouseEvents.draggedElements = null;
    }

    private onMouseLeave(event: React.MouseEvent<HTMLCanvasElement>) {
        const mousePosition: IPosition = { x: event.clientX, y: event.clientY };
        this.mouseEvents.isDown = false;
        this.mouseEvents.draggedElements = null;
        if (this.props.onElementsHover) {
            this.props.onElementsHover(mousePosition, []);
        }
    }

    private onMouseDown(event: React.MouseEvent<HTMLCanvasElement>) {
        this.mouseEvents.isDown = true;
        this.mouseEvents.previousPos = { x: event.clientX, y: event.clientY };
        this.mouseEvents.dragging = false;
        if (!this.props.onElementsDragged) return;
        const hoveredElements = this.getHoveredElements({ x: event.clientX, y: event.clientY });
        if (hoveredElements.length) {
            this.mouseEvents.draggedElements = hoveredElements;
        }
    }

    private setCanvasRef(ref: HTMLCanvasElement) {
        this.canvasRef = ref;
    }
}