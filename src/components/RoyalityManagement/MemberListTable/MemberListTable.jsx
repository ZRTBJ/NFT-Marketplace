import styles from "./style.module.css";
import Edit from "assets/images/icons/edit.svg";
import Trash from "assets/images/icons/trash.svg";
import Left from "assets/images/icons/chevron-left.svg";
import Right from "assets/images/icons/chevron-right.svg";

const MemberListTable = ({
  headers,
  list,
  isEdit,
  setIsEdit,
  handleValueChange,
  handleAutoFill,
  isOwner,
}) => {
  return (
    <div className="overflow-x-auto relative mb-[54px] relative">
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
          {list.map((r, index) => (
            <tr
              key={r.id}
              className={`${
                index < list.length - 1 ? "border-b" : ""
              } text-left text-[13px]`}
            >
              <td className="py-4 px-5">{r.eoa}</td>
              <td className="py-4 px-5">{r.display_name}</td>
              <td className="py-4 px-5">{r.email}</td>
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
              <td className={`py-4 px-5`}>{r.eoa ? r.eoa : "-"}</td>
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
              {/* <td className='py-4 px-5'>
                <div className='w-[32px] h-[32px] bg-[#FF3C3C] rounded-[4px] flex items-center justify-center cursor-pointer'>
                  <img src={Trash} alt='delete' />
                </div>
              </td> */}
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
  );
};

export default MemberListTable;
