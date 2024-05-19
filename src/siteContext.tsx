import { createContext, useEffect, useState } from "react";

export type SiteContext = {
  cursor: {
    prevCursorX: number;
    prevCursorY: number;
    currCursorX: number;
    currCursorY: number;
    mouseDown: boolean;
  };
};

export const SiteContext = createContext({
  currCursorX: 0,
  currCursorY: 0,
  prevCursorX: 0,
  prevCursorY: 0,
  mouseDown: false,
});

export default function SiteContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //Cursor
  const [cursor, setCursor] = useState({
    currCursorX: 0,
    currCursorY: 0,
    prevCursorX: 0,
    prevCursorY: 0,
    mouseDown: false,
  });
  useEffect(() => {
    const dispatchMousemove = (e: MouseEvent) => {
      console.log("mousemove", cursor);
      setCursor((prev) => {
        return {
          ...prev,
          prevCursorX: prev.currCursorX,
          prevCursorY: prev.currCursorY,
          currCursorX: e.clientX,
          currCursorY: e.clientY,
        };
      });
    };
    document.addEventListener("mousemove", dispatchMousemove);

    const dispatchMouseChange = (e:MouseEvent) => {
      console.log("mousechange", cursor.mouseDown)
      setCursor((prev) => {
        return {
          ...prev,
          mouseDown: (!prev.mouseDown)
        }
      })
    }
    document.addEventListener("mousedown", dispatchMouseChange)
    document.addEventListener("mouseup", dispatchMouseChange)
    return () => {
      document.removeEventListener("mousemove", dispatchMousemove);
      document.removeEventListener("mousedown", dispatchMouseChange)
      document.removeEventListener("mouseup", dispatchMouseChange)
    };
  }, [cursor]); //TODO maybe make dependancy what mode the user is in
  return <SiteContext.Provider value={cursor}>{children}</SiteContext.Provider>;
}
