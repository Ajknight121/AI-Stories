import CanvasDraw from "react-canvas-draw";

// this is required for Typescript to recognise the CanvasDraw package
declare module 'react-canvas-draw'{
    canvasDraw: CanvasDraw | null;
}