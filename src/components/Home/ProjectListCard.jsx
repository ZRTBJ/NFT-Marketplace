import likeIcon from "assets/images/profile/ico_like.svg";
import viewIcon from "assets/images/profile/ico_view.svg";
const ProjectListCard = () => {
  return (
    <div
      className="w-[280px] roboto"
      style={{ boxShadow: " 0px 0px 4px #00000024" }}
    >
      <img
        style={{ borderRadius: " 8px 8px 0px 0px" }}
        src="https://dummyimage.com/hd720"
        alt=""
      />
      <div
        style={{ borderRadius: " 0px 0px 8px 8px" }}
        className="bg-[#FFFFFF] pl-4 pr-4"
      >
        <div className="flex mt-[-16px] ">
          {/* <div
            style={{ borderRadius: " 4px 4px 0px 0px" }}
            className="bg-[#FFFFFF] px-4 py-1 text-[10px] roboto font-bold text-[#0AB4AF]"
          >
            COMMING SOON
          </div> */}
          {/* <div
            style={{ borderRadius: " 4px 4px 0px 0px" }}
            className="bg-[#FFFFFF] px-4 py-1 text-[10px] roboto font-bold text-[#8B9199]"
          >
            FIXED MEMBERS
          </div> */}
          <div
            style={{ borderRadius: " 4px 4px 0px 0px" }}
            className="bg-[#FFFFFF] px-4 py-1 text-[10px] roboto font-bold text-[#0AB4AF]"
          >
            JOIN TEAM
          </div>
          <div
            style={{ borderRadius: " 4px 4px 0px 0px" }}
            className="bg-[#FFFFFF] px-4 py-1 text-[10px] ml-5 roboto font-bold text-[#D31B0C]"
          >
            TOKEN SALE
          </div>
        </div>
        <div className="mt-[14px] mb-[28px] text-[#192434] roboto font-bold">
          CAT foot print artwork CAT foot print…
        </div>
        <div className="test-[12px] text-[#192434] mt-[28px] mb-[11px]">
          Moonrise Kingdom is a 2012 American coming-of-age comedy-drama …
        </div>
        <div className="flex mt-[11px] justify-between text-[#192434] text-[10px]">
          <div>0</div>
          <div>1000 TOKEN NAME</div>
        </div>
        <div className="w-full rounded-lg  bg-gray-200 mb-[9px] h-[8px]">
          <div
            className="bg-[#0AB4AF] rounded-lg h-[8px]"
            style={{ width: "45%" }}
          ></div>
        </div>
        <div className="flex justify-between pb-[16px]">
          <div className="w-[100px] pt-[2px] h-[20px] text-center rounded-[12px] border-[1px] text-[10px] border-[#B9CCD5] text-[#192434]">
            Category name
          </div>
          <div className="flex">
            <div className="flex items-center">
              <img height={"24px"} width="24px" src={likeIcon} alt="" />{" "}
              <span className="text-[#192434] text-[14px] ">200</span>
            </div>
            <div className="flex items-center">
              <img height={"24px"} width="24px" src={viewIcon} alt="" />
              <span className="text-[#192434] text-[14px] ">200</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectListCard;
