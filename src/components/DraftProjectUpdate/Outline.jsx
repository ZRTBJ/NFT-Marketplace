/* eslint-disable react-hooks/exhaustive-deps */
import "assets/css/CreateProject/Outline.css";
import deleteIcon from "assets/images/projectCreate/ico_delete01.svg";
import FileDragAndDrop from "./FileDragAndDrop";
import { useState, useEffect } from "react";
import { DebounceInput } from "react-debounce-input";
import { getProjectCategory } from "services/project/projectService";
import Tooltip from "components/Tooltip";

export default function Outline({
  // logo
  logoLabel,
  coverPhotoUrl,
  onCoverPhotoSelect,
  onCoverPhotoRemove,

  // name
  nameLabel,
  projectName,
  emptyProjectName,
  alreadyTakenProjectName,
  onProjectNameChange,
  projectNameDisabled,

  // Dao symbol
  showDaoSymbol,
  daoSymbol,
  emptyDaoSymbol,
  daoSymbolDisable,
  onDaoSymbolChange,

  // Dao wallet
  showDaoWallet,
  daoWallet,
  emptyDaoWallet,
  daoWalletDisable,
  onDaoWalletChange,
  // overview
  overview,
  onOverviewChange,

  // photo
  photosUrl,
  onPhotosSelect,
  onPhotosRemove,

  // webLinks
  webLinks,
  onSocialLinkChange,

  // category
  projectCategory,
  emptyProjeCtCategory,
  onProjectCategoryChange,

  // Blockchain
  blockchainCategory,
  onBlockchainCategoryChange,
  blockchainCategoryList,

  // tag
  // tagList,
  // tagLimit,
  // onTagEnter,
  // onTagRemove,
  // need member
  // needMember,
  // onNeedMemberChange,
  // role list
  // roleList,
  // onRoleEnter,
  // onRoleRemove,
}) {
  const [projectCategoryList, setProjectCategoryList] = useState([]);
  useEffect(() => {
    getProjectCategory().then((e) => {
      setProjectCategoryList(e.categories);
    });
  }, []);
  return (
    <>
      {/* Logo */}
      <div>
        <p className="text-[14px] black-shade-900 mb-[15px]">{logoLabel}</p>
        <div className="w-[131px] mb-[25px]">
          {coverPhotoUrl === "" ? (
            <>
              <FileDragAndDrop
                maxFiles={1}
                height="85px"
                width="85px"
                type="logo"
                onDrop={(e) => onCoverPhotoSelect(e)}
                sizePlaceholder=""
                rounded={true}
                maxSize={4000000}
              />
              <div className="text-color-ass-8 text-[12px]  mt-[14px]">
                Add Image/Drag from
              </div>
              <div className=" text-primary-900 text-[12px] font-bold">
                Computer
              </div>
            </>
          ) : (
            <div className="relative w-[100px]">
              <img
                className="h-[85px] w-[85px] rounded-full block object-cover"
                src={coverPhotoUrl.path}
                alt="coverPreview"
              />
              <img
                alt="coverPreviewIc"
                src={deleteIcon}
                onClick={onCoverPhotoRemove}
                className="absolute top-2 cp right-0"
              />
            </div>
          )}
        </div>
      </div>

      {/* name */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center">
          <Tooltip></Tooltip>
          <div className="txtblack text-[14px]">{nameLabel}</div>
        </div>

        {!projectNameDisabled && (
          <>
            <DebounceInput
              minLength={1}
              debounceTimeout={300}
              onChange={(e) => onProjectNameChange(e.target.value)}
              className="debounceInput mt-1"
              value={projectName}
              placeholder={nameLabel}
            />
            {emptyProjectName && (
              <div className="validationTag">
                Unique {nameLabel} is required
              </div>
            )}
            {alreadyTakenProjectName && (
              <div className="validationTag">{nameLabel} has already taken</div>
            )}
          </>
        )}
        {projectNameDisabled && <h3>{projectName}</h3>}
      </div>

      {/* Dao Symbol */}
      {showDaoSymbol && (
        <div className="mb-6" id="daoSymbol">
          <div className="flex flex-wrap items-center">
            <Tooltip></Tooltip>
            <div className="txtblack text-[14px]">DAO Symbol</div>
          </div>
          {!daoSymbolDisable && (
            <>
              <DebounceInput
                minLength={1}
                debounceTimeout={300}
                onChange={(e) => onDaoSymbolChange(e.target.value)}
                className="debounceInput mt-1"
                value={daoSymbol}
                placeholder="e.g : KTL"
              />
              {emptyDaoSymbol && (
                <div className="validationTag">DAO Symbol is required</div>
              )}
            </>
          )}
          {daoSymbolDisable && <h3>{projectName}</h3>}
        </div>
      )}

      {/* Dao Wallet */}
      {showDaoWallet && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center">
            <Tooltip></Tooltip>
            <div className="txtblack text-[14px]">DAO Wallet</div>
          </div>
          {!daoWalletDisable && (
            <>
              <DebounceInput
                minLength={1}
                debounceTimeout={300}
                onChange={(e) => onDaoWalletChange(e.target.value)}
                className="debounceInput mt-1"
                value={daoWallet}
                placeholder="Add Address"
              />
              {emptyDaoWallet && (
                <div className="validationTag">DAO Wallet is required</div>
              )}
            </>
          )}
          {daoSymbolDisable && <h3>{projectName}</h3>}
        </div>
      )}

      {/* overview */}
      <div>
        <div className="txtblack text-[14px]">Description</div>
        <textarea
          value={overview}
          onChange={onOverviewChange}
          className="mb-6"
          name="description"
          id="description"
          cols="30"
          rows="6"
          placeholder="Description"
        ></textarea>
      </div>

      {/* photo */}
      <div>
        <div className="txtblack text-[14px] mb-[6px]">
          Upload Gallery Picture
        </div>
        <div className="text-textSubtle text-[13px] mb-4">
          PNG, GIF, WEBP, MP4 or MP3. Max 100mb.
        </div>
        <div className="md:flex flex-wrap mb-6">
          <div className="w-[158px] mr-3 mb-2">
            <FileDragAndDrop
              maxFiles={4}
              height="158px"
              onDrop={(e) => onPhotosSelect(e, photosUrl)}
              sizePlaceholder="Total upto 16MB"
              disabled={photosUrl.length > 3 ? true : false}
            />
          </div>
          <div className="photoPreviewContainer flex flex-wrap">
            {photosUrl.map((image, index) => (
              <div
                key={`project-image-${index}`}
                className="relative upload-file w-[158px] h-[158px] mr-3  mb-2"
              >
                <img
                  alt=""
                  className="outlinePhoto block object-cover rounded-xl"
                  src={image.path}
                />

                <div className="upload-photo absolute w-full h-full rounded-xl cursor-pointer  items-center justify-center left-0 top-0">
                  <i
                    className="fa-solid fa-trash"
                    onClick={() => onPhotosRemove(image)}
                  ></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* web Links*/}
      <div className="mb-3">
        <div className="txtblack text-[14px] mb-[6px]">Add Social Link</div>
        <div className="">
          {webLinks.map((link, index) => (
            <div key={index} className="inline-flex items-center w-full mb-4">
              <i
                className={` ${
                  link.title.startsWith("customLinks")
                    ? `fa-solid fa-${link.icon}`
                    : `fa-brands fa-${link.icon}`
                }  text-[24px] text-primary-900  mr-2`}
              ></i>
              <input
                className={`block w-full border border-whiteDivider h-[48px] text-[14px] text-textSubtle rounded  pl-3  outline-none`}
                placeholder="https://"
                value={link.value}
                onChange={(event) =>
                  onSocialLinkChange(event.target.value, index)
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* category */}
      <div className="mb-6">
        <div className="txtblack text-[14px] mb-[6px] ">Category</div>
        <select
          value={projectCategory}
          onChange={onProjectCategoryChange}
          name="category"
          className="h-[44px] border border-whiteDivider text-textSubtle bg-white-shade-900 pl-3"
        >
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

      {/* blockchain */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center">
          <Tooltip></Tooltip>
          <div className="txtblack text-[14px] mb-[6px]">Blockchain</div>
        </div>
        <select
          value={blockchainCategory}
          onChange={onBlockchainCategoryChange}
          disabled
          className="h-[44px] border border-whiteDivider text-textSubtle bg-white-shade-900 pl-3"
        >
          <option value={blockchainCategory} defaultValue>
            Polygon
          </option>
          {/* {blockchainCategoryList.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))} */}
        </select>
      </div>

      {/* tags */}
      {/* <div className="flex flex-wrap mb-6">
        <div className="w-full">
          <div className="label">Tags</div>
          <div className="label-grey">Add tags on your project</div>
          <input
            className="outlineTags mb-2"
            type="text"
            placeholder="Type and press enter"
            defaultValue={""}
            onKeyUp={(e) => onTagEnter(e)}
            name="tag"
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
      </div> */}
    </>
  );
}
