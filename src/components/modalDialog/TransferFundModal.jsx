import Modal from "../Modal";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { setSalesPage } from "services/nft/nftService";

import ErrorModal from "./ErrorModal";

import SuccessModal from "./SuccessModal";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import getUnixTime from "date-fns/getUnixTime";

const TransferFundModal = ({ handleClose, show, successClose }) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAmountError, setIsAmountError] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (
      !data.amount ||
      Number(data.amount) === NaN ||
      Number(data.amount) <= 0
    ) {
      setIsAmountError(true);
    } else {
      successClose();
    }

    // const payload = {
    //   price: data["price"],
    //   startTime: getUnixTime(dateRange[0].startDate),
    //   endTime: getUnixTime(dateRange[0].endDate),
    //   reserve_EOA: data["eoa"],
    //   collectionType: collectionType,
    //   collectionId: collectionId,
    //   nftId: nftId,
    // };
    // const request = new FormData();
    // request.append("price", data["price"]);
    // request.append("start_time", payload.startTime);
    // request.append("end_time", payload.endTime);
    // request.append("reserve_EOA", data["eoa"]);
    // setIsLoading(true);
    // setSalesPage(collectionType, collectionId, request, nftId)
    //   .then((res) => {
    //     if (res.code === 0) {
    //       console.log(res);
    //       successClose();
    //     } else {
    //       setErrorMessage(res.message);
    //       setShowErrorModal(true);
    //     }
    //     setIsLoading(false);
    //   })
    //   .catch((err) => {
    //     setIsLoading(false);
    //     console.log(err);
    //   });
  };

  return (
    <>
      {isLoading ? (
        <div className="loading"></div>
      ) : (
        <>
          <Modal
            width={770}
            show={show}
            handleClose={handleClose}
            style={{ backgroundColor: "#fff" }}
            showCloseIcon={true}
          >
            <div>
              <h3 className="text-[28px] text-black font-black">
                Transfer Funds
              </h3>
              <div className="mt-2">
                Fill the required field to finish the process
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-8 mb-6 ">
                  <div className="flex items-center mb-2">
                    <div className="txtblack text-[14px]">Amount</div>
                  </div>
                  <>
                    <input
                      id="amount"
                      name="amount"
                      className={`debounceInput mt-1`}
                      defaultValue={""}
                      {...register("amount", {
                        required: "Amount is required.",
                        pattern: /^\d{0,8}(\.\d{1,4})?$/,
                      })}
                      type="text"
                      placeholder="0"
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-xs font-medium">
                        {errors.amount.message}
                      </p>
                    )}
                    {errors.amount && errors.amount.type === "pattern" && (
                      <p className="text-red-500 text-xs font-medium">
                        Invalid amount (example: 0.02).
                      </p>
                    )}
                    {isAmountError && (
                      <p className="text-red-500 text-xs font-medium">
                        Amount can not be 0 or less then 0.
                      </p>
                    )}
                  </>
                </div>
                <div className="mb-6 ">
                  <div className="flex items-center mb-2">
                    <div className="txtblack text-[14px]">Wallet Address</div>
                  </div>
                  <>
                    <input
                      id="waddress"
                      name="waddress"
                      className={`debounceInput mt-1`}
                      defaultValue={""}
                      {...register("waddress", {
                        required: "Wallet address is required.",
                      })}
                      type="text"
                      placeholder="0xfgh...."
                    />
                    {errors.waddress && (
                      <p className="text-red-500 text-xs font-medium">
                        {errors.waddress.message}
                      </p>
                    )}
                  </>
                </div>

                <button
                  type="submit"
                  className="!w-full px-6 py-2 contained-button rounded font-black text-white-shade-900"
                >
                  Transfer Fund
                </button>
              </form>
            </div>
          </Modal>
          {showErrorModal && (
            <ErrorModal
              handleClose={() => {
                setShowErrorModal(false);
                setErrorMessage(null);
              }}
              show={showErrorModal}
              title={"Saving sales information failed !"}
              message={errorMessage}
            />
          )}
        </>
      )}
    </>
  );
};

export default TransferFundModal;
