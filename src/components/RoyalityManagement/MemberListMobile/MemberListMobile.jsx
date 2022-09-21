import Trash from "assets/images/icons/trash.svg";

const MemeberListMobile = ({ list }) => {
  return (
    <div>
      {list.map((item, index) => (
        <div
          key={index}
          className={`${index < list.length - 1 ? "border-b" : ""} pb-4 mb-4`}
        >
          <div className="flex items-center justify-between">
            <div className="mb-3">
              <p className="text-[14px] font-bold">Wallet Address</p>
              <p className="text-[13px] mt-0">{item.user_eoa}</p>
            </div>
            <div className="w-[32px] h-[32px] bg-[#FF3C3C] rounded-[4px] flex items-center justify-center cursor-pointer">
              <img src={Trash} alt="delete" />
            </div>
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
