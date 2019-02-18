export interface IPosition {
    x: number;
    y: number;
}

export interface IContainer {
    height: number;
    width: number;
}

export interface IPlottedShape extends IPosition {

}

export interface IRectangle extends IContainer, IPlottedShape {
}

export interface ICircle extends IPlottedShape {
    radius: number;
}