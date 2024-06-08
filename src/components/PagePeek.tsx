import { IPage } from "../types";
import { useContext } from "react";
import { SiteContext } from "../siteContext";
export const PagePeek = ({
  page,
  index,
  selected,
}: {
  page: IPage;
  index: number;
  selected: boolean;
}) => {
  const { name, prompt, image, position, drawing, useDrawing } = page;
  const { setCurrentPage,setFocusView } = useContext(SiteContext);

  const handleSelect = () => {
    console.log("Swap to page");
    setCurrentPage(index);
    setFocusView(true)
  };

  return (
    <div className="peek-wrapper">
      {index + 1}
      <div
        className={`peek ${selected ? "selected" : ""}`}
        onClick={handleSelect}
      >
        <img src={useDrawing ? drawing : image} />
        <div className="peek-info">{prompt}</div>
      </div>
    </div>
  );
};
