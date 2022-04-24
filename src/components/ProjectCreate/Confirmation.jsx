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
                <strong>This is the first item's accordion body.</strong> It is
                shown by default, until the collapse plugin adds the appropriate
                classes that we use to style each element. These classes control
                the overall appearance, as well as the showing and hiding via
                CSS transitions. You can modify any of this with custom CSS or
                overriding our default variables. It's also worth noting that
                just about any HTML can go within the{" "}
                <code>.accordion-body</code>, though the transition does limit
                overflow.
              </div>
            </div>
          </div>
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
              <div className="accordion-body py-4 px-5">OUTLINE</div>
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
              <div className="accordion-body py-4 px-5">TOKEN SETTING</div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
