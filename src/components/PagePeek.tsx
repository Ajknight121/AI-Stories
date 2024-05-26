import { IPage } from "../types"
import { useContext } from "react"
import { SiteContext } from "../siteContext"
export const PagePeek = ({page, index}: {page: IPage, index:number}) => {
  const {name,prompt, image, position} = page
  const {setCurrentPage} = useContext(SiteContext)

  const handleSelect = () => {
    console.log("Swap to page")
    setCurrentPage(index)

  }

  return (
    <div className='peek' onClick={handleSelect}>
      <img src={image} width={"100%"}/>
      <div className='peek-info'>
        {index + 1}: {name} - {prompt}
      </div>
    </div>
  )
}
