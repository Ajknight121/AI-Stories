import { useContext, useEffect, useRef } from "react";
import { SiteContext } from "./siteContext";

const getPixelRatio = (context) => {
  const backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;

  return (window.devicePixelRatio || 1) / backingStore;
};

// AI standard image is 1216 X 832 px

export const DrawingBoard = ({isHidden}:{isHidden: boolean}) => {
  const {cursor} = useContext(SiteContext)
  const {prevCursorX, prevCursorY, currCursorX, currCursorY, mouseDown} = cursor
  const ref = useRef<HTMLCanvasElement>(null);

  const draw = (context, startX:number, startY:number, endX:number, endY:number) => {
    const radius = 10
    context.fillStyle = '#000000'
    context.lineWidth = 2 * radius
    context.beginPath()
    context.arc(startX, startY, radius, 0, 2*Math.PI)
    context.fill()
    context.closePath()
    context.beginPath();
    context.moveTo(startX, startY); // Move to the starting point
    context.lineTo(endX, endY); // Draw a line to the ending point
    context.stroke(); // Stroke the line

    context.beginPath()
    context.arc(endX, endY, radius, 0, 2*Math.PI)
    context.fill()
    context.closePath()
  }

  // const draw = (context, currX, currY) => {
  //   context.fillStyle = '#000000'
  //   context.beginPath()
  //   context.arc(currX, currY, 20, 0, 2*Math.PI)
  //   context.fill()
  // }

  useEffect(() => {
    let canvas;
    let context;
    if (ref.current) {
      canvas = ref.current;
      context = canvas.getContext("2d");
    } else {
      return
    }

    let animationFrameId

    const ratio = getPixelRatio(context);
    const width = parseFloat(getComputedStyle(canvas).getPropertyValue("width"));
    const height = parseFloat(getComputedStyle(canvas).getPropertyValue("height"));

    const parentWidth = canvas.parentElement?.offsetWidth || window.innerWidth;
    const parentHeight = canvas.parentElement?.offsetHeight || window.innerHeight;

    // canvas.width = width * ratio;
    // canvas.height = height * ratio;
    // canvas.width = 1000;
    // canvas.height = 700;
    canvas.width = parentWidth - 20;
    canvas.height = parentHeight - 20;
    canvas.style.width = `${parentWidth-20}px`;
    canvas.style.height = `${parentHeight-20}px`;

    // Calculate the canvas offset
    const rect = canvas.getBoundingClientRect();
    const offsetX = rect.left;
    const offsetY = rect.top;

    // Adjust the drawing position
    const adjustedCurrCursorX = currCursorX - offsetX;
    const adjustedCurrCursorY = currCursorY - offsetY;
    const adjustedPrevCursorX = prevCursorX - offsetX;
    const adjustedPrevCursorY = prevCursorY - offsetY;

    const render = () => {
      if (mouseDown) {
        draw(context, adjustedPrevCursorX, adjustedPrevCursorY, adjustedCurrCursorX, adjustedCurrCursorY)
        animationFrameId = window.requestAnimationFrame(render)
      }
    }
    context.fillStyle = '#FFFFFF'
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    render()
  }, [currCursorX, currCursorY, mouseDown, prevCursorX, prevCursorY]);

  return <canvas ref={ref} className={isHidden ? "hidden" : ""}/>;
};
