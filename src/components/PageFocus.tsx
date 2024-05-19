import { useContext, useState } from "react";
import { IPage } from "../types";
import { DrawingBoard } from "../Drawing";
import { SiteContext } from "../siteContext";

export const PageFocus = ({page}: {page: IPage}) => {
  const { name, prompt, position, image } = page;
  const [prompting, setPrompting] = useState(prompt);
  const [selected, setSelected] = useState(1);
  const {currCursorX, currCursorY} = useContext(SiteContext)
  //TODO save canvas using .toDataURL()
  //TODO load canvas back to screen: https://stackoverflow.com/questions/4773966/drawing-an-image-from-a-data-url-to-a-canvas
  
  return (
    <div className="page-focus">
      <div className="title">{name}</div>
      <input
        type="text"
        value={prompting}
        onChange={(e) => setPrompting(e.target.value)}
        placeholder="Enter prompt here"
      />
      <div className="page">
        <div className="mode">
          <div>Values:{currCursorX ? `${currCursorX}X + ${currCursorY}Y` : "NULL"}</div>
          <button className={`mode-button ${selected == 1 ? "selected" : ""}`} onClick={() => setSelected(1)}>Propmt AI</button>
          <button className={`mode-button ${selected == 2 ? "selected" : ""}`} onClick={() => setSelected(2)}>Draw Image</button>
        </div>
        <div className="canvas">
          <DrawingBoard />
          {/* <img src={image} width={"100%"} /> */}
        </div>
      </div>
    </div>
  );
};
