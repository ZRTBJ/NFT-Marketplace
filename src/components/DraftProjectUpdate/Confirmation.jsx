import React from "react";
import { useForm } from "react-hook-form";

export default function Confirmation(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <div>
      <div>
        <div className="font-bold text-[22px] mb-[6px]">Review</div>
        <div className="text-[#9499AE] text-[12px] mb-[24px]">
          Make sure you have fill the form with right data.
        </div>
        <div className="font-bold mb-[6px]">Project name</div>
        <div className="text-[#9499AE] mb-[12px] text-[12px]">
          Your Project name
        </div>
        <div className="font-black mb-6">{props.projectName}</div>

        <div className=" font-bold mb-[6px]">Photos</div>
        <div className="text-[#9499AE] mb-[12px] text-[12px]">
          Add image up to 4 to showcase your project
        </div>
        <div className="flex flex-wrap mb-6">
          {props.photosUrl.length > 0 ? (
            props.photosUrl.map((i) => (
              <img
                src={i.path}
                key={i.id}
                alt=""
                className="rounded h-[124px] w-[124px] object-cover mr-4 mb-4"
              />
            ))
          ) : (
            <div className="mx-auto">No Photos</div>
          )}
        </div>

        <div className="font-bold mb-[6px]">Cover photo</div>
        <div className="text-[#9499AE] mb-[12px] text-[12px]">
          Add your Cover for project profile
        </div>
        <img
          src={props.projectCover.path}
          alt="No cover found"
          className="h-[162px] w-full max-w-[546px] rounded rounded-[12px] object-cover mb-6"
        />

        <div className="font-bold mb-[6px]">Description</div>
        <div className="text-[#9499AE] mb-[12px] text-[12px]">
          Tell your audience what’s your project about, so they can easily
          understand the project.
        </div>
        <div className="mb-6">{props.overview}</div>

        <div className="font-bold mb-[6px]">Category</div>
        <div className="text-[#9499AE] mb-[12px] text-[12px]">
          What kind of project are you working?
        </div>
        <div className="mb-6 font-black">{props.category}</div>

        <div className="font-bold mb-[6px]">Tags (up to 5)</div>
        <div className="text-[#9499AE] mb-[12px] text-[12px]">
          Your project tags
        </div>
        <div className="mb-6">
          {props.tagList.length < 0 ? (
            <div>No Tags found</div>
          ) : (
            <div className="flex flex-wrap">
              {props.tagList.map((tag) => (
                <div className="bg-[#232032] text-[#9499AE] pr-3 pl-2 mr-2 pt-1 pb-1 mb-3">
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="font-bold text-[22px] mb-[6px]">Token Issue</div>
        <div className="text-[#9499AE] text-[12px] mb-[24px]">
          Your Token Information
        </div>
        <div className="font-bold mb-[6px]">Token name</div>
        <div className="text-[#9499AE] mb-[12px] text-[12px]">
          Your Token name
        </div>
        <div className="font-black  mb-6">{props.tokenName}</div>

        <div className="font-bold mb-[6px]">
          Token symbol (Up to 5 characters)
        </div>
        <div className="text-[#9499AE] mb-[12px] text-[12px]">
          Your token symbol eg: ETH,BTC.CAR,SOL
        </div>
        <div className="font-black mb-6">{props.tokenSymbol}</div>
        <div className="font-bold mb-[6px]">Number of tokens</div>
        <div className="text-[#9499AE] mb-[12px] text-[12px]">
          set your token supply
        </div>
        <div className="font-black mb-6">{props.numberOfTokens}</div>
      </div>
    </div>
  );
}
