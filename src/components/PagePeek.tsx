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
  const { name, prompt, image, position } = page;
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
        <img src={image} />
        <div className="peek-info">{prompt}</div>
      </div>
    </div>
  );
};
