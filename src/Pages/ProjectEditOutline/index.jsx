/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import ProjectEditTopNavigationCard from "components/ProjectEdit/ProjectEditTopNavigationCard";
import ProjectCover from "components/ProjectEdit/ProjectCover";
import { useParams } from "react-router-dom";
import { getProjectDetailsById } from "services/project/projectService";
import { getProjectCategory } from "services/project/projectService";
import { DebounceInput } from "react-debounce-input";
import { checkUniqueProjectName } from "services/project/projectService";
import FileDragAndDrop from "components/ProjectCreate/FileDragAndDrop";
import deleteIcon from "assets/images/projectCreate/ico_delete01.svg";
function ProjectEditOutline(props) {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [projectName, SetProjectName] = useState("");
  const [emptyProjectName, setemptyProjectName] = useState(false);
  const [alreadyTakenProjectName, setAlreadyTakenProjectName] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState([]);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  const [Photos, setPhotos] = useState([]);
  const [photosUrl, setPhotosUrl] = useState([]);
  const [overview, setOverview] = useState("");
  const [projectCategoryList, setProjectCategoryList] = useState([]);
  const [category, setCategory] = useState("");
  const [emptyProjeCtCategory, setEmptyProjectCategory] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [tagsLimit, setTagsLimit] = useState(false);
  const [lookingForMember, setLookingForMember] = useState(false);
  const [roleList, setRoleList] = useState([]);

  async function changeProjectName(value) {
    SetProjectName(value);
    let payload = {
      projectName: value,
    };
    await checkUniqueProjectName(payload)
      .then((e) => {
        if (e.code === 0) {
          SetProjectName(payload.projectName);
          setemptyProjectName(false);
          setAlreadyTakenProjectName(false);
        } else {
          setAlreadyTakenProjectName(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function coverPhotoSelect(params) {
    if (params.length === 1) {
      setCoverPhoto(params);
    }
  }
  function closeCoverPhoto() {
    setCoverPhoto([]);
    setCoverPhotoUrl("");
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
    }
  }
  function closePhoto(i) {
    setPhotosUrl(photosUrl.filter((x) => x.name !== i));
  }
  function onOverviewChnage(e) {
    setOverview(e.target.value);
  }
  async function selectCategory(e) {
    setCategory(e.target.value);
  }
  function handleRoleChange(type, event) {
    if (type === "tag") {
      const value = event.target.value;
      if (event.code === "Enter" && value.length > 0) {
        if (tagList.length > 4) {
          setTagsLimit(true);
        } else {
          setTagList([...tagList, value]);

          event.target.value = "";
        }
      }
    } else if (type === "role") {
      const value = event.target.value;
      if (event.code === "Enter" && value.length > 0) {
        setRoleList([...roleList, value]);
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
        setTagsLimit(false);
      }
    } else if (type === "role") {
      if (index >= 0) {
        const newRoleList = [...roleList];
        newRoleList.splice(index, 1);
        setRoleList(newRoleList);
      }
    }
  };
  function needMemberChange(e) {
    if (e) {
      setLookingForMember(true);
    } else {
      setRoleList([]);
      setLookingForMember(false);
    }
  }
  useEffect(() => {
    getProjectCategory().then((e) => {
      setProjectCategoryList(e.categories);
    });
  }, []);
  useEffect(() => {
    async function projectDetails() {
      let payload = {
        id: id,
      };
      await getProjectDetailsById(payload).then((e) => {
        let response = e.project;
        SetProjectName(response.name);
        let cover = response.assets.find((x) => x.asset_purpose === "cover");
        console.log(cover);
        setCoverPhotoUrl(cover ? cover.path : "");
        let photosUrl = response.assets.filter(
          (x) => x.asset_purpose === "subphoto"
        );
        setPhotosUrl(photosUrl);
        setOverview(response.overview);
        setCategory(response.category_id);
        setTagList(response.tags);
        setLookingForMember(response.member_needed);
        setRoleList(response.roles);
        setIsLoading(false);
      });
    }
    projectDetails();
  }, []);
  return (
    <div>
      {isLoading && <div className="loading"></div>}
      <div className="sticky z-[1]">
        <ProjectEditTopNavigationCard />
      </div>
      <div className="relative bottom-8">
        <ProjectCover />
      </div>
      <div className="max-w-[630px] block mx-auto ">
        <div>
          <div className="OutlineTitle mb-[40px]">OUTLINE</div>
          <div>
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
                <div className="validationTag">
                  Unique project name is required
                </div>
              )}
              {alreadyTakenProjectName && (
                <div className="validationTag">
                  Project name has already taken
                </div>
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
                  <img
                    className="coverPreview block"
                    src={coverPhotoUrl}
                    alt=""
                  />
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
                <div className="md:w-[420px]">
                  <FileDragAndDrop
                    maxFiles={4}
                    height="192px"
                    onDrop={(e) => photoSelect(e)}
                    sizePlaceholder="Total upto 16MB"
                  />
                </div>
                <div className="photoPreviewContainer mt-3 md:mt-0 md:w-[209px] md:pl-4 mx-12 md:mx-0 flex md:justify-between md:ml-auto flex-wrap">
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
                value={overview}
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
                <div className="validationTag">
                  Project category is required
                </div>
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
                  <div className="validationTag mb-3">
                    Only five tags can save{" "}
                  </div>
                )}
              </div>
              {tagList &&
                tagList.length > 0 &&
                tagList.map((role, index) => (
                  <div className="px-3 pb-4" key={`rolw-${index}`}>
                    <div className="h-8 w-auto boarder rounded bg-gray-100">
                      <div className="flex flex-row">
                        <div className="pr-4 pl-2 pt-1 break-all">
                          {role.name}
                        </div>
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
                            <div className="pr-4 pl-2 pt-1 break-all">
                              {role.name}
                            </div>
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
        </div>
      </div>
    </div>
  );
}

export default ProjectEditOutline;
