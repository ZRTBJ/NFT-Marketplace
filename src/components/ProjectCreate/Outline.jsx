/* eslint-disable react-hooks/exhaustive-deps */
import "assets/css/CreateProject/Outline.css";
import FileDragAndDrop from "./FileDragAndDrop";
import { useState, useEffect } from "react";
import { DebounceInput } from "react-debounce-input";

export default function Outline({
  emptyProjectName,
  alreadyTakenProjectName,
  onProjectNameChange,
  onCoverDrop,
}) {
  const [projectName, SetProjectName] = useState("");
  let [coverPhoto, setCoverPhoto] = useState([]);
  let [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  async function changeProjectName(value) {
    SetProjectName(value);
    onProjectNameChange(value);
  }
  async function coverPhotoSelect(params) {
    if (params.length === 1) {
      setCoverPhoto(params);
      onCoverDrop(params);
    }
  }
  useEffect(() => {
    let objectUrl = "";
    if (coverPhoto.length === 1) {
      objectUrl = URL.createObjectURL(coverPhoto[0]);
      setCoverPhotoUrl(objectUrl);
    }
    return () => URL.revokeObjectURL(objectUrl);
  }, [coverPhoto]);

  return (
    <form>
      <div className="outlineContainer">
        <div className="OutlineTitle">OUTLINE</div>
        <div className="mb-6">
          <div className="lable">Project Name</div>
          <DebounceInput
            minLength={1}
            debounceTimeout={300}
            onChange={(e) => changeProjectName(e.target.value)}
            type="text"
            className="projectNameInput"
            name="projectNameLable"
            id="projectNameLable"
            value={projectName}
          />
          {/* <input
            type="text"
            className="projectNameInput"
            name="projectNameLable"
            id="projectNameLable"
            value={projectName}
            onChange={(e) => changeProjectName(e.target.value)}
          /> */}
          {emptyProjectName && (
            <div className="validationTag">Unique project name is required</div>
          )}
          {alreadyTakenProjectName && (
            <div className="validationTag">Project name has already taken</div>
          )}
        </div>
        <div className="mb-6">
          <div className="lable">Cover photo</div>
          {coverPhotoUrl === "" ? (
            <FileDragAndDrop
              maxFiles={2}
              height="230px"
              onDrop={(e) => coverPhotoSelect(e)}
            />
          ) : (
            <img src={coverPhotoUrl} alt="" />
          )}
        </div>
        {/* {typeof coverPhoto === "arra" ? (
         
        ) : (
          <div>
            <button onClick={() => closeCoverPhotoReview()}>Close</button>
           
          </div>
        )} */}
        <div>
          <div className="lable">photos (upto 4)</div>
          <div className="grid grid-flow-col mb-6">
            <FileDragAndDrop
              maxFiles={4}
              height="192px"
              className="col-span-4"
            />
            <div className="photoPreviewContainer col-span-1"></div>
          </div>
        </div>
        <div>
          <div className="lable">Overview</div>
          <textarea
            className="mb-6"
            name=""
            id=""
            cols="30"
            rows="6"
          ></textarea>
        </div>
        <div>
          <div className="lable">Category</div>
          <select className="mb-6" name="cars" id="cars">
            <option disabled>Select Category</option>
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="opel">Opel</option>
            <option value="audi">Audi</option>
          </select>
        </div>
        <div>
          <div className="lable">Tags</div>
          <input className="outlineTags" type="text" />
          <div className="h-8 boarder w-fit rounded bg-gray-100 mb-6">
            <div className="flex flex-row">
              <div className="pr-4 pl-2 pt-1">ROLL</div>
              <div className="border-l border-white px-1">
                <i className="fa fa-times-thin fa-2x" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="lable">Are you looking for members?</div>
          <div className="flex -flex-wrap">
            <button className="h-10 rounded w-36 border border-[#CCCCCC] cursor-pointer	">
              YES
            </button>
            <button className="h-10 rounded w-36 border border-[#CCCCCC] ml-2 cursor-pointer	">
              NO
            </button>
          </div>
        </div>
        <div>
          <div className="lable">
            What kind of role do you want people to participate in?
            <input type="text" name="" id="" className="outlineRollTags" />
            <div className="h-8 boarder w-fit rounded bg-gray-100 mb-6">
              <div className="flex flex-row">
                <div className="pr-4 pl-2 pt-1">ROLL</div>
                <div className="border-l border-white px-1">
                  <i className="fa fa-times-thin fa-2x" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
