import { createRef, useContext, useEffect, useRef, useState } from "react";
import { IPage } from "../types";
import { DrawingBoard } from "../Drawing";
import { SiteContext } from "../siteContext";
import CanvasDraw from "react-canvas-draw";

export const PageFocus = ({ page }: { page: IPage }) => {
  if (!page) {
    return <div></div>
  }
  const { name, prompt, position, image, drawing, useDrawing, drawJSON } = page;
  const [prompting, setPrompting] = useState(prompt);
  const [selectedMode, setSelectedMode] = useState(useDrawing ? 2 : 1);
  const { cursor, setFocusView, postPrompt, pages, currentPage, setCurrentPage, updatePage, deletePage } = useContext(SiteContext);
  const { currCursorX, currCursorY } = cursor;
  //TODO save canvas using .toDataURL()
  //TODO load canvas back to screen: https://stackoverflow.com/questions/4773966/drawing-an-image-from-a-data-url-to-a-canvas

  const canvasWidth = 1216
  const canvasHeight = 832
  const empty = JSON.stringify({"lines":[],"width":canvasWidth,"height":canvasHeight})

  const handleText = (text:string) => {
    setPrompting(text)
    updatePage({...page, prompt: text}, currentPage)
  }

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
    console.log("EFFECTING canvas")
    setPrompting(prompt)
    setSelectedMode(useDrawing ? 2 : 1)
    if (canvasRef.current) {
      console.log("loading canvas")
      canvasRef.current.clear()
      if (drawJSON == "") {
        canvasRef.current.loadSaveData(empty, true);
      } else {
        canvasRef.current.loadSaveData(drawJSON, true);
      }
    }
  }, [drawJSON, empty, prompt, useDrawing])

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
      console.log(canvasRef.current.getDataURL())
      const update = {...page,name:"Drawn", drawing: canvasRef.current.getDataURL(), drawJSON: canvasRef.current.getSaveData()}
      updatePage(update, currentPage)
      console.log(pages[1])
    }
  }

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear()
      const update = {...page, drawing: canvasRef.current.getDataURL(), drawJSON: ""}
      updatePage(update, currentPage)
      canvasRef.current.clear()
    }
  }

  const handleMode = (mode: number) => {
    if (mode == 1) {
      const update = {...page, useDrawing: false}
      updatePage(update, currentPage)
      setSelectedMode(mode)
    }
    if (mode == 2) {
      const update = {...page, useDrawing: true}
      updatePage(update, currentPage)
      setSelectedMode(mode)
    }
  }

  const handlePageDelete = () => {
    deletePage(currentPage)
  }

  

  return (
    <div className="page-focus">
      <div className="page-focus-header">
        <div className="nav">
          <button onClick={() => handleBack()}>← Prev page</button>
          <div className="column">
            <b>page: {currentPage + 1}</b>
            <button className="header-button" onClick={() => setFocusView(false)}>View all pages</button>
          </div>
          <button onClick={() => handleNext()}>Next page →</button>
        </div>
        {/* <div className="title">{name}</div> */}
        <input
          type="text"
          value={prompting}
          onChange={(e) => handleText(e.target.value)}
          placeholder="What happened?"
          className="story-input"
        />
      </div>
      <div className="page">
        <div className="mode">
          {selectedMode == 1 ? (
            <form onSubmit={handlePromptSubmit}>
            <input className="ai-submit" type="submit" value={"Ask AI to draw your image"}/>
          </form>
          ) : (
            <div className="canvas-buttons">
            <button className="canvas-clear" onClick={() => handleClear()}>
              CLEAR CANVAS
            </button>
            <button className="canvas-save" onClick={() => handleSave() }>
              SAVE CANVAS
            </button>
          </div>
          )}

          <button className="delete-page" onClick={() => handlePageDelete()}>
            Delete this page
          </button>
          
          
          {/* <div>
            Values:{currCursorX ? `${currCursorX}X + ${currCursorY}Y` : "NULL"}
          </div> */}
          <div className="mode-selectors">
            <div
              className={`mode-button ${selectedMode == 1 ? "selected" : ""}`}
              onClick={() => handleMode(1)}
            >
              Propmt AI
            </div>
            <div
              className={`mode-button ${selectedMode == 2 ? "selected" : ""}`}
              onClick={() => handleMode(2)}
            >
              Draw Image
            </div>
          </div>
        </div>
        <div className="canvas">
          <div className={`ai-img ${selectedMode != 2 ? "" : "hidden"} `}>
            <img src={image} className={selectedMode !=1 ? "hidden" : ""} />
          </div>
          {/* <DrawingBoard isHidden={selected != 2}/> */}
          <CanvasDraw ref={canvasRef} className="react-canvas"
            // enablePanAndZoom={true}
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