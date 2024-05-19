import { createContext, useEffect, useState } from "react";

export type SiteContext = {
  cursor: {prevCursorX: number, prevCursorY: number, currCursorX: number, currCursorY: number}
}

export const SiteContext = createContext({
  currCursorX: 0,
    currCursorY: 0,
    prevCursorX: 0,
    prevCursorY: 0,
});

export default function SiteContextProvider( {children}: { children: React.ReactNode } ) {
  //Cursor
  const [cursor, setCursor] = useState({
    currCursorX: 0,
    currCursorY: 0,
    prevCursorX: 0,
    prevCursorY: 0,
  })
  useEffect(() => {
    const dispatchMousemove = (e:MouseEvent) => {
      console.log("mousemove", cursor)
      setCursor(prev => {
        return {
        prevCursorX: prev.currCursorX,
        prevCursorY: prev.currCursorY,
        currCursorX: e.clientX,
        currCursorY: e.clientY
    }})
    }
    document.addEventListener("mousemove", dispatchMousemove);
    
    return () => {
      document.removeEventListener("mousemove", dispatchMousemove);
    };
  }, [cursor]) //TODO maybe make dependancy what mode the user is in
  return (
    <SiteContext.Provider value={cursor}>
      {children}
    </SiteContext.Provider>
  )
}