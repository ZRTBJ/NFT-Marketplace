import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import FileDragAndDrop from "../DraftProjectUpdate/FileDragAndDrop";
import data from "../../data/countries";
import { updateUserInfo } from "../../services/User/userService";
import { useAuthState } from "Context";
import { useSelector } from "react-redux";
import { setUserInfo } from "../../Slice/userSlice";
import { useDispatch } from "react-redux";
import { getUserInfo } from "../../services/User/userService";
import deleteIcon from "assets/images/projectCreate/ico_delete01.svg";
import SuccessModal from "../modalDialog/SuccessModal";
import ErrorModal from "../modalDialog/ErrorModal";
import { func } from "prop-types";
import { useHistory } from "react-router-dom";

const ProfileSettingsForm = () => {
  const dispatch = useDispatch();
  const context = useAuthState();
  const history = useHistory();
  const [userId, setUserId] = useState(context ? context.user : "");
  const userinfo = useSelector((state) => state.user.userinfo);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState({ image: null, path: "" });
  const [coverPhoto, setCoverPhoto] = useState({ image: null, path: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [moreWebLink, setMoreWebLink] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (userId) {
      getUserDetails(userId);
    }
  }, []);

  async function getUserDetails(userID) {
    setIsLoading(true);
    const response = await getUserInfo(userID);
    let userinfo;
    try {
      userinfo = response["user"];
      setValue("firstName", userinfo["first_name"]);
      setValue("lastName", userinfo["last_name"]);
      setValue("displayName", userinfo["display_name"]);
      setValue("emailAddress", userinfo["email"]);
      setValue("biography", userinfo["biography"]);
      setValue("jobDescription", userinfo["job"]);
      setValue("locationArea", userinfo["area"]);
      if (userinfo["avatar"] && userinfo["avatar"].length > 0) {
        setProfileImage({ image: null, path: userinfo["avatar"] });
      }
      if (userinfo["cover"] && userinfo["cover"].length > 0) {
        setCoverPhoto({ image: null, path: userinfo["cover"] });
      }

      if (userinfo["web"]) {
        try {
          const webs = JSON.parse(userinfo["web"]);
          for (let link of webs) {
            setMoreWebLink([...moreWebLink, { title: Object.keys(link)[0] }]);
          }
          setTimeout(() => {
            for (let link of webs) {
              setValue(Object.keys(link)[0], Object.values(link)[0]);
            }
          }, 500);
        } catch (ex) {
          console.log(ex);
        }
      }

      if (userinfo["social"]) {
        try {
          const sociallinks = JSON.parse(userinfo["social"]);
          for (let link of sociallinks) {
            setValue(Object.keys(link)[0], Object.values(link)[0]);
          }
        } catch (ex) {
          console.log(ex);
        }
      }
    } catch {}
    dispatch(setUserInfo(userinfo));
    setIsLoading(false);
  }

  function profileImageChnageHandler(images) {
    const img = images[0];
    setProfileImage({ image: img, path: URL.createObjectURL(img) });
  }

  function showHideSNCPopup() {
    const userDropDown = document.getElementById("sncdropdown");
    userDropDown.classList.toggle("hidden");
  }

  function addMoreWebLink() {
    const count = moreWebLink.length;
    setMoreWebLink([...moreWebLink, { title: `moreWebLink${count}` }]);
  }

  function removeCoverPhoto() {
    setCoverPhoto({ image: null, path: "" });
  }

  async function coverPhotoSelect(params) {
    if (params.length > 0) {
      setCoverPhoto({ image: params[0], path: URL.createObjectURL(params[0]) });
    }
  }

  const onSubmit = (data) => {
    const social = [];
    social.push({ linkInsta: data["linkInsta"] });
    social.push({ linkReddit: data["linkReddit"] });
    social.push({ linkTwitter: data["linkTwitter"] });
    social.push({ linkFacebook: data["linkFacebook"] });

    const web = [];
    web.push({ webLink1: data["webLink1"] });
    for (let link of moreWebLink) {
      if (data[link.title] && data[link.title].length > 0) {
        web.push({ [link.title]: data[link.title] });
      }
    }

    const request = new FormData();
    request.append("first_name", data["firstName"]);
    request.append("last_name", data["lastName"]);
    request.append("display_name", data["displayName"]);
    // request.append("email", data["emailAddress"]);
    request.append("job", data["jobDescription"]);
    request.append("area", data["locationArea"]);
    // try {
    //   request.append(
    //     "country",
    //     document.getElementById("location-country")?.value
    //   );
    // } catch {}
    request.append("biography", data["biography"]);
    if (profileImage.image) {
      request.append("avatar", profileImage.image);
    }
    if (coverPhoto) {
      request.append("cover", coverPhoto.image);
    }
    request.append("web", JSON.stringify(web));
    request.append("social", JSON.stringify(social));
    setIsLoading(true);
    updateUserInfo(userId, request)
      .then((res) => {
        if (res && res.code === 0) {
          setShowErrorModal(false);
          setShowSuccessModal(true);
          getUserDetails(userId);
        } else {
          setShowErrorModal(true);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setShowSuccessModal(false);
        setShowErrorModal(true);
      });
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <div
      className={`grid justify-items-center mt-24 ml-4 mr-4 sm:ml-0 sm:mr-0`}
    >
      {isLoading && <div className="loading"></div>}
      <form
        id="profile-setting"
        name="profileSettingForm"
        className="w-full max-w-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="text-[white]">
          {/* name */}

          {/* photo */}
          <div>
            <div className="text-xl font-bold mb-4">
              Set your profile Picture
            </div>
            <div className="label">Profile Picture</div>
            <div className="label-grey">
              Add your profile picture, yoiu can image you want like NFT or real
              picture. and let user identify yourself
            </div>
            <div className="md:flex flex-wrap mb-6">
              {profileImage && profileImage.path.length < 1 && (
                <div className="w-full md:max-w-[186px]">
                  <FileDragAndDrop
                    maxFiles={4}
                    height="158px"
                    onDrop={(e) => profileImageChnageHandler(e)}
                    sizePlaceholder="Total upto 16MB"
                  />
                </div>
              )}
              {profileImage && profileImage.path.length > 0 && (
                <div className="relative max-w-[158px] md:max-w-full m-2 md:m-0">
                  <img
                    alt=""
                    className="outlinePhoto md:m-1 block object-cover rounded-xl"
                    src={profileImage.path}
                  />
                  <img
                    alt=""
                    src={deleteIcon}
                    className="absolute top-0 cursor-pointer right-0"
                    onClick={removeCoverPhoto}
                  />
                </div>
              )}
            </div>
          </div>

          {/* cover */}
          <div className="mb-6">
            <div className="label">Cover Photo</div>
            <div className="label-grey">Add your Cover for project profile</div>
            {coverPhoto && coverPhoto.path.length < 1 ? (
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
                  className="coverPreview block rounded-xl"
                  src={coverPhoto.path}
                  alt=""
                />
                <img
                  alt=""
                  src={deleteIcon}
                  className="absolute top-2 cp right-0"
                  onClick={removeCoverPhoto}
                />
              </div>
            )}
          </div>
          <div className="mb-4">
            <div className="label">Username</div>
            <div className="label-grey">
              you can use your name or your nickname.
            </div>
            <input
              className={`block w-full border ${
                errors.displayName ? "border-red-500" : "border-dark-300"
              } rounded py-3 px-4 mb-3 leading-tight ${
                errors.displayName ? "focus:border focus:border-red-500" : ""
              }`}
              id="display-name"
              name="displayName"
              type="text"
              placeholder="Username"
              {...register("displayName", {
                required: "Username is required.",
              })}
              defaultValue={userinfo ? userinfo["display_name"] : ""}
            />
            {errors.displayName && (
              <p className="text-red-500 text-xs font-medium">
                {errors.displayName.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <div className="label">Location</div>
            <div className="label-grey">add your location.</div>
            <input
              className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
              id="location-area"
              name="locationArea"
              {...register("locationArea")}
              type="text"
              placeholder="Add location"
              defaultValue={userinfo ? userinfo["area"] : ""}
            />
          </div>
          <div className="mb-4">
            <div className="label">Bio</div>
            <div className="label-grey">
              Tell your audience who you are, so they can easily knowing you.
            </div>
            <textarea
              rows="6"
              id="biography"
              name="biography"
              placeholder="Add your bio"
              {...register("biography")}
              className="block w-full rounded py-3 px-4 mb-3 leading-tight focus:outline-none resize-none"
              defaultValue={userinfo ? userinfo["biography"] : ""}
            ></textarea>
          </div>
          <div className="mb-4">
            <div className="label">Job Description</div>
            <div className="label-grey">Add your description below.</div>
            <input
              className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
              id="job"
              name="jobDescription"
              {...register("jobDescription")}
              type="text"
              placeholder="Add job description"
              defaultValue={userinfo ? userinfo["job"] : ""}
            />
          </div>
          <div className="mb-4">
            <div className="label">Add Social Link</div>
            <div className="label-grey">
              Add your social media or link below.
            </div>
            <div className="inline-flex items-center w-full">
              <img
                className="cp mr-2 mb-3"
                src={require(`assets/images/profile/social/linkInsta.png`)}
                height={24}
                width={24}
                alt="social logo"
              />
              <input
                className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
                id="link-insta"
                name="linkInsta"
                {...register("linkInsta")}
                type="text"
                placeholder="https://"
              />
            </div>
            <div className="inline-flex items-center w-full">
              <img
                className="cp mr-2 mb-3"
                src={require(`assets/images/profile/social/linkReddit.png`)}
                height={24}
                width={24}
                alt="social logo"
              />
              <input
                className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
                id="link-reddit"
                name="linkReddit"
                {...register("linkReddit")}
                type="text"
                placeholder="https://"
                defaultValue={""}
              />
            </div>
            <div className="inline-flex items-center w-full">
              <img
                className="cp mr-2 mb-3"
                src={require(`assets/images/profile/social/linkTwitter.png`)}
                height={24}
                width={24}
                alt="social logo"
              />
              <input
                className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
                id="link-twitter"
                name="linkTwitter"
                {...register("linkTwitter")}
                type="text"
                placeholder="https://"
                defaultValue={""}
              />
            </div>
            <div className="inline-flex items-center w-full">
              <img
                className="cp mr-2 mb-3"
                src={require(`assets/images/profile/social/linkFacebook.png`)}
                height={24}
                width={24}
                alt="social logo"
              />
              <input
                className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
                id="link-facebook"
                name="linkFacebook"
                {...register("linkFacebook")}
                type="text"
                placeholder="https://"
                defaultValue={""}
              />
            </div>
            <div className="inline-flex items-center w-full">
              <i className="fa fa-link mr-3 mb-3" aria-hidden="true"></i>
              <input
                className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
                id="link-web"
                name="webLink1"
                {...register("webLink1")}
                type="text"
                placeholder="https://"
                defaultValue={""}
              />
            </div>
            {moreWebLink &&
              moreWebLink.length > 0 &&
              moreWebLink.map((link, index) => (
                <div
                  key={`more-link-${index}`}
                  className="inline-flex items-center w-full"
                >
                  <i className="fa fa-link mr-3 mb-3" aria-hidden="true"></i>
                  <input
                    className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
                    id={`more-link-web-${index + 1}`}
                    name={link.title}
                    {...register(`moreWebLink${index + 1}`)}
                    type="text"
                    placeholder="https://"
                    defaultValue={"https://"}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3 grid grid-cols-3">
            <div>
              <button
                type="button"
                className="btn-outline-primary-gradient w-[100px] h-[38px]"
                onClick={(e) => {
                  addMoreWebLink();
                }}
              >
                <span>Show More</span>
              </button>
            </div>
            <div className="text-right">
              {/* <button
                type="button"
                className="inline-block sm:hidden btn-primary w-[80px] h-[38px] rounded-lg mr-4"
                onClick={() => history.push(`/profile/${userId ? userId : ""}`)}
              >
                Skip
              </button> */}
            </div>
            <div className="text-right">
              {/* <button
                type="button"
                className="hidden sm:inline-block btn-primary w-[80px] h-[38px] rounded-lg mr-4"
                onClick={() => history.push(`/profile/${userId ? userId : ""}`)}
              >
                Skip
              </button> */}
              <button type="submit" className="btn btn-primary btn-sm">
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
      {showSuccessModal && (
        <SuccessModal
          handleClose={setShowSuccessModal}
          show={showSuccessModal}
        />
      )}
      {showErrorModal && (
        <ErrorModal handleClose={setShowErrorModal} show={showErrorModal} />
      )}
    </div>
  );
};
export default ProfileSettingsForm;
