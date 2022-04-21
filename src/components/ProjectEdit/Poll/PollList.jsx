import React from "react";
import Moment from "moment";

const PollListView = (props) => {
  return (
    <>
      {props.pollList && props.pollList.length > 0 ? (
        <>
          {props.pollList.map((poll, index) => (
            <div className="pt-5" key={`poll-list-${index}`}>
              <div className="flex">
                <span
                  className={`inline-flex items-center justify-center px-3.5 py-1.5 text-sm sm:text-s leading-none border ${
                    poll.status === "success"
                      ? "border-[#0AB4AF]"
                      : poll.status === "failed"
                      ? "border-red-400"
                      : "border-gray-400"
                  } rounded-full`}
                >
                  <span className="font-medium">DUE DATE&nbsp;&nbsp;</span>{" "}
                  {Moment(poll.start_at).format("YYYY/MM/DD")} -
                  {Moment(poll.expire_at).format("YYYY/MM/DD")}
                </span>
                <span className="hidden sm:block ml-4 mt-2">
                  {Moment(poll.updated_at).format("YYYY/MM/DD")}
                </span>
              </div>
              <p className="block sm:hidden mt-1.5">
                {Moment(poll.updated_at).format("YYYY/MM/DD")}
              </p>
              <div className="text-base sm:text-lg font-bold mt-1">
                {poll.title}
              </div>
              <div className="relative bottom-12 text-right text-gray-400">
                <i className="fa fa-angle-right fa-lg sm:fa-2x" />
              </div>
            </div>
          ))}
        </>
      ) : (
        <></>
      )}
      {props.isLoading ? (
        <div className={`h-12 w-full text-center`}>
          <i
            className="fa fa-spinner fa-spin fa-3x text-[#0AB4AF] mt-4 "
            aria-hidden="true"
          ></i>
        </div>
      ) : (
        <>
          {props.total - props.pageSize > 0 ? (
            <div className={`h-12 w-full text-center pt-8`}>
              <span
                className="text-[#0AB4AF] cursor-pointer font-medium"
                onClick={props.getMore}
              >
                See more
              </span>
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};
export default PollListView;
