import "./App.css";
import { PagePeek } from "./components/PagePeek";
import { PageFocus } from "./components/PageFocus";
import { useContext } from "react";
import { SiteContext } from "./siteContext";
import { ComicView } from "./ComicView";

// import king from "./images/king.jpg"
// const tpage: IPage = {
//   name: "Page Title",
//   prompt: "A viking sits on a large throne",
//   image: king,
//   position: 1,
// }

function App() {
  const { pages, currentBook, currentPage, addPage, focusView, setFocusView } =
    useContext(SiteContext);

  return (
    <div className="page-wrap">
      {focusView ? (
        <div className="page-list">
          Page list
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
        <div className="title" onClick={() => setFocusView(false)}>{currentBook.title}<br/><span>View all</span></div>
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
