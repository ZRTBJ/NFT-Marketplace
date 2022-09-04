import Modal from "../Modal";
import { useForm } from "react-hook-form";
import { useState } from "react";

const TransferFundModal = ({ handleClose, show, onSubmitData, projectId }) => {
  const [isAmountError, setIsAmountError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (
      !data.amount ||
      isNaN(Number(data.amount)) ||
      Number(data.amount) <= 0
    ) {
      setIsAmountError(true);
    } else {
      const payload = {
        wallet_address: data.waddress,
        amount: Number(data.amount),
      };
      onSubmitData(payload);
    }
  };

  return (
    <Modal
      width={770}
      show={show}
      handleClose={handleClose}
      style={{ backgroundColor: "#fff" }}
      showCloseIcon={true}
    >
      <div>
        <h3 className="text-[28px] text-black font-black">Transfer Funds</h3>
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
  );
};

export default TransferFundModal;
