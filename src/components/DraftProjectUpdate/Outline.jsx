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
    <div className="text-[white]">
      {/* name */}
      <div className="mb-6">
        <div className="label">Project Name</div>
        <div className="label-grey">Your Project name</div>
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

      {/* photo */}
      <div>
        <div className="label">Picture</div>
        <div className="label-grey">
          Add image up to 4 to showcase your project
        </div>
        <div className="md:flex flex-wrap mb-6">
          <div className="md:w-[343px]">
            <FileDragAndDrop
              maxFiles={4}
              height="192px"
              onDrop={(e) => onPhotosSelect(e, photosUrl)}
              sizePlaceholder="Total upto 16MB"
              disabled={photosUrl.length > 3 ? true : false}
            />
          </div>
          <div className="photoPreviewContainer mt-3 md:mt-0 md:w-[209px] md:pl-4 mx-12 md:mx-0 flex md:justify-between flex-wrap">
            {photosUrl.map((i) => (
              <div key={i.path} className="relative m-2 md:m-0">
                <img
                  alt=""
                  className="outlinePhoto md:m-1 block"
                  src={i.path}
                />
                <img
                  alt=""
                  src={deleteIcon}
                  onClick={() => onPhotosRemove(i)}
                  className="absolute top-0 cp right-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* cover */}
      <div className="mb-6">
        <div className="label">Cover Photo</div>
        <div className="label-grey">Add your Cover for project profile</div>
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
            <img
              className="coverPreview block"
              src={coverPhotoUrl.path}
              alt=""
            />
            <img
              alt=""
              src={deleteIcon}
              onClick={onCoverPhotoRemove}
              className="absolute top-2 cp right-0"
            />
          </div>
        )}
      </div>

      {/* overview */}
      <div>
        <div className="label">Description</div>
        <div className="label-grey">
          Tell your audience what’s your project about, so they can easily
          understand the project.
        </div>
        <textarea
          value={overview}
          onChange={onOverviewChange}
          className="mb-6"
          name=""
          id=""
          cols="30"
          rows="6"
          placeholder="Add description"
        ></textarea>
      </div>

      {/* category */}
      <div className="mb-6">
        <div className="label">Category</div>
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

      {/* tags */}
      <div className="flex flex-wrap mb-6">
        <div className="w-full">
          <div className="label">Tags</div>
          <div className="label-grey">Add tags on your project</div>
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
            <div className="px-3 pb-4 " key={`rolw-${index}`}>
              <div className="h-8 w-auto border border-[#232032] rounded bg-[#232032] ">
                <div className="flex flex-row items-center">
                  <div className="pr-1 pl-2 pt-1 label-grey  break-all">
                    {role}
                  </div>
                  <div className="px-2 pt-0">
                    <i
                      onClick={() => onTagRemove(index)}
                      className="fa fa-times-thin  cursor-pointer"
                      aria-hidden="true"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
