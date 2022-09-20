import styles from "./style.module.css";
import Polygon from "assets/images/network/polygon.svg";
import manImg from "assets/images/image-default.svg";
import { useState } from "react";

const headers = [
  {
    id: 0,
    label: "Items",
  },
  {
    id: 1,
    label: "Price",
  },
  {
    id: 2,
    label: "Qty",
  },
  {
    id: 3,
    label: "Buyer",
  },
  {
    id: 4,
    label: "Date",
  },
];

const time = ["Day", "Week", "Month"];

const NFTSales = ({ items }) => {
  const [selectedTime, setSelectedTime] = useState("Day");
  return (
    <div>
      <div className="flex items-start md:items-center pb-7 border-b-[1px] mb-6 border-[#E3DEEA]">
        <h3 className="text-[18px] font-black mr-10">NFT Sale's</h3>
        <div className="bg-primary-100 rounded-[6px] p-2 ">
          {time.map((item) => (
            <button
              className={`text-[12px] text-textSubtle rounded-[6px] px-4 py-2 transition duration-150 ease-linear ${
                selectedTime === item ? "bg-primary-900 text-white" : ""
              }`}
              onClick={() => setSelectedTime(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto relative hidden md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="text-textSubtle text-[12px] ">
              {headers.map((item) => (
                <th
                  scope="col"
                  className={`px-5 text-[14px] text-[#303548] ${styles.tableHeader}`}
                  key={item.id}
                >
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((r, index) => (
              <tr
                key={r.id}
                className={`${
                  index < items.length - 1 ? "border-b" : ""
                } text-left text-[13px]`}
              >
                <td className="py-4 px-5">
                  <div className="flex items-center">
                    <img src={manImg} alt="nft" className="h-[33px] w-[33px]" />{" "}
                    <span className="ml-2">{r.name}</span>
                  </div>
                </td>
                <td className="py-4 px-5">
                  <div className="flex items-center">
                    <span> {r.price ? r.price : "-"}</span>
                    <img src={Polygon} alt="network" className="ml-2" />
                  </div>
                </td>
                <td className="py-4 px-5">{r.qty}</td>
                <td className={`py-4 px-5`}>{r.buyer ? r.buyer : "-"}</td>
                <td className="py-4 px-5">
                  <span>cool</span>
                </td>
                {/* <td className="py-4 px-5 flex items-center">
                <span> {r.price ? r.price : "-"}</span>
                <img src={Polygon} alt="network" className="ml-2" />
              </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NFTSales;
