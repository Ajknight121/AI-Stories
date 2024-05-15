/* eslint-disable react/prop-types */

import { useState } from "react";

export const PageFocus = ({ page }) => {
  let { title, prompt, order, image } = page;
  let [prompting, setPrompting] = useState("");
  let [selected, setSelected] = useState(1);
  return (
    <div className="page-focus">
      <div className="title">{title}</div>
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
          <img src={image} width={"100%"} />
        </div>
      </div>
    </div>
  );
};
