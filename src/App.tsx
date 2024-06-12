import "./App.css";
import { PagePeek } from "./components/PagePeek";
import { PageFocus } from "./components/PageFocus";
import { useContext, useEffect, useState } from "react";
import { SiteContext } from "./siteContext";
import { ComicView } from "./ComicView";


function App() {
  const { pages, currentBook, currentPage, addPage, focusView, setFocusView, updateBook, setCurrentPage } = useContext(SiteContext);
  const [temptitle, setTempTitle] = useState(currentBook.title)
  const [editTitle, setEditTitle] = useState(false)

  const handleEdit = () => {
    if (editTitle) {
      updateBook({...currentBook, title: temptitle})
      // setCurrentBook( (prev) => ({...prev, title: temptitle}))
      setEditTitle(false)
    } else {
      setEditTitle(true)
    }
  }

  return (
    <div className="page-wrap">
      {focusView ? (
        <div className="page-list">
          <b>Page list</b>
          {pages.map((page, index) => {
            return (
              <PagePeek
                key={index}
                page={page}
                index={index}
                selected={currentPage == index}
              />
            );
          })}
          <div className="add-page" onClick={() => addPage()}>
            Add page
          </div>
        </div>
      ) : ""}

      <div className="editor-wrapper">
        <div className="title">
          <input className={`title-name ${editTitle ? "" : "hidden"}`} value={temptitle} onChange={(e) => setTempTitle(e.target.value)}/>
          <div className={`title-set ${editTitle ? "hidden" : ""}`}>{currentBook.title}</div>
          
          <button className="header-button" onClick={() => handleEdit()}>
            {editTitle ? "save title" : "edit title"}
          </button>
          
        </div>
        {focusView && pages ? (
          <PageFocus page={pages[currentPage]} />
        ) : (
          <ComicView pages={pages} />
        )}
        
      </div>
    </div>
  );
}

export default App;
