import Modal from "../Modal";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { setSalesPage } from "services/nft/nftService";
import { cwd } from "process";
import ErrorModal from "./ErrorModal";
import { duration } from "moment";
import SuccessModal from "./SuccessModal";

const SalesPageModal = ({ handleClose, show, collectionId, successClose }) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const duration = data["salesDuration"];
    if (!duration || duration < 1) {
      return;
    }

    const today = new Date();
    const startTime = today.getTime();
    today.setDate(today.getDate() + Number(duration));
    const endTime = today.getTime();

    const request = new FormData();
    request.append("price", data["price"]);
    request.append("start_time", startTime);
    request.append("end_time", endTime);
    request.append("reserve_EOA", data["eoa"]);

    setIsLoading(true);
    setSalesPage(collectionId, request)
      .then((res) => {
        if (res.code === 0) {
          console.log(res);
          successClose();
        } else {
          setErrorMessage(res.message);
          setShowErrorModal(true);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <>
      <Modal
        width={800}
        show={show}
        handleClose={handleClose}
        style={{ backgroundColor: "#fff" }}
        showCloseIcon={true}
      >
        <div className={`${isLoading ? "loading" : ""}`}>
          <h3 className="text-[28px] text-black font-black mb-8">Sales page</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6 ">
              <div className="flex items-center mb-2">
                <div className="txtblack text-[14px]">Price</div>
              </div>
              <>
                <input
                  id="price"
                  name="price"
                  className={`debounceInput mt-1`}
                  defaultValue={""}
                  {...register("price", {
                    required: "Price is required.",
                  })}
                  type="number"
                  placeholder="Enter your price"
                />
                {errors.price && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.price.message}
                  </p>
                )}
              </>
            </div>
            <div className="mb-6 ">
              <div className="flex items-center mb-2">
                <div className="txtblack text-[14px]">Sales Duration</div>
              </div>
              <>
                <select
                  id="salesDuration"
                  name="salesDuration"
                  className={`debounceInput mt-1`}
                  {...register("salesDuration", {
                    required: "Sales Duration is required.",
                  })}
                >
                  <option value={""}>Select Date</option>
                  <option value={1}>Today</option>
                  <option value={7}>This Week</option>
                  <option value={30}>This Month</option>
                  <option value={182}>6 Months</option>
                  <option value={365}>This Year</option>
                </select>
                {errors.salesDuration && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.salesDuration.message}
                  </p>
                )}
              </>
            </div>
            <div className="mb-6 ">
              <div className="flex items-center mb-2">
                <div className="txtblack text-[14px]">
                  Reserve for specific buyer
                </div>
              </div>
              <>
                <input
                  id="eoa"
                  name="eoa"
                  className={`debounceInput mt-1`}
                  defaultValue={""}
                  {...register("eoa", {
                    required: "Reserve for specific buyer is required.",
                  })}
                  type="text"
                  placeholder="0xfdrgj..."
                />
                {errors.eoa && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.eoa.message}
                  </p>
                )}
              </>
            </div>

            <button
              type="submit"
              className="!w-full px-6 py-2 bg-primary-900 rounded font-black text-white-shade-900"
            >
              Submit
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
  );
};

export default SalesPageModal;
