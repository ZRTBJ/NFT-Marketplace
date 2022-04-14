import React from "react";
import { useForm } from "react-hook-form";

const CreatePoll = (props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    debugger;
  };

  function generateYearOption() {
    const year = [];

    let startYear = new Date().getFullYear();

    for (let i = 0; i <= 10; i++) {
      year.push(<option value={startYear}>{startYear}</option>);
      startYear++;
    }
    return year;
  }

  function generateDayOption() {
    const days = [];

    for (let i = 1; i <= 31; i++) {
      days.push(<option value={i}>{i}</option>);
    }
    return days;
  }

  function generateDayHour() {
    const hours = [];

    for (let i = 0; i <= 23; i++) {
      hours.push(
        <option value={i.toString().padStart(2, "0")}>
          {i.toString().padStart(2, "0")}
        </option>
      );
    }
    return hours;
  }

  function generateDayMin() {
    const mins = [];

    for (let i = 0; i <= 59; i++) {
      mins.push(
        <option value={i.toString().padStart(2, "0")}>
          {i.toString().padStart(2, "0")}
        </option>
      );
    }
    return mins;
  }

  return (
    <div className="mt-8 mx-0 xl:mx-24">
      <form
        id="new-post"
        name="newPostForm"
        className="w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label
              className="block tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="title"
            >
              Title (<span className="text-red-500">*</span>)
            </label>
            <input
              className={`block w-full border ${
                errors.title ? "border-red-500" : "border-zinc-300"
              } rounded py-3 px-4 mb-3 leading-tight ${
                errors.title ? "focus:border focus:border-red-500" : ""
              }`}
              id="title"
              name="title"
              type="text"
              placeholder=""
              {...register("title", {
                required: "Title is required.",
              })}
              defaultValue={""}
            />
            {errors.title && (
              <p className="text-red-500 text-xs font-medium">
                {errors.title.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label className="block  tracking-wide text-gray-700 text-s font-bold mb-2">
              Due date
            </label>
            <div className="flex w-full">
              <div className="relative">
                <select
                  className="block w-full sm:w-32 border border-zinc-300 rounded focus:outline-none"
                  id="year"
                  name="year"
                  {...register("year")}
                >
                  {generateYearOption()}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"></div>
              </div>
              <div className="relative ml-4">
                <select
                  className="block w-full sm:w-36 border border-zinc-300 rounded focus:outline-none"
                  id="month"
                  name="month"
                  {...register("month")}
                >
                  <option>January</option>
                  <option>February</option>
                  <option>March</option>
                  <option>April</option>
                  <option>May</option>
                  <option>June</option>
                  <option>July</option>
                  <option>August</option>
                  <option>September</option>
                  <option>October</option>
                  <option>November</option>
                  <option>December</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"></div>
              </div>
              <div className="relative ml-4">
                <select
                  className="block w-full sm:w-24 border border-zinc-300 rounded focus:outline-none"
                  id="day"
                  name="day"
                  {...register("day")}
                  defaultValue={"1"}
                >
                  {generateDayOption()}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"></div>
              </div>
              <div className="hidden xl:block">
                <div className="inline-flex ml-4">
                  <div className="mt-2 mr-2">TIME</div>
                  <select
                    className="block w-full sm:w-24 border border-zinc-300 rounded focus:outline-none"
                    id="hour"
                    name="hour"
                    {...register("hour")}
                    defaultValue={"01"}
                  >
                    {generateDayHour()}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"></div>
                </div>
                <div className="inline-flex ml-4">
                  <div className="mt-2 mr-2">:</div>
                  <select
                    className="block w-full sm:w-24 border border-zinc-300 rounded focus:outline-none"
                    id="minute"
                    name="minute"
                    {...register("minute")}
                    defaultValue={"30"}
                  >
                    {generateDayMin()}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="block xl:hidden flex flex-wrap mb-6">
          <div className="inline-flex ml-4">
            <div className="mt-2 mr-2">TIME</div>
            <select
              className="block w-full sm:w-24 border border-zinc-300 rounded focus:outline-none"
              id="hour"
              name="hour"
              {...register("hour")}
              defaultValue={"01"}
            >
              {generateDayHour()}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"></div>
          </div>
          <div className="inline-flex ml-4">
            <div className="mt-2 mr-2">:</div>
            <select
              className="block w-full sm:w-24 border border-zinc-300 rounded focus:outline-none"
              id="minute"
              name="minute"
              {...register("minute")}
              defaultValue={"30"}
            >
              {generateDayMin()}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"></div>
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="location-country"
            >
              Amount you want to withdraw?
            </label>
            <input
              className={`block w-full border ${
                errors.amount ? "border-red-500" : "border-zinc-300"
              } rounded py-3 px-4 mb-3 leading-tight ${
                errors.amount ? "focus:border focus:border-red-500" : ""
              }`}
              id="amount"
              name="amount"
              type="text"
              placeholder=""
              {...register("amount", {
                required: "amount is required.",
              })}
              defaultValue={""}
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="location-area"
            >
              &nbsp;
            </label>
            <div className="relative flex">
              <div className="mt-3 mr-4">MATIC</div>
              <div className="flex bg-gray-200 rounded h-11 pr-2">
                <div className="px-2 mt-3 text-[#0ab4af]">BALANCE</div>
                <div className="mt-2">
                  <span className="text-xl font-medium">0</span>
                  <span className="text-sm font-medium">K</span>
                </div>
                <div className="mx-2 mt-4 text-[10px] font-medium">MATIC</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label
              className="block tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="withdraw"
            >
              Withdrawal destination (<span className="text-red-500">*</span>)
            </label>
            <input
              className={`block w-full border ${
                errors.withdraw ? "border-red-500" : "border-zinc-300"
              } rounded py-3 px-4 mb-3 leading-tight ${
                errors.withdraw ? "focus:border focus:border-red-500" : ""
              }`}
              id="withdraw"
              name="withdraw"
              type="text"
              placeholder=""
              {...register("withdraw", {
                required: "Withdrawal destination is required.",
              })}
              defaultValue={""}
            />
            {errors.withdraw && (
              <p className="text-red-500 text-xs font-medium">
                {errors.withdraw.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label
              className="block  tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="comment"
            >
              Comment
            </label>
            <textarea
              rows="3"
              id="comment"
              name="comment"
              {...register("comment")}
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none resize-none"
            ></textarea>
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3 grid grid-cols-4 gap-8">
            <div></div>
            <div>
              <button
                type="button"
                className="h-12 w-24 xl:w-32  rounded bg-[#0ab4af] text-white pl-0 hover:bg-[#192434] cursor-pointer"
                onClick={props.closeNewPost}
              >
                CANCEL
              </button>
            </div>
            <div>
              <button
                type="submit"
                className="h-12 w-24 xl:w-32  rounded bg-[#0ab4af] text-white pl-0 hover:bg-[#192434] cursor-pointer"
              >
                PUBLISH
              </button>
            </div>
            <div></div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePoll;
