import "./App.css";
import { PagePeek } from "./components/PagePeek";
import { PageFocus } from "./components/PageFocus";
import { useContext, useEffect, useState } from "react";
import { SiteContext } from "./siteContext";
import { ComicView } from "./ComicView";

function App() {
  const {
    pages,
    currentBook,
    currentPage,
    addPage,
    focusView,
    updateBook,
    awaiting,
    awaitMsg,
  } = useContext(SiteContext);
  const [temptitle, setTempTitle] = useState(currentBook.title);
  const [editTitle, setEditTitle] = useState(false);

  // Use effect to update local state with loaded states
  useEffect(() => {
    setTempTitle(currentBook.title)
  }, [currentBook.title])

  const handleEdit = () => {
    if (editTitle) {
      updateBook({ ...currentBook, title: temptitle });
      // setCurrentBook( (prev) => ({...prev, title: temptitle}))
      setEditTitle(false);
    } else {
      setEditTitle(true);
    }
  };

  return (
    <div className="page-wrap">
      {awaiting ? (
        <div className="overlay">
          <h1>{awaitMsg}</h1>
        </div>
      ) : (
        ""
      )}
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
      ) : (
        ""
      )}

      <div className="editor-wrapper">
        <div className="title">
          <input
            className={`title-edit ${editTitle ? "" : "hidden"}`}
            value={temptitle}
            onChange={(e) => setTempTitle(e.target.value)}
          />
          <div className={`title-set ${editTitle ? "hidden" : ""}`}>
            {currentBook.title}
          </div>

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
