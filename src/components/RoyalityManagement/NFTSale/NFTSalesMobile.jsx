import manImg from "assets/images/image-default.svg";
import Polygon from "assets/images/network/polygon.svg";

const NFTSalesMobile = ({ items }) => {
  return (
    <div>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`${
            index < items.length - 1 ? "border-b" : ""
          } text-left text-[13px] pt-4 pb-2`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[14px] text-[#303548] pb-2 block">
                Items
              </span>
              <div className="flex items-center">
                <img src={manImg} alt="nft" className="h-[33px] w-[33px]" />{" "}
                <span className="ml-2">{item.name}</span>
              </div>
            </div>
            <div>
              <span className="text-[14px] text-[#303548] pb-2 block">
                Price
              </span>
              <div className="flex items-center">
                <span> {item.price ? item.price : "-"}</span>
                <img src={Polygon} alt="network" className="ml-2" />
              </div>
            </div>
            <div>
              <span className="text-[14px] text-[#303548] pb-2 block">Qty</span>
              <span>{item.qty}</span>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div>
              <span className="text-[14px] text-[#303548] pb-2 block">
                Buyer
              </span>
              <span>{item.buyer ? item.buyer : "-"}</span>
            </div>
            <div className="ml-10">
              <span className="text-[14px] text-[#303548] pb-2 block">
                Date
              </span>
              <span>cool</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NFTSalesMobile;
