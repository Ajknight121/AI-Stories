import { useContext, useEffect, useState } from "react";
import { IPage } from "../types";
import { DrawingBoard } from "../Drawing";
import { SiteContext } from "../siteContext";

export const PageFocus = ({ page }: { page: IPage }) => {
  const { name, prompt, position, image } = page;
  const [prompting, setPrompting] = useState(prompt);
  const [selected, setSelected] = useState(1);
  const { cursor, postPrompt, pages, currentPage, setCurrentPage } = useContext(SiteContext);
  const { currCursorX, currCursorY } = cursor;
  //TODO save canvas using .toDataURL()
  //TODO load canvas back to screen: https://stackoverflow.com/questions/4773966/drawing-an-image-from-a-data-url-to-a-canvas

  const handlePromptSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (prompting.length < 3 ) {
      console.log("Prompt too short")
      return
    }
    console.log(prompting)
    postPrompt(prompting)
  };

  useEffect(() => {
    setPrompting(prompt)
  }, [prompt])

  const handleBack = () => {
    if (page == pages[0]) {
      return;
    }
    setCurrentPage(currentPage - 1)
  }
  const handleNext = () => {
    if (page == pages[pages.length - 1]) {
      return;
    }
    setCurrentPage(currentPage + 1)
  }

  return (
    <div className="page-focus">
      <div className="page-focus-header">
        <div className="nav">
          <button onClick={() => handleBack()}>← Prev page</button>
          <div>page: {currentPage + 1}</div>
          <button onClick={() => handleNext()}>Next page →</button>
        </div>
        {/* <div className="title">{name}</div> */}
        <form onSubmit={handlePromptSubmit}>
          <input
            type="text"
            value={prompting}
            onChange={(e) => setPrompting(e.target.value)}
            placeholder="Enter prompt here"
          />
          <input className="text-button" type="submit" />
        </form>
      </div>
      <div className="page">
        <div className="mode">
          <div>
            Values:{currCursorX ? `${currCursorX}X + ${currCursorY}Y` : "NULL"}
          </div>
          <button
            className={`mode-button ${selected == 1 ? "selected" : ""}`}
            onClick={() => setSelected(1)}
          >
            Propmt AI
          </button>
          <button
            className={`mode-button ${selected == 2 ? "selected" : ""}`}
            onClick={() => setSelected(2)}
          >
            Draw Image
          </button>
        </div>
        <div className="canvas">
          <DrawingBoard isHidden={selected != 2}/>
          <img src={image} className={selected !=1 ? "hidden" : ""} />
        </div>
      </div>
    </div>
  );
};
