import "assets/css/CreateProject/Outline.css";
import FileDragAndDrop from "./FileDragAndDrop";

export default function Outline() {
  return (
    <div>
      <div className="outlineContainer">
        <div className="title">OUTLINE</div>
        <div>
          <div className="lable">Project Name</div>
          <input
            type="text"
            className="projectNameInput"
            name="projectNameLable"
            id="projectNameLable"
          />
        </div>
        <div className="mb-6">
          <div className="lable">Cover photo</div>
          <FileDragAndDrop height="230px" />
        </div>
        <div>
          <div className="lable">photos (upto 4)</div>
          <div className="grid grid-flow-col ">
            <FileDragAndDrop height="192px" className="col-span-4" />
            <div className="photoPreviewContainer col-span-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
