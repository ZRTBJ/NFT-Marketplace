import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import ErrorModal from "./ErrorModal";
import { addDays } from "date-fns";
import getUnixTime from "date-fns/getUnixTime";
import { DateRangePicker } from "rsuite";
import { setSalesPage } from "services/nft/nftService";
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
  const [date, setDate] = useState([new Date(), addDays(new Date(), 7)]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const payload = {
      price: data["price"],
      startTime: getUnixTime(date[0]),
      endTime: getUnixTime(date[1]),
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
  const modalBodyClicked = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {isLoading ? (
        <div className="loading"></div>
      ) : (
        <>
          <div
            data-toggle="modal"
            data-backdrop="static"
            data-keyboard="false"
            className={`${
              show ? "modal display-block" : "modal display-none"
            } z-[2] `}
          >
            <section
              onClick={(e) => modalBodyClicked(e)}
              className={
                " modal-main bg-white rounded-3xl relative txtblack p-11"
              }
            >
              <i
                className="fa fa-xmark cursor-pointer text-xl absolute top-12 right-8 text-black"
                onClick={handleClose}
              ></i>
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
                    <div className=" mb-2">
                      <div className="txtblack text-[14px]">Sales Duration</div>
                    </div>
                    <DateRangePicker
                      placeholder="Select Date Range"
                      value={date}
                      onChange={setDate}
                      format="yyyy-MM-dd HH:mm:ss"
                      preventOverflow={true}
                      defaultOpen={false}
                      placement="auto"
                      showMeridian={true}
                    />
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
            </section>
          </div>

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
