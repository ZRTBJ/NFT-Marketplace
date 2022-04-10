import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import FileDragAndDrop from "../ProjectCreate/FileDragAndDrop";
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

const ProfileSettingsForm = () => {
  const dispatch = useDispatch();
  const context = useAuthState();
  const countryList = data ? JSON.parse(JSON.stringify(data.countries)) : [];
  const [stateList, setStateList] = useState(countryList[0].states);
  const [roleList, setRoleList] = useState([]);
  const [userId, setUserId] = useState(context ? context.user : "");
  const userinfo = useSelector((state) => state.user.userinfo);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState({ image: null, path: "" });
  const [websiteList, setWebsiteList] = useState([]);
  const [sncList, setsncList] = useState([]);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  const [coverPhoto, setCoverPhoto] = useState([]);
  const [selectedSNC, setSelectedSNC] = useState();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const socialLinks = [
    { id: 0, title: "discord" },
    { id: 1, title: "twitter" },
    { id: 2, title: "facebook" },
    { id: 3, title: "instagram" },
    { id: 4, title: "youtube" },
    { id: 5, title: "tumblr" },
    { id: 6, title: "weibo" },
    { id: 7, title: "spotify" },
    { id: 8, title: "github" },
    { id: 9, title: "behance" },
    { id: 10, title: "dribbble" },
    { id: 11, title: "opensea" },
    { id: 12, title: "rarible" },
  ];

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
      try {
        document.getElementById("location-country").value = userinfo["country"];
        setCountry(userinfo["country"]);
      } catch {}
      setValue("locationArea", userinfo["area"]);
      setCoverPhotoUrl(userinfo["cover"]);
      if (userinfo["job"]) {
        setRoleList(userinfo["job"].split(","));
      }
      if (userinfo["web"]) {
        try {
          const webs = JSON.parse(userinfo["web"]);
          const weblist = [...webs].map((e) => ({
            title: Object.keys(e)[0],
            url: Object.values(e)[0],
          }));
          setWebsiteList(weblist);
        } catch {
          setWebsiteList([]);
        }
      }

      if (userinfo["social"]) {
        try {
          const sociallinks = JSON.parse(userinfo["social"]);
          const sncs = [...sociallinks].map((e) => ({
            title: Object.keys(e)[0],
            url: Object.values(e)[0],
          }));
          setsncList(sncs);
        } catch {
          setsncList([]);
        }
      }
    } catch {}
    dispatch(setUserInfo(userinfo));
    setIsLoading(false);
  }

  function setCountry(selectedCountry) {
    const country = countryList.find((x) => x.country === selectedCountry);
    if (country) {
      setStateList(country.states);
    } else {
      setStateList([]);
    }
  }

  function handleCountrySelect(event) {
    const selectedCountry = event.target.value;
    const country = countryList.find((x) => x.country === selectedCountry);
    if (country) {
      setStateList(country.states);
    } else {
      setStateList([]);
    }
  }

  function handleRoleChange(event) {
    const value = event.target.value;
    if (event.code === "Enter" && value.length > 0) {
      setRoleList([...roleList, value]);
      event.target.value = "";
      event.preventDefault();
    }
  }

  const handleRemoveRole = (index) => {
    if (index >= 0) {
      const newRoleList = [...roleList];
      newRoleList.splice(index, 1);
      setRoleList(newRoleList);
    }
  };

  const handleRemoveWebsite = (index) => {
    if (index >= 0) {
      const newWebsiteList = [...websiteList];
      newWebsiteList.splice(index, 1);
      setWebsiteList(newWebsiteList);
    }
  };

  const handleRemoveSnc = (index) => {
    if (index >= 0) {
      const newSncList = [...sncList];
      newSncList.splice(index, 1);
      setsncList(newSncList);
    }
  };

  function profileImageChnageHandler(event) {
    const img = event.target.files[0];
    setProfileImage({ image: img, path: URL.createObjectURL(img) });
  }

  function addWebsite() {
    const title = document.getElementById("website");
    const url = document.getElementById("website-url");
    if (title.value && url.value) {
      setWebsiteList([...websiteList, { title: title.value, url: url.value }]);
      title.value = "";
      url.value = "";
    }
  }

  function addSNC() {
    const title = selectedSNC ? selectedSNC.title : null;
    const url = document.getElementById("snc-url");
    if (title && url.value) {
      setsncList([...sncList, { title: title, url: url.value }]);
      url.value = "";
      setSelectedSNC(undefined);
    }
  }

  function showHideSNCPopup() {
    const userDropDown = document.getElementById("sncdropdown");
    userDropDown.classList.toggle("hidden");
  }

  function closeCoverPhoto() {
    setCoverPhoto([]);
    setCoverPhotoUrl("");
    closeCoverPhotoPreview();
  }

  async function coverPhotoSelect(params) {
    if (params.length === 1) {
      setCoverPhoto(params);
      onCoverDrop(params);
    }
  }

  function closeCoverPhotoPreview() {
    setCoverPhoto([]);
  }

  const onCoverDrop = useCallback((acceptedFiles) => {
    setCoverPhoto(acceptedFiles);
  }, []);

  useEffect(() => {
    let objectUrl = "";
    if (coverPhoto.length === 1) {
      objectUrl = URL.createObjectURL(coverPhoto[0]);
      setCoverPhotoUrl(objectUrl);
    }
    return () => URL.revokeObjectURL(objectUrl);
  }, [coverPhoto]);

  const onSubmit = (data) => {
    const job = roleList.toString();
    const web = [...websiteList].map((e) => ({ [e.title]: e.url }));
    const social = [...sncList].map((e) => ({ [e.title]: e.url }));

    const request = new FormData();
    request.append("first_name", data["firstName"]);
    request.append("last_name", data["lastName"]);
    request.append("display_name", data["displayName"]);
    request.append("email", data["emailAddress"]);
    request.append("job", job);
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
    if (coverPhoto[0]) {
      request.append("cover", coverPhoto[0]);
    }
    request.append("web", JSON.stringify(web));
    request.append("social", JSON.stringify(social));
    setIsLoading(true);
    updateUserInfo(userId, request)
      .then((res) => {
        if (res && res.code === 0) {
          setShowErrorModal(false);
          setShowSuccessModal(true);
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
      <h1 className="text-5xl font-bold mb-16">PROFILE</h1>
      <form
        id="profile-setting"
        name="profileSettingForm"
        className="w-full max-w-2xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-wrap mb-12">
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
