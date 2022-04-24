/* eslint-disable react-hooks/exhaustive-deps */
import "assets/css/CreateProject/Outline.css";
import deleteIcon from "assets/images/projectCreate/ico_delete01.svg";
import FileDragAndDrop from "./FileDragAndDrop";
import { useState, useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import { getProjectCategory } from "services/project/projectService";

export default function Outline({
  // name
  projectName,
  emptyProjectName,
  alreadyTakenProjectName,
  onProjectNameChange,

  // cover photo
  coverPhotoUrl,
  onCoverPhotoSelect,
  onCoverPhotoRemove,

  // photo
  photosUrl,
  onPhotosSelect,
  onPhotosRemove,

  // overview
  overview,
  onOverviewChange,

  // category
  projectCategory,
  emptyProjeCtCategory,
  onProjectCategoryChange,

  // tag
  tagList,
  tagLimit,
  onTagEnter,
  onTagRemove,
  // need member
  needMember,
  onNeedMemberChange,
  // role list
  roleList,
  onRoleEnter,
  onRoleRemove,
}) {
  const [projectCategoryList, setProjectCategoryList] = useState([]);
  useEffect(() => {
    getProjectCategory().then((e) => {
      setProjectCategoryList(e.categories);
    });
  }, []);
  return (
    <div className="outlineContainer">
      <div className="OutlineTitle mb-[80px]">OUTLINE</div>
      <div className="mb-6">
        <div className="lable">Project Name</div>
        <DebounceInput
          minLength={1}
          debounceTimeout={300}
          onChange={(e) => onProjectNameChange(e.target.value)}
          type="text"
          className="projectNameInput"
          name="projectNameLable"
          id="projectNameLable"
          value={projectName}
        />
        {emptyProjectName && (
          <div className="validationTag">Unique project name is required</div>
        )}
        {alreadyTakenProjectName && (
          <div className="validationTag">Project name has already taken</div>
        )}
      </div>
      <div className="mb-6">
        <div className="lable">Cover photo (upto 4MB)</div>
        {coverPhotoUrl === "" ? (
          <FileDragAndDrop
            maxFiles={1}
            height="230px"
            onDrop={(e) => onCoverPhotoSelect(e)}
            sizePlaceholder="1300X600"
            maxSize={4000000}
          />
        ) : (
          <div className="relative">
            <img className="coverPreview block" src={coverPhotoUrl} alt="" />
            <img
              alt=""
              src={deleteIcon}
              onClick={onCoverPhotoRemove}
              className="absolute top-2 cp right-0"
            />
          </div>
        )}
      </div>
      <div>
        <div className="lable">photos (upto 4)</div>
        <div className="md:flex flex-wrap mb-6">
          <div className="md:w-[343px]">
            <FileDragAndDrop
              maxFiles={4}
              height="192px"
              onDrop={(e) => onPhotosSelect(e)}
              sizePlaceholder="Total upto 16MB"
            />
          </div>
          <div className="photoPreviewContainer mt-3 md:mt-0 md:w-[209px] md:pl-4 mx-12 md:mx-0 flex md:justify-between flex-wrap">
            {photosUrl.map((i) => (
              <div key={i.url} className="relative m-2 md:m-0">
                <img alt="" className="outlinePhoto md:m-1 block" src={i.url} />
                <img
                  alt=""
                  src={deleteIcon}
                  onClick={() => onPhotosRemove(i.name)}
                  className="absolute top-0 cp right-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="lable">Overview</div>
        <textarea
          value={overview}
          onChange={onOverviewChange}
          className="mb-6"
          name=""
          id=""
          cols="30"
          rows="6"
        ></textarea>
      </div>
      <div className="mb-6">
        <div className="lable">Category</div>
        <select value={projectCategory} onChange={onProjectCategoryChange}>
          <option value={"default"} defaultValue>
            Choose an option
          </option>
          {projectCategoryList.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
        {emptyProjeCtCategory && (
          <div className="validationTag">Project category is required</div>
        )}
      </div>
      <div className="flex flex-wrap mb-6">
        <div className="w-full">
          <div className="lable">Tags(upto 5)</div>
          <input
            className="outlineTags mb-2"
            type="text"
            placeholder="Type and press enter"
            defaultValue={""}
            onKeyUp={(e) => onTagEnter(e)}
          />
          {tagLimit && (
            <div className="validationTag mb-3">Only five tags can save </div>
          )}
        </div>
        {tagList &&
          tagList.length > 0 &&
          tagList.map((role, index) => (
            <div className="px-3 pb-4" key={`rolw-${index}`}>
              <div className="h-8 w-auto boarder rounded bg-gray-100">
                <div className="flex flex-row">
                  <div className="pr-4 pl-2 pt-1 break-all">{role}</div>
                  <div className="border-l border-white px-1">
                    <i
                      onClick={() => onTagRemove(index)}
                      className="fa fa-times-thin fa-2x cursor-pointer"
                      aria-hidden="true"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="mb-6">
        <div className="lable">Are you looking for members?</div>
        <div className="flex -flex-wrap">
          <button
            onClick={() => onNeedMemberChange(true)}
            className="h-10 rounded w-36 border border-[#CCCCCC] cursor-pointer	"
          >
            YES
          </button>
          <button
            onClick={() => onNeedMemberChange(false)}
            className="h-10 rounded w-36 border border-[#CCCCCC] ml-2 cursor-pointer	"
          >
            NO
          </button>
        </div>
      </div>
      {needMember && (
        <div>
          <div className="flex flex-wrap mb-6">
            <div className="w-full">
              What kind of role do you want people to participate in?
              <input
                className="outlineRollTags mb-2"
                type="text"
                placeholder="Type and press enter"
                defaultValue={""}
                onKeyUp={(e) => onRoleEnter(e)}
              />
            </div>
            {roleList &&
              roleList.length > 0 &&
              roleList.map((role, index) => (
                <div className="px-3 pb-4" key={`rolw-${index}`}>
                  <div className="h-8 w-auto boarder rounded bg-gray-100">
                    <div className="flex flex-row">
                      <div className="pr-4 pl-2 pt-1 break-all">{role}</div>
                      <div className="border-l border-white px-1">
                        <i
                          onClick={() => onRoleRemove(index)}
                          className="fa fa-times-thin fa-2x cursor-pointer"
                          aria-hidden="true"
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
