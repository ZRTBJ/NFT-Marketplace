/* eslint-disable react-hooks/exhaustive-deps */
import "assets/css/CreateProject/Outline.css";

import { useState, useEffect } from "react";

import { getProjectCategory } from "services/project/projectService";
import Tooltip from "components/Tooltip";

export default function Outline({
  // logo
  logoLabel,
  coverPhotoUrl,

  // name
  nameLabel,
  projectName,

  // Dao symbol
  showDaoSymbol,
  daoSymbol,

  // Dao wallet
  showDaoWallet,
  daoWallet,

  // overview
  overview,

  // photo
  photosUrl,

  // webLinks
  webLinks,

  // category
  projectCategoryName,

  // Blockchain
  blockchainCategory,
}) {
  return (
    <>
      <h2 className="mb-4">Preview</h2>
      {/* Logo */}
      <div>
        <p className="text-[14px] black-shade-900 ">{logoLabel}</p>
        <div className="w-[131px] mb-[25px]">
          {coverPhotoUrl === "" ? (
            <p className="text-textSubtle">No Logo</p>
          ) : (
            <div className="relative w-[100px]">
              <img
                className="h-[85px] w-[85px] rounded-full block object-cover"
                src={coverPhotoUrl.path}
                alt="coverPreview"
              />
            </div>
          )}
        </div>
      </div>

      {/* name */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center">
          {/* <Tooltip></Tooltip> */}
          <div className="txtblack text-[14px]">{nameLabel}</div>
        </div>
        <p className="text-textSubtle">{projectName}</p>
      </div>

      {/* Dao Symbol */}
      {showDaoSymbol && (
        <div className="mb-6" id="daoSymbol">
          <div className="flex flex-wrap items-center">
            {/* <Tooltip></Tooltip> */}
            <div className="txtblack text-[14px]">DAO Symbol</div>
          </div>
          <p className="text-textSubtle">{daoSymbol}</p>
        </div>
      )}

      {/* Dao Wallet */}
      {showDaoWallet && (
        <div className="mb-6">
          <div className="flex flex-wrap items-center">
            {/* <Tooltip></Tooltip> */}
            <div className="txtblack text-[14px]">DAO Wallet</div>
          </div>
          <p className="text-textSubtle">{daoWallet}</p>
        </div>
      )}

      {/* overview */}
      <div className="mb-6">
        <div className="txtblack text-[14px]">Description</div>
        <p className="text-textSubtle">
          {overview === "" ? "No description" : overview}
        </p>
      </div>

      {/* photo */}
      <div>
        <div className="txtblack text-[14px] mb-[6px]">Gallery Picture</div>
        <div className="md:flex flex-wrap mb-6">
          <div className="photoPreviewContainer flex flex-wrap">
            {photosUrl.length === 0 ? (
              <p className="text-textSubtle">No Files</p>
            ) : (
              <>
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
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* web Links*/}
      <div className="mb-3">
        <div className="txtblack text-[14px] mb-[6px]">Social Link</div>
        <div className="">
          {webLinks.map((link, index) => (
            <div key={index} className="inline-flex items-center w-full my-2">
              <i
                className={` ${
                  link.title.startsWith("customLinks")
                    ? `fa-solid fa-${link.icon}`
                    : `fa-brands fa-${link.icon}`
                }  text-[24px] text-primary-900  mr-2`}
              ></i>
              <p
                className={`block w-full   text-[14px] text-textSubtle rounded  pl-3  outline-none`}
              >
                {link.value === "" ? "https://" : link.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* category */}
      <div className="mb-6">
        <div className="txtblack text-[14px] mb-[6px] ">Category</div>
        <p className="text-textSubtle">{projectCategoryName}</p>
      </div>

      {/* blockchain */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center">
          {/* <Tooltip></Tooltip> */}
          <div className="txtblack text-[14px] mb-[6px]">Blockchain</div>
        </div>
        <p className="text-textSubtle">{blockchainCategory}</p>
      </div>
    </>
  );
}
