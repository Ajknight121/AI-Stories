import { IPage } from "../types"
import { useContext } from "react"
import { SiteContext } from "../siteContext"
export const PagePeek = ({page, index, selected}: {page: IPage, index:number, selected:boolean}) => {
  const {name,prompt, image, position} = page
  const {setCurrentPage} = useContext(SiteContext)

  const handleSelect = () => {
    console.log("Swap to page")
    setCurrentPage(index)

  }

  return (
    <div className={`peek ${selected ? "selected" : ""}`} onClick={handleSelect}>
      <div className='peek-info'>
        {index + 1}: {name} - {prompt}
      </div>
      <img src={image} width={"100%"}/>
    </div>
  )
}
