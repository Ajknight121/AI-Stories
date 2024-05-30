import { useContext } from "react";
import { PagePeek } from "./components/PagePeek";
import { SiteContext } from "./siteContext";

export function ComicView({ pages }: { pages: IPage[] }) {
  const {addPage} = useContext(SiteContext)

  return (
    <div className="comic">
      {pages.map((page, index) => {
            return (
              <PagePeek
                key={index}
                page={page}
                index={index}
                selected={false}
              />
            );
          })}
          <div className="add-page" onClick={() => addPage()}>
            Add page
          </div>
    </div>
  );
}
