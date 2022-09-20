import styles from "./style.module.css";
import Edit from "assets/images/icons/edit.svg";
import Trash from "assets/images/icons/trash.svg";
import Left from "assets/images/icons/chevron-left.svg";
import Right from "assets/images/icons/chevron-right.svg";
import { useState, useEffect } from "react";
import { set } from "date-fns";
import MemeberListMobile from "../MemberListMobile/MemberListMobile";

const MemberListTable = ({
  headers,
  list,
  isEdit,
  setIsEdit,
  handleValueChange,
  handleAutoFill,
  isOwner,
}) => {
  const [items, setItems] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [address, setAddress] = useState("");
  const [percentage, setPercentage] = useState();

  useEffect(() => {
    setItems(list);
  }, []);

  const addNewContributorField = () => {
    let value = { eoa: "", royalty_percent: 0, type: "new" };
    setNewItems([...newItems, value]);
  };

  const addNewContributorData = (data) => {
    let value = { eoa: address, royalty_percent: percentage, type: "new" };
    setItems([...items, value]);
    setNewItems([]);
    setAddress("");
    setPercentage("");
  };

  const removeContributorField = () => {
    setNewItems([]);
    setAddress("");
    setPercentage("");
  };

  return (
    <>
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
                  index < list.length - 1 ? "border-b" : ""
                } text-left text-[13px]`}
              >
                <td className="py-4 px-5">{r.eoa}</td>
                {/* <td className="py-4 px-5">{r.email}</td> */}
                <td className={`py-4 px-5 flex items-center`}>
                  {isEdit === r.id && isOwner ? (
                    <div className="w-[75px] mr-2">
                      <input
                        type="number"
                        value={r.royalty_percent}
                        style={{ padding: "5px 10px" }}
                        onChange={(e) => handleValueChange(e, r.id)}
                      />
                    </div>
                  ) : (
                    <span className="w-[40px]">
                      {r.royalty_percent ? `${r.royalty_percent}%` : "-"}
                    </span>
                  )}
                  {isOwner && (
                    <>
                      {isEdit === r.id ? (
                        <div>
                          <i
                            class="fa-solid fa-check bg-green-400 rounded-[4px] text-white flex items-center justify-center h-[24px] w-[24px] text-[20px] cursor-pointer"
                            onClick={handleAutoFill}
                          ></i>
                          <i
                            class="fa-solid fa-xmark bg-red-400 rounded-[4px] text-white flex items-center justify-center h-[24px] w-[24px] text-[20px] cursor-pointer"
                            onClick={() => setIsEdit(null)}
                          ></i>
                        </div>
                      ) : (
                        <img
                          src={Edit}
                          alt="edit"
                          className="cursor-pointer"
                          onClick={() => setIsEdit(r.id)}
                        />
                      )}
                    </>
                  )}
                </td>
                <td className="py-4 px-5">{r.display_name}</td>
                {/* <td className={`py-4 px-5`}>{r.token_id ? r.token_id : "-"}</td> */}
                <td className={`py-4 px-5`}>
                  <p
                    className={`text-[13px] bg-opacity-[0.2] py-1 px-2 w-fit rounded-[4px] font-bold ${
                      r.is_owner
                        ? "text-info-1 bg-[#46A6FF]"
                        : " text-success-1 bg-[#32E865]"
                    }`}
                  >
                    {r.is_owner ? "Owner" : "Contributor"}
                  </p>
                </td>
                <td className="py-4 px-5">
                  <div className="w-[32px] h-[32px] bg-[#FF3C3C] rounded-[4px] flex items-center justify-center cursor-pointer">
                    <img src={Trash} alt="delete" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <div className='flex items-center justify-center mt-10 w-fit mx-auto'>
        <div className='w-[32px] h-[32px] bg-[#9A5AFF] bg-opacity-[0.1] flex align-items justify-center'>
          <img src={Left} alt='Previous' className='w-[8px]' />
        </div>
        <p className='mx-3'>1</p>
        <p className='mx-3'>2</p>
        <p className='mx-3'>3</p>
        <p className='mx-3'>4</p>
        <div className='w-[32px] h-[32px] bg-[#9A5AFF] bg-opacity-[0.1] flex align-items justify-center'>
          <img src={Right} alt='Next' className='w-[8px]' />
        </div>
      </div> */}
      </div>
      <div className="block md:hidden">
        <MemeberListMobile
          list={items}
          // handlePublish={setShowPublish}
          setIsEdit={setIsEdit}
          isEdit={isEdit}
          handleValueChange={handleValueChange}
          handleAutoFill={handleAutoFill}
          // isOwner={CollectionDetail?.is_owner}
        />
      </div>
      <div className="mb-4">
        {newItems.length ? (
          <div className="flex items-center ml-0 md:ml-4">
            <div class="w-[250px] mr-8">
              <input
                id={"address"}
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Add Wallet Address or ENS"
                class="w-full bg-secondary rounded-[6px] text-[12px] px-[10px] py-[14px] text-text-base"
              />
            </div>
            <div class="w-[150px] mr-8 relative">
              <input
                id={"percentage"}
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="-"
                class="w-full bg-secondary rounded-[6px] text-[12px] px-[10px] py-[14px] text-text-base"
              />
              <p className="absolute top-3 right-4">%</p>
            </div>
            <button
              className="outlined-button font-satoshi-bold"
              onClick={addNewContributorData}
            >
              <span>Add</span>
            </button>
            <i
              class="fa-regular fa-xmark-large ml-5 cursor-pointer"
              onClick={removeContributorField}
            ></i>
          </div>
        ) : null}
      </div>
      <button
        className="outlined-button font-satoshi-bold ml-0 md:ml-4"
        onClick={addNewContributorField}
      >
        <span>Add More</span>
      </button>
    </>
  );
};

export default MemberListTable;
