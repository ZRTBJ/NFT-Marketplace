import "assets/css/CreateProject/Outline.css";
import FileDragAndDrop from "./FileDragAndDrop";
import { useState, useEffect } from "react";

export default function Outline({
  coverPhotoProps,
  closeCoverPhotoReview,
  onCoverDrop,
}) {
  const [cover] = useState(coverPhotoProps);
  useEffect(() => {}, [cover]);

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
        {typeof cover === "string" ? (
          <div className="mb-6">
            <div className="lable">Cover photo</div>
            <FileDragAndDrop
              maxFiles={1}
              height="230px"
              onDrop={(e) => onCoverDrop(e)}
            />
          </div>
        ) : (
          <button onClick={() => closeCoverPhotoReview}>Close</button>
        )}
        <div>
          <div className="lable">photos (upto 4)</div>
          <div className="grid grid-flow-col ">
            <FileDragAndDrop
              maxFiles={4}
              height="192px"
              className="col-span-4"
            />
            <div className="photoPreviewContainer col-span-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
