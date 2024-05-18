import './App.css'
import king from "./images/king.jpg"
import { PagePeek } from './components/PagePeek'
import { PageFocus } from './components/PageFocus'
import { IPage } from './types'

const page: IPage = {
  name: "Page Title",
  prompt: "This is the users image prompt",
  image: king,
  position: 1,
}

function App() {

  return (
    <div className='page-wrap'>
    <div className='page-list'>
      Page list
      <PagePeek page={page}/>
      <PagePeek page={page}/>
      <PagePeek page={page}/>
    </div>
      <PageFocus page={page}/>
    </div>
  )
}

export default App
