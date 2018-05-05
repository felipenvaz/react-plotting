export interface IPosition {
    x: number;
    y: number;
};

export interface IMouseEvents {
    isDown: boolean;
    previousPos: IPosition;
};

export interface IReactPlottingProps {
    width: number;
    height: number;
}

export interface IReactPlottingState {
    image: {
        loaded: boolean;
        image: HTMLImageElement;
        url: string;
    },
    scale: number;
    displacement: IPosition;
}