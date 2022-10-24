import React from "react";
import TooltipIcon from "assets/images/createDAO/tooltip.svg";
import ReactTooltip from "react-tooltip";
export default function Tooltip({
  message = "This field will not be changeable after publishing on the blockchain.",
}) {
  return (
    <div className="relative">
      <img
        className="h-[15px] w-[15px] cursor-pointer mr-[6px] "
        data-tip={message}
        src={TooltipIcon}
        alt=""
      />
      <ReactTooltip place="top" type="info" effect="solid" />
    </div>
  );
}
