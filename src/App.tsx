import "./App.css";
import { PagePeek } from "./components/PagePeek";
import { PageFocus } from "./components/PageFocus";
import { useContext } from "react";
import { SiteContext } from "./siteContext";

// import king from "./images/king.jpg"
// const tpage: IPage = {
//   name: "Page Title",
//   prompt: "A viking sits on a large throne",
//   image: king,
//   position: 1,
// }

function App() {
  const { pages, currentPage } = useContext(SiteContext);

  return (
    <div className="page-wrap">
      <div className="page-list">
        Page list
        {pages.map((page, index) => {
          return <PagePeek key={index} page={page} index={index} selected={currentPage == index}/>;
        })}
      </div>
      {pages && <PageFocus page={pages[currentPage]} />}
    </div>
  );
}

export default App;
