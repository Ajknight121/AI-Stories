import { useEffect, useRef } from "react";

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

export const DrawBoard = () => {
  const ref = useRef();

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext("2d");

    const ratio = getPixelRatio(context);
    const width = getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    const height = getComputedStyle(canvas)
      .getPropertyValue("height")
      .slice(0, -2);

    const parentWidth = canvas.parentElement?.offsetWidth || window.innerWidth;
    const parentHeight = canvas.parentElement?.offsetHeight || window.innerHeight;
    // canvas.width = width * ratio;
    // canvas.height = height * ratio;
    canvas.width = parentWidth;
    canvas.height = parentHeight;
    canvas.style.width = `${parentWidth - 20}px`;
    canvas.style.height = `${parentHeight - 20}px`;
    context.fillStyle = '#FFFFFF'
    context.fillRect(0, 10, context.canvas.width, context.canvas.height)
    context.beginPath();
    context.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2,
      0,
      2 * Math.PI
    );
    context.fill();
  }, []);

  return <canvas ref={ref}/>;
};
