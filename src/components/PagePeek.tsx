import "./peek.css"
import { IPage } from "../types"
export const PagePeek = ({page}: {page: IPage}) => {
  const {name,prompt, image, position} = page
  return (
    <div className='peek'>
      <img src={image} width={"100%"}/>
      <div className='peek-info'>
        {position}: {name} - {prompt}
      </div>
    </div>
  )
}
