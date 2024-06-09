import { createRef, useContext, useEffect, useRef, useState } from "react";
import { IPage } from "../types";
import { DrawingBoard } from "../Drawing";
import { SiteContext } from "../siteContext";
import CanvasDraw from "react-canvas-draw";

export const PageFocus = ({ page }: { page: IPage }) => {
  const { name, prompt, position, image, drawing, useDrawing, drawJSON } = page;
  const [prompting, setPrompting] = useState(prompt);
  const [selected, setSelected] = useState(useDrawing ? 2 : 1);
  const { cursor, postPrompt, pages, currentPage, setCurrentPage, updatePage } = useContext(SiteContext);
  const { currCursorX, currCursorY } = cursor;
  //TODO save canvas using .toDataURL()
  //TODO load canvas back to screen: https://stackoverflow.com/questions/4773966/drawing-an-image-from-a-data-url-to-a-canvas

  const canvasWidth = 1216
  const canvasHeight = 832
  const empty = JSON.stringify({"lines":[],"width":canvasWidth,"height":canvasHeight})

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
    console.log("EFFECTING")
    setPrompting(prompt)
    setSelected(useDrawing ? 2 : 1)
    if (canvasRef.current) {
      console.log("loading")
      canvasRef.current.clear()
      if (drawJSON == "") {
        canvasRef.current.loadSaveData(empty, true);
      } else {
        canvasRef.current.loadSaveData(drawJSON, true);
      }
      // let test = canvasRef.current.getSaveData()
      // console.log(test)
      console.log(drawJSON)
    }
  }, [drawJSON, drawing, prompt, useDrawing])

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
      console.log("saving")
      const update = {...page, drawing: canvasRef.current.getDataURL(), drawJSON: canvasRef.current.getSaveData()}
      updatePage(update, currentPage)
      console.log(canvasRef.current.getSaveData())
    }
  }

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear()
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
          <button onClick={() => handleClear()}>
            CLEAR CANVAS
          </button>
          <button onClick={() => handleSave() }>
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
            enablePanAndZoom={true}
            clampLinesToDocument={true}
            hideGrid={false}
            lazyRadius={0}
            canvasHeight={canvasHeight}
            canvasWidth={canvasWidth}
            saveData={drawJSON != "" ? drawJSON : empty}
            // loadTimeOffset={3} // requires disabling canvas during playback
            immediateLoading={true}
            />
        </div>
      </div>
    </div>
  );
};
// AI standard image is 1216 X 832 px