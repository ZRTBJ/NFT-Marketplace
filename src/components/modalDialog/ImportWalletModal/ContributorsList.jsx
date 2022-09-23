import manImg from "assets/images/image-default.svg";

const Headers = ["checkbox", "Wallet Address", "Name", "Percentage"];

const ContributorsList = ({
  contributors,
  handleContributorSelect,
  selectAll,
  handleContributorSelectAll,
}) => {
  return (
    <div className="overflow-x-auto relative">
      <table className="w-full text-left">
        <thead>
          <tr className="text-textSubtle text-[12px] ">
            {Headers.map((item) => (
              <th
                scope="col"
                className={`px-5 text-[14px] text-[#303548]`}
                key={item}
              >
                {item !== "checkbox" ? (
                  item
                ) : (
                  <input
                    className="form-check-input appearance-none w-[18px] h-[18px] rounded-[4px] h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleContributorSelectAll}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contributors.map((r, index) => (
            <tr
              key={r.id}
              className={`${
                index < contributors.length - 1 ? "border-b" : ""
              } text-left text-[13px]`}
            >
              <td className="py-4 px-5">
                <input
                  className="form-check-input appearance-none w-[18px] h-[18px] rounded-[4px] h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm"
                  type="checkbox"
                  checked={r.selected}
                  onChange={(e) => handleContributorSelect(e, r.wallet_address)}
                />
              </td>
              <td className="py-4 px-5">
                <div className="flex items-center">
                  <img
                    src={manImg}
                    alt="contributor"
                    className="h-[32px] w-[32px] rounded-[50%]"
                  />
                  <p className="ml-3 truncate w-[170px] text-[12px]">
                    {r.wallet_address}
                  </p>
                </div>
              </td>
              <td className="py-4 px-5 text-[12px]">{r?.name ? r.name : ""}</td>
              <td className={`py-4 px-5 text-[12px]`}>
                {r?.royalty ? r.royalty : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="contained-button font-satoshi-bold w-full mt-4 text-[14px] font-bold">
        Add Wallet
      </button>
    </div>
  );
};

export default ContributorsList;
