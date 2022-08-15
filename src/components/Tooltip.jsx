import React from "react";
import TooltipIcon from "assets/images/createDAO/tooltip.svg";
import ReactTooltip from "react-tooltip";
export default function Tooltip() {
  return (
    <div className="relative">
      <img
        className="h-[15px] w-[15px] cursor-pointer mr-[6px] "
        data-tip="This field is can’t be changed once your contract created"
        src={TooltipIcon}
        alt=""
      />
      <ReactTooltip place="top" type="info" effect="solid" />
    </div>
  );
}
