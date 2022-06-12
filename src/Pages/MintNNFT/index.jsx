import ErrorModal from "components/modalDialog/ErrorModal";
import SuccessModal from "components/modalDialog/SuccessModal";
import ProjectEditTopNavigationCard from "components/ProjectEdit/ProjectEditTopNavigationCard";
import { useState } from "react";
import { useForm } from "react-hook-form";

const MintNFT = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {};

  return (
    <div>
      <div className="sticky z-[1]">
        <ProjectEditTopNavigationCard />
      </div>
      <div className={`grid justify-items-center my-24`}>
        {isLoading && <div className="loading"></div>}
        <h1 className="text-5xl font-bold mb-16">Create New Item</h1>
        <form
          id="profile-setting"
          name="profileSettingForm"
          className="w-full max-w-2xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-wrap mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-gray-700 text-s font-bold mb-2"
                htmlFor="name"
              >
                Name (<span className="text-red-500">*</span>)
              </label>
              <input
                className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                {...register("name", {
                  required: "Name is required.",
                })}
                defaultValue={""}
              />
              {errors.name && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-gray-700 text-s font-bold mb-2"
                htmlFor="externalLink"
              >
                External Link
              </label>
              <input
                className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                id="externalLink"
                name="externalLink"
                type="text"
                placeholder="URL etc"
                {...register("externalLink")}
                defaultValue={""}
              />
              {errors.externalLink && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.externalLink.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-gray-700 text-s font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <small>
                The description will be included on the item's detail page
                underneath its image. Markdown syntax is supported.
              </small>
              <input
                className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                id="description"
                name="description"
                type="text"
                placeholder="URL etc"
                {...register("description")}
                defaultValue={""}
              />
              {errors.description && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-gray-700 text-s font-bold mb-2"
                htmlFor="collection"
              >
                Collection
              </label>
              <small>
                CollectionThis is the collection where your item will appear.
              </small>
              <input
                className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                id="collection"
                name="collection"
                type="text"
                placeholder="Choose your collection"
                {...register("collection")}
                defaultValue={""}
              />
              {errors.collection && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.collection.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-gray-700 text-s font-bold mb-2"
                htmlFor="supply"
              >
                Supply
              </label>
              <small>
                The number of items that can be minted. No gas cost to you!.
              </small>
              <input
                className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                id="supply"
                name="supply"
                type="text"
                placeholder=""
                {...register("supply")}
                defaultValue={""}
              />
              {errors.supply && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.supply.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-gray-700 text-s font-bold mb-2"
                htmlFor="blockchain"
              >
                Blockchain
              </label>
              <input
                className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                id="blockchain"
                name="blockchain"
                type="text"
                placeholder="Polygon"
                {...register("blockchain")}
                defaultValue={""}
              />
              {errors.blockchain && (
                <p className="text-red-500 text-xs font-medium">
                  {errors.blockchain.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap mb-6">
            <div className="w-full px-3 grid grid-cols-3">
              <div></div>
              <div>
                <button
                  type="submit"
                  className="h-12 w-32 sm:w-48  rounded bg-[#0ab4af] text-white pl-0 hover:bg-[#192434] cursor-pointer"
                >
                  CREATE
                </button>
              </div>
              <div></div>
            </div>
          </div>
        </form>
        {showSuccessModal && (
          <SuccessModal
            handleClose={setShowSuccessModal}
            show={showSuccessModal}
          />
        )}
        {showErrorModal && (
          <ErrorModal handleClose={setShowErrorModal} show={showErrorModal} />
        )}
      </div>
    </div>
  );
};
export default MintNFT;
