import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import Trash from "assets/images/icons/trash.svg";
import { walletAddressTruncate } from "util/walletAddressTruncate";

const MemeberListMobile = ({ list }) => {
  return (
    <div>
      {list?.length &&
        list.map((item, index) => (
          <div
            key={index}
            className={`${index < list.length - 1 ? "border-b" : ""} pb-4 mb-4`}
          >
            <div className="flex items-center justify-between">
              <div className="mb-3">
                <p className="text-[14px] font-bold">Wallet Address</p>
                <div className="flex items-center">
                  <p className="text-[13px] mt-0">
                    {walletAddressTruncate(item.user_eoa)}
                  </p>
                  <CopyToClipboard text={item.user_eoa}>
                    <button className="ml-1 w-[32px] h-[32px] rounded-[4px] flex items-center justify-center cursor-pointer text-[#A3D7EF] active:text-black">
                      <FontAwesomeIcon className="" icon={faCopy} />
                    </button>
                  </CopyToClipboard>
                </div>
              </div>
              {item.is_owner ? null : (
                <div className="w-[32px] h-[32px] bg-[#FF3C3C] rounded-[4px] flex items-center justify-center cursor-pointer">
                  <img src={Trash} alt="delete" />
                </div>
              )}
            </div>
            <div className="flex items-center">
              <div className="w-2/6">
                <p className="text-[14px] font-bold">Name</p>
                <p className="text-[13px] mt-0">
                  {item.user_name ? item.user_name : "-"}
                </p>
              </div>
              <div className="w-2/6">
                <p className="text-[14px] font-bold">Percentage</p>
                <p className="text-[13px] mt-0">
                  {item.royalty_percent ? `${item.royalty_percent}%` : "-"}
                </p>
              </div>
              {/* <div className="w-2/6">
              <p className="text-[14px] font-bold">Token ID</p>
              <p className="text-[13px] mt-0">
                {item.token_id ? item.token_id : "-"}
              </p>
            </div> */}
              <div className="w-2/6">
                <p className="text-[14px] font-bold">Roles</p>
                <p
                  className={`text-[13px] mt-0 bg-opacity-[0.2] py-1 px-2 w-fit rounded-[4px] font-bold ${
                    item.is_owner
                      ? "text-info-1 bg-[#46A6FF]"
                      : " text-success-1 bg-[#32E865]"
                  }`}
                >
                  {item.is_owner ? "Owner" : "Contributor"}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MemeberListMobile;
