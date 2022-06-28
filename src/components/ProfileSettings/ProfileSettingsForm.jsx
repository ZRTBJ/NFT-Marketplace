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

const ProfileSettingsForm = () => {
  const dispatch = useDispatch();
  const context = useAuthState();
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
    debugger;
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
    request.append("email", data["emailAddress"]);
    request.append("job", data["jobDescription"]);
    request.append("area", data["locationArea"]);
    try {
      request.append(
        "country",
        document.getElementById("location-country")?.value
      );
    } catch {}
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
    <div className={`grid justify-items-center my-24`}>
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
            <div className="text-xl font-semibold mb-4">
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
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none resize-none"
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
                src={require(`assets/images/profile/social/insta-icon.png`)}
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
                src={require(`assets/images/profile/social/reddit-icon.png`)}
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
                src={require(`assets/images/profile/social/twitter-icon.png`)}
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
                src={require(`assets/images/profile/social/facebook-icon.png`)}
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
              <i class="fa fa-link mr-3 mb-3" aria-hidden="true"></i>
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
                <div className="inline-flex items-center w-full">
                  <i class="fa fa-link mr-3 mb-3" aria-hidden="true"></i>
                  <input
                    className={`block w-full border border-dark-300 rounded py-3 px-4 mb-3 leading-tight`}
                    id={`more-link-web-${index}`}
                    name={`moreWebLink${index}`}
                    {...register(`moreWebLink${index}`)}
                    type="text"
                    placeholder="https://"
                    defaultValue={""}
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
                className="btn-outline-primary w-[120px] h-[38px] rounded-lg mr-4 ml-5"
                onClick={addMoreWebLink}
              >
                Show More
              </button>
            </div>
            <div className="text-right"></div>
            <div className="text-right">
              <button
                type="button"
                className="btn-primary w-[80px] h-[38px] rounded-lg mr-4"
              >
                Skip
              </button>
              <button
                type="submit"
                className="btn-primary w-[100px] h-[38px] rounded-lg"
              >
                NEXT <i class="fa fa-angle-right" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
        {/* <div className="flex flex-wrap mb-12">
          <div className="w-full grid grid-cols-3">
            <div></div>
            <div className="flex justify-center">
              <img
                className="rounded-full border-4 border-gray-300 shadow-sm"
                src={`
                  ${
                    userinfo["avatar"]
                      ? userinfo["avatar"]
                      : profileImage["path"]
                      ? profileImage["path"]
                      : "/static/media/profile.a33a86e1109f4271bbfa9f4bab01ec4b.svg"
                  }`}
                alt="user icon"
                height={140}
                width={140}
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <div className="relative z-2 top-24 right-8 w-12 h-12 rounded-full bg-[#0AB4AF] mr-1">
                  <div className="text-center justify-center text-white pt-3">
                    <i className="fa fa-camera fa-lg" aria-hidden="true"></i>
                  </div>
                </div>
              </label>
              <input
                id="file-input"
                accept="image/png, image/jpeg, image/jpg"
                type="file"
                className="hidden"
                onChange={profileImageChnageHandler}
              />
            </div>
            <div></div>
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="first-name"
            >
              First Name
            </label>
            <input
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
              id="first-name"
              name="firstName"
              type="text"
              placeholder=""
              {...register("firstName")}
              defaultValue={userinfo ? userinfo["first_name"] : ""}
            />
            <p className="hidden text-red-500 text-xs italic">
              Please fill out this field.
            </p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="last-name"
            >
              Last Name
            </label>
            <input
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
              id="last-name"
              name="lastName"
              type="text"
              placeholder=""
              {...register("lastName")}
              defaultValue={userinfo ? userinfo["last_name"] : ""}
            />
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label
              className="block tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="display-name"
            >
              Display Name (<span className="text-red-500">*</span>)
            </label>
            <input
              className={`block w-full border ${
                errors.displayName ? "border-red-500" : "border-zinc-300"
              } rounded py-3 px-4 mb-3 leading-tight ${
                errors.displayName ? "focus:border focus:border-red-500" : ""
              }`}
              id="display-name"
              name="displayName"
              type="text"
              placeholder=""
              {...register("displayName", {
                required: "Display Name is required.",
              })}
              defaultValue={userinfo ? userinfo["display_name"] : ""}
            />
            {errors.displayName && (
              <p className="text-red-500 text-xs font-medium">
                {errors.displayName.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="email-address"
            >
              E-mail Address
            </label>
            <input
              className={`block w-full border ${
                errors.emailAddress ? "border-red-500" : "border-zinc-300"
              } rounded py-3 px-4 mb-3 leading-tight ${
                errors.emailAddress ? "focus:border focus:border-red-500" : ""
              }`}
              id="email-address"
              name="emailAddress"
              type="text"
              placeholder=""
              {...register("emailAddress", {
                pattern: /^\w+([-+.']\w+)*[\-]?@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
              })}
              defaultValue={userinfo ? userinfo["email"] : ""}
            />
            {errors.emailAddress && (
              <p className="text-red-500 text-xs font-medium">
                Please enter a valid email address (example: johndoe@domain.com)
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="cover-photo"
            >
              Cover photo (upto 4MB)
            </label>
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
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="roll"
            >
              Role
            </label>
            <input
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
              id="roll"
              type="text"
              placeholder="Type and press enter"
              defaultValue={""}
              {...register("roll")}
              onKeyPress={handleRoleChange}
            />
          </div>
          {roleList &&
            roleList.length > 0 &&
            roleList.map((role, index) => (
              <div className="px-3 pb-4" key={`rolw-${index}`}>
                <div className="h-8 w-auto boarder rounded bg-gray-100">
                  <div className="flex flex-row">
                    <div className="pr-4 pl-2 pt-1">{role}</div>
                    <div className="border-l border-white px-1">
                      <i
                        onClick={() => handleRemoveRole(index)}
                        className="fa fa-times-thin fa-2x cursor-pointer"
                        aria-hidden="true"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="location-country"
            >
              Location Country
            </label>
            <div className="relative">
              <select
                className="block w-full border border-zinc-300 rounded focus:outline-none"
                id="location-country"
                name="locationCountry"
                onChange={handleCountrySelect}
              >
                {countryList &&
                  countryList.map((data, index) => (
                    <option value={data.country} key={`country-${index}`}>
                      {data.country}
                    </option>
                  ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="location-area"
            >
              Location Area
            </label>
            <div className="relative">
              <select
                className="block w-full border border-zinc-300 rounded focus:outline-none"
                id="location-area"
                name="locationArea"
                {...register("locationArea")}
              >
                {stateList &&
                  stateList.map((stat, index) => (
                    <option value={stat} key={`area-${index}`}>
                      {stat}
                    </option>
                  ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="biography"
            >
              Comment, Biography
            </label>
            <textarea
              rows="6"
              id="biography"
              name="biography"
              {...register("biography")}
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none resize-none"
            ></textarea>
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full">
            <div
              id="sncMenu"
              className="w-full rounded divide-y divide-zinc-300 float-right px-3"
            >
              <div className="flex flex-wrap w-full pb-2 sm:pb-0">
                <div className="w-full md:w-3/12 sm:pr-3">
                  <label
                    className="block tracking-wide text-gray-700 text-s font-bold mb-2"
                    htmlFor="snc"
                  >
                    SNC
                  </label>
                  <div className="absolute">
                    <button
                      id="dropdownDefault"
                      className="text-black border border-zinc-300 rounded px-4 py-2.5 text-center inline-flex items-center"
                      type="button"
                      onClick={showHideSNCPopup}
                    >
                      {selectedSNC ? (
                        <>
                          <div className="inline-flex">
                            <img
                              className="cp"
                              src={require(`assets/images/profile/social/ico_${selectedSNC.title}.svg`)}
                              height={24}
                              width={24}
                              alt="social logo"
                            />
                            <div className="capitalize pl-1.5">
                              {selectedSNC.title}
                            </div>
                          </div>
                        </>
                      ) : (
                        "Select SNC"
                      )}
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>
                    <div
                      id="sncdropdown"
                      className="hidden z-10 bg-white rounded shadow"
                    >
                      <ul
                        className="py-1 text-sm text-gray-700 dark:text-gray-200 divide-y divide-gray-100"
                        aria-labelledby="dropdownDefault"
                      >
                        {socialLinks.map((link) => (
                          <li
                            onClick={() => {
                              setSelectedSNC(link);
                              showHideSNCPopup();
                            }}
                            className="hover:bg-[#0AB4AF] hover:text-white cursor-pointer"
                            key={link.id}
                          >
                            <div className="inline-flex p-1.5">
                              <img
                                className="cp"
                                src={require(`assets/images/profile/social/ico_${link.title}.svg`)}
                                height={24}
                                width={24}
                                alt="social logo"
                              />
                              <div className="capitalize pl-1.5">
                                {link.title}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-8/12">
                  <label
                    className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
                    htmlFor="snc-url"
                  >
                    &nbsp;
                  </label>
                  <input
                    className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                    id="snc-url"
                    name="sncUrl"
                    type="text"
                    placeholder="URL"
                    {...register("sncUrl")}
                    defaultValue={""}
                  />
                </div>
                <div className="w-full md:w-1/12">
                  <label
                    className="hidden sm:block tracking-wide text-gray-700 text-s font-bold mb-2"
                    htmlFor="snc-add"
                  >
                    &nbsp;
                  </label>
                  <div className="text-center justify-center pt-1.5">
                    <i
                      onClick={addSNC}
                      className="fa fa-plus-circle fa-2x text-gray-300 font-thin cursor-pointer"
                      aria-hidden="true"
                    ></i>
                  </div>
                </div>
              </div>
              {sncList &&
                sncList.map((snc, index) => (
                  <div
                    className="w-full py-4 grid grid-cols-3"
                    key={`snc-${index}`}
                  >
                    <div className="inline-flex p-1.5">
                      <img
                        className="cp"
                        src={require(`assets/images/profile/social/ico_${snc.title}.svg`)}
                        height={24}
                        width={24}
                        alt="social logo"
                      />
                      <div className="capitalize pl-1.5">{snc.title}</div>
                    </div>
                    <div className="p-1.5 truncate">{snc.url}</div>
                    <div className="p-1.5 text-gray-500 text-right">
                      <i
                        onClick={() => handleRemoveSnc(index)}
                        className="fa fa-times"
                        aria-hidden="true"
                      ></i>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap mb-6">
          <div className="w-full">
            <div
              id="websiteDropDown"
              className="w-full rounded divide-y divide-zinc-300 float-right px-3"
            >
              <div className="flex flex-wrap w-full pb-2 sm:pb-0">
                <div className="w-full md:w-3/12 sm:pr-5">
                  <label
                    className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
                    htmlFor="website"
                  >
                    Website
                  </label>
                  <input
                    className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                    id="website"
                    name="website"
                    type="text"
                    placeholder="Link Title"
                    {...register("website")}
                    defaultValue={""}
                  />
                </div>
                <div className="w-full md:w-8/12">
                  <label
                    className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
                    htmlFor="website-url"
                  >
                    &nbsp;
                  </label>
                  <input
                    className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                    id="website-url"
                    name="websiteUrl"
                    type="text"
                    placeholder="URL"
                    {...register("websiteUrl")}
                    defaultValue={""}
                  />
                </div>
                <div className="w-full md:w-1/12">
                  <label
                    className="hidden sm:block tracking-wide text-gray-700 text-s font-bold mb-2"
                    htmlFor="snc-add"
                  >
                    &nbsp;
                  </label>
                  <div className="text-center justify-center pt-1.5">
                    <i
                      onClick={addWebsite}
                      className="fa fa-plus-circle fa-2x text-gray-300 font-thin cursor-pointer"
                      aria-hidden="true"
                    ></i>
                  </div>
                </div>
              </div>
              {websiteList &&
                websiteList.map((website, index) => (
                  <div
                    className="w-full py-4 grid grid-cols-3"
                    key={`website-${index}`}
                  >
                    <div>{website.title}</div>
                    <div className="truncate ">{website.url}</div>
                    <div className="text-gray-500 text-right">
                      <i
                        onClick={() => handleRemoveWebsite(index)}
                        className="fa fa-times"
                        aria-hidden="true"
                      ></i>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3 grid grid-cols-3">
            <div></div>
            <div>
              <button
                type="submit"
                className="h-12 w-32 sm:w-48  rounded bg-[#0ab4af] text-white pl-0 hover:bg-[#192434] cursor-pointer"
              >
                SAVE
              </button>
            </div>
            <div></div>
          </div>
        </div> */}
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
