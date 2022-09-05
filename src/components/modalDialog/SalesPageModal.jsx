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

const SalesPageModal = ({
  handleClose,
  show,
  collectionId,
  successClose,
  collectionType,
  nftId,
}) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // const duration = data["salesDuration"];
    // if (!duration || duration < 1) {
    //   return;
    // }

    // const today = new Date();
    // const startTime = Math.floor(today.getTime() / 1000);
    // today.setDate(today.getDate() + Number(duration));
    // const endTime = Math.floor(today.getTime() / 1000);
    const payload = {
      price: data["price"],
      startTime: getUnixTime(dateRange[0].startDate),
      endTime: getUnixTime(dateRange[0].endDate),
      reserve_EOA: data["eoa"],
      collectionType: collectionType,
      collectionId: collectionId,
      nftId: nftId,
    };
    const request = new FormData();
    request.append("price", data["price"]);
    request.append("start_time", payload.startTime);
    request.append("end_time", payload.endTime);
    request.append("reserve_EOA", data["eoa"]);

    setIsLoading(true);
    setSalesPage(collectionType, collectionId, request, nftId)
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
            overflow="scroll"
            height={650}
          >
            <div>
              <h3 className="text-[28px] text-black font-black mb-8">
                Sales page
              </h3>
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
                      step="0.01"
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
                    <div className="w-full">
                      <DateRangePicker
                        className="w-full]"
                        onChange={(item) => setDateRange([item.selection])}
                        showSelectionPreview={true}
                        moveRangeOnFirstSelection={false}
                        months={2}
                        ranges={dateRange}
                        direction="horizontal"
                        
                      />
                    </div>
                    {/* <select
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
                </select> */}
                    {/* {errors.salesDuration && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.salesDuration.message}
                  </p>
                )} */}
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
                      {...register("eoa")}
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
      )}
    </>
  );
};

export default SalesPageModal;
