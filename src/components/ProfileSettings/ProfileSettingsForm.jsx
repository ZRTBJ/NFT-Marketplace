import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FileDragAndDrop from "../ProjectCreate/FileDragAndDrop";
import data from "../../data/countries";
import { updateUserInfo } from "../../services/User/userService";
import { useAuthState } from "Context";
import { useSelector } from "react-redux";
import { setUserInfo } from "../../Slice/userSlice";
import { useDispatch } from "react-redux";
import { getUserInfo } from "../../services/User/userService";

const ProfileSettingsForm = () => {
  const dispatch = useDispatch();
  const context = useAuthState();
  const countryList = data ? JSON.parse(JSON.stringify(data.countries)) : [];
  const [stateList, setStateList] = useState(countryList[0].states);
  const [roleList, setRoleList] = useState([]);
  const [userId, setUserId] = useState(context ? context.user : "");
  const userinfo = useSelector((state) => state.user.userinfo);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (userId && !userinfo["first_name"]) {
      getUserDetails(userId);
    }
  }, []);

  async function getUserDetails(userID) {
    setIsLoading(true);
    const response = await getUserInfo(userID);
    let userinfo;
    try {
      userinfo = response["data"]["user"];
    } catch {}
    dispatch(setUserInfo(userinfo));
    setIsLoading(false);
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
    }
  }

  const handleRemoveRole = (index) => {
    if (index >= 0) {
      const newRoleList = [...roleList];
      newRoleList.splice(index, 1);
      setRoleList(newRoleList);
    }
  };

  const onSubmit = (data) => {
    const request = new FormData();
    debugger;
    request.append("first_name", data["firstName"]);
    request.append("last_name", data["lastName"]);
    request.append("display_name", data["displayName"]);
    updateUserInfo(userId, request)
      .then((res) => {
        const temp = res;
        debugger;
      })
      .catch((err) => {});
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <div
      className={`grid justify-items-center my-24 ${
        isLoading ? "loading" : ""
      }`}
    >
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
                src="/static/media/profile.a33a86e1109f4271bbfa9f4bab01ec4b.svg"
                alt="user icon"
                height={140}
                width={140}
              />
              <div className="relative z-2 top-24 right-8 w-12 h-12 rounded-full bg-[#0AB4AF] mr-1">
                <div className="text-center justify-center text-white pt-3">
                  <i className="fa fa-camera fa-lg" aria-hidden="true"></i>
                </div>
              </div>
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
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
              Display Name
            </label>
            <input
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="display-name"
              name="displayName"
              type="text"
              placeholder=""
              {...register("displayName")}
              defaultValue={userinfo ? userinfo["display_name"] : ""}
            />
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
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="email-address"
              name="emailAddress"
              type="email"
              placeholder=""
              {...register("emailAddress")}
              defaultValue={userinfo ? userinfo["email"] : ""}
            />
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="cover-photo"
            >
              Cover Photo
            </label>
            <FileDragAndDrop height="230px" />
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
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="roll"
              name="roll"
              type="text"
              placeholder="Type and press enter"
              defaultValue={""}
              {...register("roll")}
              onKeyUp={handleRoleChange}
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
                className="block w-full border border-zinc-300 rounded focus:outline-none focus:bg-white"
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
                className="block w-full border border-zinc-300 rounded focus:outline-none focus:bg-white"
                id="location-area"
                name="locationArea"
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
              htmlFor="comment"
            >
              Comment, Biography
            </label>
            <textarea
              rows="6"
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white resize-none"
            ></textarea>
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full">
            <div
              id="userDropDown"
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
                  <div className="relative">
                    <select
                      className="block w-full border border-zinc-300 rounded focus:outline-none focus:bg-white"
                      id="snc"
                      name="snc"
                      {...register("snc")}
                    >
                      <option>Discord</option>
                      <option>Twitter</option>
                      <option>facebook</option>
                      <option>Instagram</option>
                      <option>Youtube</option>
                      <option>Tumblr</option>
                      <option>Weibo</option>
                      <option>Spotify</option>
                      <option>Github</option>
                      <option>Behance</option>
                      <option>Dribbble</option>
                      <option>Opensea</option>
                      <option>Rarible</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"></div>
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
                    className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
                      className="fa fa-plus-circle fa-2x text-gray-300 font-thin"
                      aria-hidden="true"
                    ></i>
                  </div>
                </div>
              </div>
              <div className="w-full py-4 grid grid-cols-3">
                <div>Facebook</div>
                <div>https://www.123456789.com/</div>
                <div className="text-gray-500 text-right">
                  <i className="fa fa-times" aria-hidden="true"></i>
                </div>
              </div>
              <div className="w-full py-4 grid grid-cols-3">
                <div>Insta</div>
                <div>https://www.iwanttoonuts.net/</div>
                <div className="text-gray-500 text-right">
                  <i className="fa fa-times" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap mb-6">
          <div className="w-full">
            <div
              id="userDropDown"
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
                    className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
                    className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
                      className="fa fa-plus-circle fa-2x text-gray-300 font-thin"
                      aria-hidden="true"
                    ></i>
                  </div>
                </div>
              </div>
              <div className="w-full py-4 grid grid-cols-3">
                <div>Portfolio</div>
                <div>https://www.123456789.com/</div>
                <div className="text-gray-500 text-right">
                  <i className="fa fa-times" aria-hidden="true"></i>
                </div>
              </div>
              <div className="w-full py-4 grid grid-cols-3">
                <div>Website</div>
                <div>https://www.iwanttoeatdonuts.net/</div>
                <div className="text-gray-500 text-right">
                  <i className="fa fa-times" aria-hidden="true"></i>
                </div>
              </div>
              <div className="w-full py-4 grid grid-cols-3">
                <div>ONLINE SHOP</div>
                <div>https://pop.donutspower.jp/</div>
                <div className="text-gray-500 text-right">
                  <i className="fa fa-times" aria-hidden="true"></i>
                </div>
              </div>
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
    </div>
  );
};
export default ProfileSettingsForm;
