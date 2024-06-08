import { createRef, useContext, useEffect, useRef, useState } from "react";
import { IPage } from "../types";
import { DrawingBoard } from "../Drawing";
import { SiteContext } from "../siteContext";
import CanvasDraw from "react-canvas-draw";

export const PageFocus = ({ page }: { page: IPage }) => {
  const { name, prompt, position, image, useDrawing } = page;
  const [prompting, setPrompting] = useState(prompt);
  const [selected, setSelected] = useState(useDrawing ? 2 : 1);
  const { cursor, postPrompt, pages, currentPage, setCurrentPage, updatePage } = useContext(SiteContext);
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
    setSelected(useDrawing ? 2 : 1)
  }, [prompt, useDrawing])

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

  const canvasRef = useRef<CanvasDraw>(null);

  const handleSave = () => {
    if (canvasRef.current) {
      const update = {...page, drawing: canvasRef.current.getDataURL()}
      updatePage(update, currentPage)
    }
  }

  const handleMode = (mode: number) => {
    if (mode == 1) {
      const update = {...page, useDrawing: false}
      updatePage(update, currentPage)
      setSelected(mode)
    }
    if (mode == 2) {
      const update = {...page, useDrawing: true}
      updatePage(update, currentPage)
      setSelected(mode)
    }
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
          <button onClick={() => {
            handleSave()
            // if (canvasRef.current) {
            //   localStorage.setItem("savedDrawing", canvasRef.current.getSaveData())
            // }
          }}>
            SAVE CANVAS
          </button>
          <div>
            Values:{currCursorX ? `${currCursorX}X + ${currCursorY}Y` : "NULL"}
          </div>
          <button
            className={`mode-button ${selected == 1 ? "selected" : ""}`}
            onClick={() => handleMode(1)}
          >
            Propmt AI
          </button>
          <button
            className={`mode-button ${selected == 2 ? "selected" : ""}`}
            onClick={() => handleMode(2)}
          >
            Draw Image
          </button>
        </div>
        <div className="canvas">
          <div className={`ai-img ${selected != 2 ? "" : "hidden"} `}>
            <img src={image} className={selected !=1 ? "hidden" : ""} />
          </div>
          {/* <DrawingBoard isHidden={selected != 2}/> */}
          <CanvasDraw ref={canvasRef} className="react-canvas"
            hideGrid={false}
            lazyRadius={0}
            canvasHeight={832}
            canvasWidth={1216}
            />
        </div>
      </div>
    </div>
  );
};
// AI standard image is 1216 X 832 px