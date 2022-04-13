/* eslint-disable react-hooks/exhaustive-deps */
import "assets/css/CreateProject/Outline.css";
import deleteIcon from "assets/images/projectCreate/ico_delete01.svg";
import FileDragAndDrop from "./FileDragAndDrop";
import { useState, useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import { getProjectCategory } from "services/project/projectService";

export default function Outline({
  emptyProjectName,
  alreadyTakenProjectName,
  onProjectNameChange,
  onCoverDrop,
  closeCoverPhotoPreview,
  closePhotoPreview,
  onPhotoDrop,
  emptyProjeCtCategory,
  onProjectCategoryChange,
  overviewOnChange,
  onChangeTagList,
  onNeedMemberChange,
}) {
  const [projectName, SetProjectName] = useState("");
  let [coverPhoto, setCoverPhoto] = useState([]);
  let [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  const [photosUrl, setPhotosUrl] = useState([]);
  const [projectCategoryList, setProjectCategoryList] = useState([]);
  const [category, setCategory] = useState({});
  const [overviwe, setOverview] = useState("");
  const [tagList, setTagList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [tagsLimit, setTagsLimit] = useState(false);
  const [lookingForMember, setLookingForMember] = useState(false);
  function onOverviewChnage(e) {
    setOverview(e.target.value);
    overviewOnChange(e.target.value);
  }
  async function changeProjectName(value) {
    SetProjectName(value);
    onProjectNameChange(value);
  }
  async function selectCategory(e) {
    setCategory(e.target.value);
    onProjectCategoryChange(e.target.value);
  }
  async function coverPhotoSelect(params) {
    if (params.length === 1) {
      setCoverPhoto(params);
      onCoverDrop(params);
    }
  }
  async function photoSelect(params) {
    let totalSize = 0;
    params.forEach((element) => {
      totalSize = totalSize + element.size;
    });
    if (totalSize > 16000000) {
      alert("Size Exceed");
    } else {
      let objectUrl = [];
      params.forEach((element) => {
        objectUrl.push({
          name: element.name,
          url: URL.createObjectURL(element),
        });
      });
      setPhotosUrl(objectUrl);
      onPhotoDrop(params);
    }
  }
  function closeCoverPhoto() {
    setCoverPhoto([]);
    setCoverPhotoUrl("");
  }
  function closePhoto(i) {
    setPhotosUrl(photosUrl.filter((x) => x.name !== i));
    closePhotoPreview(i);
  }
  function handleRoleChange(type, event) {
    if (type === "tag") {
      const value = event.target.value;
      if (event.code === "Enter" && value.length > 0) {
        if (tagList.length > 4) {
          setTagsLimit(true);
        } else {
          setTagList([...tagList, value]);
          onChangeTagList("tag", [...tagList, value]);
          event.target.value = "";
        }
      }
    } else if (type === "role") {
      const value = event.target.value;
      if (event.code === "Enter" && value.length > 0) {
        setRoleList([...roleList, value]);
        onChangeTagList("role", [...roleList, value]);
        event.target.value = "";
      }
    }
  }
  const handleRemoveRole = (type, index) => {
    if (type === "tag") {
      if (index >= 0) {
        const newRoleList = [...tagList];
        newRoleList.splice(index, 1);
        setTagList(newRoleList);
        onChangeTagList("tag", newRoleList);
        setTagsLimit(false);
      }
    } else if (type === "role") {
      if (index >= 0) {
        const newRoleList = [...roleList];
        newRoleList.splice(index, 1);
        setRoleList(newRoleList);
        onChangeTagList("role", newRoleList);
      }
    }
  };
  function needMemberChange(e) {
    if (e) {
      setLookingForMember(true);
      onNeedMemberChange(true);
    } else {
      setRoleList([]);
      onChangeTagList("role", []);
      setLookingForMember(false);
      onNeedMemberChange(false);
    }
  }
  useEffect(() => {
    getProjectCategory().then((e) => {
      setProjectCategoryList(e.categories);
    });
  }, []);
  useEffect(() => {
    let objectUrl = "";
    if (coverPhoto.length === 1) {
      objectUrl = URL.createObjectURL(coverPhoto[0]);
      setCoverPhotoUrl(objectUrl);
    }
    return () => URL.revokeObjectURL(objectUrl);
  }, [coverPhoto]);
  return (
    <div className="outlineContainer">
      <div className="OutlineTitle mb-[80px]">OUTLINE</div>

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
            onDrop={(e) => coverPhotoSelect(e)}
            sizePlaceholder="1300X600"
            maxSize={4000000}
          />
        ) : (
          <div className="relative">
            <img className="coverPreview block" src={coverPhotoUrl} alt="" />
            <img
              alt=""
              src={deleteIcon}
              onClick={closeCoverPhoto}
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
              onDrop={(e) => photoSelect(e)}
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
                  onClick={() => closePhoto(i.name)}
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
          value={overviwe}
          onChange={onOverviewChnage}
          className="mb-6"
          name=""
          id=""
          cols="30"
          rows="6"
        ></textarea>
      </div>
      <div className="mb-6">
        <div className="lable">Category</div>
        <select value={category} onChange={selectCategory}>
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
            onKeyUp={(e) => handleRoleChange("tag", e)}
          />
          {tagsLimit && (
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
                      onClick={() => handleRemoveRole("tag", index)}
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
            onClick={() => needMemberChange(true)}
            className="h-10 rounded w-36 border border-[#CCCCCC] cursor-pointer	"
          >
            YES
          </button>
          <button
            onClick={() => needMemberChange(false)}
            className="h-10 rounded w-36 border border-[#CCCCCC] ml-2 cursor-pointer	"
          >
            NO
          </button>
        </div>
      </div>

      {lookingForMember && (
        <div>
          <div className="flex flex-wrap mb-6">
            <div className="w-full">
              What kind of role do you want people to participate in?
              <input
                className="outlineRollTags mb-2"
                type="text"
                placeholder="Type and press enter"
                defaultValue={""}
                onKeyUp={(e) => handleRoleChange("role", e)}
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
                          onClick={() => handleRemoveRole("role", index)}
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
