/* eslint-disable react/prop-types */


export const PageFocus = ({page}) => {
  let {title, prompt, order, image} = page
  return (
    <div className="page-focus">
      <div className="title">{title}</div>
      <input type="text" className="prompt">Enter prompt here</input>
      <div className="page">
        <div className="mode">Use Prompt or draw image</div>
        <div className="canvas">
          <img src={image} width={"100%"} />
        </div>
      </div>
    </div>
  );
};
