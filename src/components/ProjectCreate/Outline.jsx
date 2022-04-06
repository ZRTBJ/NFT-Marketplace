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
}) {
  const [projectName, SetProjectName] = useState("");
  let [coverPhoto, setCoverPhoto] = useState([]);
  let [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  const [photosUrl, setPhotosUrl] = useState([]);
  const [projectCategoryList, setProjectCategoryList] = useState([]);
  const [category, setCategory] = useState({});
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
    closeCoverPhotoPreview();
  }
  function closePhoto(i) {
    setPhotosUrl(photosUrl.filter((x) => x.name !== i));
    closePhotoPreview(i);
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
        <textarea className="mb-6" name="" id="" cols="30" rows="6"></textarea>
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
  );
}
