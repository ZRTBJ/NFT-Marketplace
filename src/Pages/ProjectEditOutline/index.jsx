import { useState, useCallback, useEffect } from "react";
import "assets/css/CreateProject/mainView.css";
import {
  checkUniqueProjectName,
  deleteAssetsOfProject,
  updateProject,
  getProjectDetailsById,
  getProjectCategory,
} from "services/project/projectService";

import Outline from "components/DraftProjectUpdate/Outline";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import SuccessModal from "components/modalDialog/SuccessModal";
import ErrorModal from "components/modalDialog/ErrorModal";

export default function ProjectEditOutline() {
  const { id } = useParams();
  const [isDataLoading, setDataIsLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [projectStatus, setProjectStatus] = useState("");

  /**
   * ==============================================
   * Outline Start
   * ==============================================
   */

  // Project Name start
  const [projectName, setProjectName] = useState("");
  const [emptyProjectName, setemptyProjectName] = useState(false);
  const [alreadyTakenProjectName, setAlreadyTakenProjectName] = useState(false);

  async function onProjectNameChange(e) {
    let payload = {
      projectName: e,
      project_uuid: id,
    };
    setProjectName(payload.projectName);
    await checkUniqueProjectName(payload)
      .then((e) => {
        if (e.code === 0) {
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
  // Project Name End

  // Cover photo start
  const [coverPhoto, setCoverPhoto] = useState([]);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  const onCoverPhotoSelect = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 1) {
      setCoverPhoto(acceptedFiles);
      let objectUrl = URL.createObjectURL(acceptedFiles[0]);
      let coverPhotoInfo = {
        path: objectUrl,
      };
      setCoverPhotoUrl(coverPhotoInfo);
      setoutlineKey(1);
    }
  }, []);
  function onCoverPhotoRemove() {
    if (coverPhotoUrl.id) {
      let payload = {
        projectId: id,
        assetsId: coverPhotoUrl.id,
      };
      deleteAssetsOfProject(payload).then((e) => {
        setCoverPhoto([]);
        setCoverPhotoUrl("");
      });
    } else {
      setCoverPhoto([]);
      setCoverPhotoUrl("");
    }

    setCoverPhoto([]);
    setCoverPhotoUrl("");
  }
  // Cover photo end

  // photos start
  const [photos, setPhotos] = useState([]);
  const [photosUrl, setPhotosUrl] = useState([]);

  const onPhotosSelect = useCallback((params, photos) => {
    if (photosLengthFromResponse + params.length > 4) {
      alert("Maxmimum 4 photos");
    } else {
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
            path: URL.createObjectURL(element),
          });
        });
        let megred = [...photos, ...objectUrl];
        setPhotosUrl(megred);
        setPhotos(params);
      }
    }
  }, []);
  async function onPhotosRemove(i) {
    if (i.id) {
      let payload = {
        projectId: id,
        assetsId: i.id,
      };
      await deleteAssetsOfProject(payload).then((e) => {
        setUpPhotos();
      });
    } else {
      setPhotosUrl(photosUrl.filter((x) => x.name !== i.name));
    }
  }
  // Photos End

  // overview start
  const [overview, setOverview] = useState("");
  function onOverviewChange(e) {
    setOverview(e.target.value);
  }
  // overview End

  // category start
  const [projectCategory, setProjectCategory] = useState("");
  const [emptyProjeCtCategory, setEmptyProjectCategory] = useState(false);
  function onProjectCategoryChange(e) {
    setProjectCategory(e.target.value);
    setEmptyProjectCategory(false);
  }
  // category end

  // tags start
  const [tagList, setTagList] = useState([]);
  const [tagLimit, setTagLimit] = useState(false);
  function onTagEnter(event) {
    const value = event.target.value;
    if (event.code === "Enter" && value.length > 0) {
      if (tagList.length > 4) {
        setTagLimit(true);
      } else {
        setTagList([...tagList, value]);
        event.target.value = "";
      }
    }
  }
  function onTagRemove(index) {
    if (index >= 0) {
      const newRoleList = [...tagList];
      newRoleList.splice(index, 1);
      setTagList(newRoleList);
      setTagLimit(false);
    }
  }
  // tag end

  // role start
  const [roleList, setRoleList] = useState([]);
  function onRoleEnter(event) {
    const value = event.target.value;
    if (event.code === "Enter" && value.length > 0) {
      setRoleList([...roleList, value]);
      event.target.value = "";
    }
  }
  function onRoleRemove(index) {
    if (index >= 0) {
      const newRoleList = [...roleList];
      newRoleList.splice(index, 1);
      setRoleList(newRoleList);
    }
  }
  // role end

  // Need mamber start
  const [needMember, setNeedMember] = useState(false);
  function onNeedMemberChange(e) {
    if (e) {
      setNeedMember(true);
    } else {
      setRoleList([]);
      setNeedMember(false);
    }
  }
  // need member end

  const [outlineKey, setoutlineKey] = useState(0);
  const [photosLengthFromResponse, setPhotosLengthFromResponse] = useState(0);
  const [remainingPhotosName, setRemainingPhotosName] = useState([]);
  async function setUpPhotos() {
    let payload = {
      id: id,
    };
    await getProjectDetailsById(payload).then((e) => {
      let response = e.project;
      let photosInfoData = response.assets.filter(
        (x) => x.asset_purpose === "subphoto"
      );
      setPhotosLengthFromResponse(photosInfoData.length);
      setPhotosUrl(photosInfoData);
      let constPhotosName = ["img1", "img2", "img3", "img4"];
      let photosname = [];
      photosname = photosInfoData.map((e) => {
        return e.name;
      });
      let remainingPhotosName = constPhotosName.filter(function (v) {
        return !photosname.includes(v);
      });
      setRemainingPhotosName(remainingPhotosName);
    });
  }
  /**
   * ==============================================
   * Outline ENd
   * ==============================================
   */

  const [currentStep, setcurrentStep] = useState([1]);

  async function projectDetails() {
    let payload = {
      id: id,
    };
    await getProjectDetailsById(payload).then((e) => {
      let response = e.project;
      // outline start
      setProjectName(response.name);
      let cover = response.assets.find((x) => x.asset_purpose === "cover");
      setCoverPhotoUrl(cover ? cover : "");

      let photosInfoData = response.assets.filter(
        (x) => x.asset_purpose === "subphoto"
      );
      setPhotosLengthFromResponse(photosInfoData.length);
      setPhotosUrl(photosInfoData);
      let constPhotosName = ["img1", "img2", "img3", "img4"];
      let photosname = [];
      photosname = photosInfoData.map((e) => {
        return e.name;
      });
      let remainingPhotosName = constPhotosName.filter(function (v) {
        return !photosname.includes(v);
      });
      setRemainingPhotosName(remainingPhotosName);
      setOverview(response.overview);
      setProjectCategory(response.category_id);
      if (response.tags) {
        if (response.tags.length > 0) {
          let tags = [];
          response.tags.forEach((element) => {
            tags.push(element.name);
          });
          setTagList(tags);
        }
      }
      setNeedMember(response.member_needed);
      if (response.roles) {
        if (response.roles.length > 0) {
          let roles = [];
          response.roles.forEach((element) => {
            roles.push(element.name);
          });
          setRoleList(roles);
        }
      }
      // outline end

      // Token start

      // Token end
      setDataIsLoading(false);

      setProjectStatus(response.project_status);
    });
  }
  async function saveDraft(visibility) {
    // outline start
    if (currentStep.length === 1) {
      if (projectName === "") {
        setemptyProjectName(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (projectCategory === "") {
        setEmptyProjectCategory(true);
      } else if (
        projectName !== "" &&
        projectCategory !== "" &&
        !alreadyTakenProjectName
      ) {
        setDataIsLoading(true);

        let updatePayload = {
          id: id,
          visibility: visibility,
          name: projectName,
          category_id: projectCategory,
          overview: overview,
          tags: tagList.toString(),
          cover: coverPhoto.length > 0 ? coverPhoto[0] : null,
          photos: photos.length > 0 ? photos : null,
          photosLengthFromResponse: photosLengthFromResponse,
          remainingPhotosName: remainingPhotosName,
        };
        updateProject(updatePayload)
          .then((res) => {
            setDataIsLoading(false);
            setShowSuccessModal(true);
            projectDetails();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    // outline end
  }

  useEffect(() => {
    projectDetails();
  }, []);

  return (
    <div className="text-[white]">
      {isDataLoading && <div className="loading"></div>}
      <div className="cardContainer px-3 md:px-5">
        {currentStep.length === 1 && (
          <div>
            {/* <LeftSideBar currentStep={currentStep} key={currentStep.length} /> */}
            <Outline
              key={outlineKey}
              // name
              projectName={projectName}
              emptyProjectName={emptyProjectName}
              alreadyTakenProjectName={alreadyTakenProjectName}
              onProjectNameChange={onProjectNameChange}
              projectNameDisabled={true}
              //cover photos
              coverPhotoUrl={coverPhotoUrl}
              onCoverPhotoSelect={onCoverPhotoSelect}
              onCoverPhotoRemove={onCoverPhotoRemove}
              //photos
              photosUrl={photosUrl}
              onPhotosSelect={onPhotosSelect}
              onPhotosRemove={onPhotosRemove}
              // overview
              overview={overview}
              onOverviewChange={onOverviewChange}
              // category
              projectCategory={projectCategory}
              emptyProjeCtCategory={emptyProjeCtCategory}
              onProjectCategoryChange={onProjectCategoryChange}
              // tag
              tagList={tagList}
              tagLimit={tagLimit}
              onTagEnter={onTagEnter}
              onTagRemove={onTagRemove}
              // need member
              needMember={needMember}
              onNeedMemberChange={onNeedMemberChange}
              // role list
              roleList={roleList}
              onRoleEnter={onRoleEnter}
              onRoleRemove={onRoleRemove}
            />
          </div>
        )}
        <div className="buttonContainer">
          {projectStatus !== "publishing" && (
            <div className="flex justify-start">
              {currentStep.length === 1 && (
                <button
                  onClick={() => saveDraft("publish")}
                  className="btn-primary w-[100px] h-[38px] "
                >
                  Save
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {showSuccessModal && (
        <SuccessModal
          handleClose={() => setShowSuccessModal(false)}
          show={showSuccessModal}
        />
      )}
      {showErrorModal && (
        <ErrorModal
          handleClose={() => setShowErrorModal(false)}
          show={showErrorModal}
        />
      )}
    </div>
  );
}
