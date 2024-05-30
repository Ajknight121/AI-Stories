import { PagePeek } from "./components/PagePeek";

export function ComicView({ pages }: { pages: IPage[] }) {


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
    </div>
  );
}
