/* eslint-disable react/prop-types */
import React from 'react'
import "./peek.css"
export const PagePeek = ({page}) => {
  let {title,prompt, image, order} = page
  return (
    <div className='peek'>
      <img src={image} width={"100%"}/>
      <div className='peek-info'>
        {order}: {title} - {prompt}
      </div>
    </div>
  )
}
