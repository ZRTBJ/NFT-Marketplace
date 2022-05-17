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
    <div className="grid justify-items-center">
      <h1 className="text-5xl font-bold mb-16">CONFIRMATION</h1>
      <div className="mt-4 w-full">
        <div className="accordion" id="accordionExample5">
          {/* type */}
          <div className="accordion-item bg-white border border-gray-200">
            <div className="accordion-header mb-0" id="headingOne5">
              <button
                className="
        accordion-button
        relative
        flex
        items-center
        w-full
        py-4
        px-5
        text-base text-gray-800 text-left
        bg-[#f6f6f7]
        border-0
        rounded-none
        transition
        focus:outline-none
      "
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne5"
                aria-expanded="true"
                aria-controls="collapseOne5"
              >
                SELECT TYPE
              </button>
            </div>
            <div
              id="collapseOne5"
              className="accordion-collapse collapse show"
              aria-labelledby="headingOne5"
            >
              <div className="accordion-body py-4 px-5">
                <div>
                  <div className="text-[12px] text-gray-400 mb-[10px]">
                    Driven by (Who can propose?)
                  </div>
                  <div>
                    <p className="font-semibold"> OWNERS</p>
                    <p>
                      The owners who have the governance token can propose only.
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-[12px] text-gray-400 mb-[10px]">
                    Voting Power
                  </div>
                  <div className="font-semibold">{props.votingPower.title}</div>
                </div>
                <div className="mt-6">
                  <div className="text-[12px] text-gray-400 mb-[10px]">
                    Who can vote?
                  </div>
                  <div className="font-semibold">{props.canVote.title}</div>
                </div>
              </div>
            </div>
          </div>
          {/* outline */}
          <div className="accordion-item bg-white border border-gray-200">
            <h2 className="accordion-header mb-0" id="headingTwo5">
              <button
                className="
        accordion-button
        collapsed
        relative
        flex
        items-center
        w-full
        py-4
        px-5
        text-base text-gray-800 text-left
        bg-[#f6f6f7]
        border-0
        rounded-none
        transition
        focus:outline-none
      "
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo5"
                aria-expanded="false"
                aria-controls="collapseTwo5"
              >
                OUTLINE
              </button>
            </h2>
            <div
              id="collapseTwo5"
              className="accordion-collapse collapse"
              aria-labelledby="headingTwo5"
            >
              <div className="accordion-body py-4 px-5">
                <div>
                  <div className="text-[12px] text-gray-400 mb-[10px]">
                    Project name
                  </div>
                  <div className="font-semibold mb-6">{props.projectName}</div>
                  <div className="text-[12px] text-gray-400 mb-[10px]">
                    Cover photo
                  </div>
                  <img
                    src={props.projectCover.path}
                    alt="No cover found"
                    className="h-[162px] w-full max-w-[546px] object-cover mb-6"
                  />
                  <div className="text-[12px] text-gray-400 mb-[10px]">
                    Photos (up to 4)
                  </div>
                  <div className="flex flex-wrap">
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
                </div>
              </div>
            </div>
          </div>
          {/* token settings */}
          <div className="accordion-item bg-white border border-gray-200">
            <h2 className="accordion-header mb-0" id="headingThree5">
              <button
                className="
        accordion-button
        collapsed
        relative
        flex
        items-center
        w-full
        py-4
        px-5
        text-base text-gray-800 text-left
        bg-[#f6f6f7]
        border-0
        rounded-none
        transition
        focus:outline-none
      "
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree5"
                aria-expanded="false"
                aria-controls="collapseThree5"
              >
                TOKEN SETTING
              </button>
            </h2>
            <div
              id="collapseThree5"
              className="accordion-collapse collapse"
              aria-labelledby="headingThree5"
            >
              <div className="accordion-body py-4 px-5">
                <div>
                  <div>Token name</div>
                  <div className="font-semibold">{props.tokenName}</div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="accordion-item bg-white border border-gray-200">
            <h2 className="accordion-header mb-0" id="headingThree5">
              <button
                className="
        accordion-button
        collapsed
        relative
        flex
        items-center
        w-full
        py-4
        px-5
        text-base text-gray-800 text-left
        bg-[#f6f6f7]
        border-0
        rounded-none
        transition
        focus:outline-none
      "
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFour5"
                aria-expanded="false"
                aria-controls="collapseFour5"
              >
                TOKEN CATEGORY ALLOCATION
              </button>
            </h2>
            <div
              id="collapseFour5"
              className="accordion-collapse collapse"
              aria-labelledby="headingThree5"
            >
              <div className="accordion-body py-4 px-5">
                TOKEN CATEGORY ALLOCATION
              </div>
            </div>
          </div>
          <div className="accordion-item bg-white border border-gray-200">
            <h2 className="accordion-header mb-0" id="headingThree5">
              <button
                className="
        accordion-button
        collapsed
        relative
        flex
        items-center
        w-full
        py-4
        px-5
        text-base text-gray-800 text-left
        bg-[#f6f6f7]
        border-0
        rounded-none
        transition
        focus:outline-none
      "
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFive5"
                aria-expanded="false"
                aria-controls="collapseFive5"
              >
                ALLOCATION
              </button>
            </h2>
            <div
              id="collapseFive5"
              className="accordion-collapse collapse"
              aria-labelledby="headingThree5"
            >
              <div className="accordion-body py-4 px-5">ALLOCATION</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
