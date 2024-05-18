import { useState } from "react";
import { IPage } from "../types";
import { DrawBoard } from "../Drawing";

export const PageFocus = ({page}: {page: IPage}) => {
  const { name, prompt, position, image } = page;
  const [prompting, setPrompting] = useState(prompt);
  const [selected, setSelected] = useState(1);
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
          <button className={`mode-button ${selected == 1 ? "selected" : ""}`} onClick={() => setSelected(1)}>Propmt AI</button>
          <button className={`mode-button ${selected == 2 ? "selected" : ""}`} onClick={() => setSelected(2)}>Draw Image</button>
        </div>
        <div className="canvas">
          <DrawBoard />
          {/* <img src={image} width={"100%"} /> */}
        </div>
      </div>
    </div>
  );
};
