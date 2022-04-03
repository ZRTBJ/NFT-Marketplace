import React, { useState } from "react";
import { useForm } from "react-hook-form";
import FileDragAndDrop from "../ProjectCreate/FileDragAndDrop";
import data from "../../data/countries";
const ProfileSettingsForm = () => {
  const countryList = data ? JSON.parse(JSON.stringify(data.countries)) : [];
  const [stateList, setStateList] = useState(countryList[0].states);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  function handleCountrySelect(event) {
    const selectedCountry = event.target.value;
    const country = countryList.find((x) => x.country === selectedCountry);
    if (country) {
      setStateList(country.states);
    } else {
      setStateList([]);
    }
  }
  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <div class="grid justify-items-center my-24">
      <h1 className="text-5xl font-bold mb-16">PROFILE</h1>
      <form className="w-full max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
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
              <div class="relative z-2 top-24 right-8 w-12 h-12 rounded-full bg-[#0AB4AF] mr-1">
                <div className="text-center justify-center text-white pt-3">
                  <i class="fa fa-camera fa-lg" aria-hidden="true"></i>
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
              for="grid-first-name"
            >
              First Name
            </label>
            <input
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="first-name"
              name="firstName"
              type="text"
              placeholder=""
            />
            <p className="hidden text-red-500 text-xs italic">
              Please fill out this field.
            </p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block tracking-wide text-gray-700 text-s font-bold mb-2"
              for="last-name"
            >
              Last Name
            </label>
            <input
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="last-name"
              name="lastName"
              type="text"
              placeholder=""
            />
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label
              className="block tracking-wide text-gray-700 text-s font-bold mb-2"
              for="display-name"
            >
              Display Name
            </label>
            <input
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="display-name"
              name="displayName"
              type="text"
              placeholder=""
            />
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              for="email-address"
            >
              E-mail Address
            </label>
            <input
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="email-address"
              name="emailAddress"
              type="email"
              placeholder=""
            />
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              for="cover-photo"
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
              for="roll"
            >
              Roll
            </label>
            <input
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="roll"
              name="roll"
              type="text"
              placeholder=""
            />
          </div>
          <div className="px-3">
            <div className="h-8 w-auto boarder rounded bg-gray-100">
              <div className="flex flex-row">
                <div className="pr-4 pl-2 pt-1">ROLL</div>
                <div className="border-l border-white px-1">
                  <i class="fa fa-times-thin fa-2x" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              for="location-country"
            >
              Location Country
            </label>
            <div className="relative">
              <select
                className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="location-country"
                name="locationCountry"
                onChange={handleCountrySelect}
              >
                {countryList &&
                  countryList.map((data, index) => (
                    <option value={data.country}>{data.country}</option>
                  ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              for="location-area"
            >
              Location Area
            </label>
            <div className="relative">
              <select
                className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="location-area"
                name="locationArea"
              >
                {stateList &&
                  stateList.map((stat) => <option value={stat}>{stat}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              for="comment"
            >
              Comment, Biography
            </label>
            <textarea
              rows="6"
              class="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white resize-none"
            ></textarea>
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full md:w-1/4 px-3">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              for="snc"
            >
              SNC
            </label>
            <div className="relative">
              <select
                className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="snc"
                name="snc"
              >
                <option>Facebook</option>
                <option>Twitter</option>
                <option>Insta</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"></div>
            </div>
          </div>
          <div className="w-full md:w-3/4 px-3">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              for="snc-url"
            >
              &nbsp;
            </label>
            <input
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="snc-url"
              name="sncUrl"
              type="text"
              placeholder="URL"
            />
          </div>
        </div>

        <div className="flex flex-wrap mb-6">
          <div className="w-full">
            <div
              id="userDropDown"
              className="w-full rounded divide-y divide-zinc-300 float-right px-3"
            >
              <div className="flex flex-wrap w-full">
                <div className="w-full md:w-2/6">
                  <label
                    className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
                    for="website"
                  >
                    Website
                  </label>
                  <input
                    className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="website"
                    name="website"
                    type="text"
                    placeholder="Link Title"
                  />
                </div>
                <div className="w-full md:w-4/6 pl-5">
                  <label
                    className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
                    for="website-url"
                  >
                    &nbsp;
                  </label>
                  <input
                    className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    id="website-url"
                    name="websiteUrl"
                    type="text"
                    placeholder="URL"
                  />
                </div>
              </div>
              <div className="w-full py-4 grid grid-cols-3">
                <div>Portfolio</div>
                <div>https://www.123456789.com/</div>
                <div className="text-gray-500 text-right">
                  <i class="fa fa-times" aria-hidden="true"></i>
                </div>
              </div>
              <div className="w-full py-4 grid grid-cols-3">
                <div>Website</div>
                <div>https://www.iwanttoeatdonuts.net/</div>
                <div className="text-gray-500 text-right">
                  <i class="fa fa-times" aria-hidden="true"></i>
                </div>
              </div>
              <div className="w-full py-4 grid grid-cols-3">
                <div>ONLINE SHOP</div>
                <div>https://pop.donutspower.jp/</div>
                <div className="text-gray-500 text-right">
                  <i class="fa fa-times" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3 grid grid-cols-3">
            <div></div>
            <div>
              <input
                type="button"
                className="h-12 w-48 rounded bg-[#0ab4af] text-white pl-0 hover:bg-[#192434] cursor-pointer"
                value="SAVE"
              />
            </div>
            <div></div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default ProfileSettingsForm;
