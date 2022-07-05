import Modal from "components/Modal";
import ErrorModal from "components/modalDialog/ErrorModal";
import SuccessModal from "components/modalDialog/SuccessModal";
import ProjectEditTopNavigationCard from "components/ProjectEdit/ProjectEditTopNavigationCard";
import { useState } from "react";
import { useForm } from "react-hook-form";
import dummyImg from "assets/images/dummy-img.svg";

const MintNFT = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [propertyList, setpropertyList] = useState([{ type: "", name: "" }]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => { };

  function addProperty() {
    const tempProperty = [...propertyList];
    tempProperty.push({ type: "", name: "" });
    setpropertyList(tempProperty);
  }

  function removeProperty(index) {
    const tempProperty = [...propertyList];
    tempProperty.splice(index - 1, 1);
    setpropertyList(tempProperty);
  }

  function handleOnChangeType(event, index) {
    const value = event.target.value;
    const property = propertyList[index];
    property.type = value;
  }

  function handleOnChangeName(event, index) {
    const value = event.target.value;
    const property = propertyList[index];
    property.name = value;
  }

  return (
    <>

      <main className="container mx-auto px-4">
        <section className="flex my-9 flex-col md:flex-row text-white">
          <div className="flex-1">
            <h3 className="mb-8">Start build your NFT</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label
                  className="block text-sm font-bold font-satoshi-bold"
                  htmlFor="name"
                >
                  Name
                </label>
                <small className="block text-xs text-color-ass-7 mb-2">Fill the name for your NFT</small>
                <input
                  className="block mb-3"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Name"
                  {...register("name", {
                    required: "Name is required.",
                  })}
                  defaultValue={"Look So Clean #21124"}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  className="block text-sm font-bold font-satoshi-bold"
                  htmlFor="description"
                >
                  Description
                </label>
                <small className="block text-xs text-color-ass-7 mb-2">What this NFT about or story behind this NFT</small>

                <textarea
                  className="block h-32  mb-3"
                  id="description"
                  name="description"
                  placeholder="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here"
                  {...register("description", {
                    required: "Name is required.",
                  })}
                  defaultValue={""}
                >
                </textarea>
                {errors.name && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  className="block text-sm font-bold font-satoshi-bold"
                  htmlFor="blockchain"
                >
                  Blockchain
                </label>
                <small className="block text-xs text-color-ass-7 mb-2">Choose the blockchain you want to use for this NFT</small>
                <div className="icon-blockchain">
                  <input
                    className="block mb-3"
                    id="blockchain"
                    name="blockchain"
                    type="text"
                    placeholder="Polygon"
                    {...register("blockchain")}
                    defaultValue={"Polygon"}
                    disabled={true}
                  />
                  {errors.blockchain && (
                    <p className="text-red-500 text-xs font-medium">
                      {errors.blockchain.message}
                    </p>
                  )}
                </div>

              </div>

              <div className="mb-6">
                <button type="submit" className="btn btn-secondary btn-sm">
                  CREATE
                </button>
              </div>
            </form>
          </div>

          <div className="w-[1px] bg-black-shade-800  mx-11 hidden md:block"></div>

          <div className="flex-1">
            <div className="mb-6">
              <label
                className="block text-sm font-bold font-satoshi-bold"
                htmlFor="dropzone-file"
              >
                Upload Assets
              </label>
              <small className="block text-xs text-color-ass-7 mb-3">You can add your assets up to ??GB, you can user format Jpeg/Mp4/GIF/PNG/Mp3.</small>

              <div class="flex justify-center items-center max-w-full w-40 h-40">
                <label htmlFor="dropzone-file" class="flex flex-col justify-center items-center w-full h-40 bg-black-shade-800 rounded-xl  cursor-pointer">
                  <div class="flex flex-col justify-center items-center pt-5 pb-6">
                    <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path opacity="0.4" d="M27.8167 38.5097H11.4644C5.0695 38.5097 0.773438 34.0245 0.773438 27.3479V11.9373C0.773438 5.2606 5.0695 0.77356 11.4644 0.77356H27.8186C34.2135 0.77356 38.5095 5.2606 38.5095 11.9373V27.3479C38.5095 34.0245 34.2135 38.5097 27.8167 38.5097Z" fill="#9499AE" />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M18.2168 13.368C18.2168 15.9529 16.113 18.0567 13.5281 18.0567C10.9413 18.0567 8.83938 15.9529 8.83938 13.368C8.83938 10.783 10.9413 8.67737 13.5281 8.67737C16.113 8.67737 18.2168 10.783 18.2168 13.368ZM33.6045 23.5805C34.0441 24.0069 34.3592 24.4937 34.5667 25.0126C35.195 26.5824 34.8686 28.4692 34.1969 30.0239C33.4007 31.8749 31.8761 33.273 29.9554 33.8843C29.1025 34.1579 28.2082 34.2749 27.3157 34.2749H11.5024C9.92882 34.2749 8.53636 33.9089 7.39484 33.2221C6.67974 32.7919 6.55332 31.8013 7.08352 31.156C7.97031 30.0805 8.84579 29.0013 9.72882 27.9126C11.4118 25.8296 12.5458 25.2258 13.8062 25.756C14.3175 25.9748 14.8307 26.305 15.359 26.6522C16.7666 27.5843 18.7232 28.8635 21.3006 27.4749C23.0623 26.5115 24.085 24.8631 24.9751 23.4283L24.9931 23.3994C25.053 23.3033 25.1124 23.2073 25.1716 23.1116C25.4743 22.6226 25.7724 22.1409 26.1101 21.6975C26.5289 21.1484 28.0837 19.4314 30.0931 20.6541C31.3743 21.4239 32.4516 22.4654 33.6045 23.5805Z" fill="#9499AE" />
                    </svg>
                    <p class="text-xs mt-2 text-color-ass-8">Add Assets from</p>
                    <p class="text-xs text-primary-color-1">Computer</p>
                  </div>

                  <input id="dropzone-file" type="file" class="hidden" />
                </label>
              </div>

            </div>
            <div className="mb-6">
              <div
                className="text-sm font-bold font-satoshi-bold"
              >
                Properties
              </div>
              <small className="block text-xs text-color-ass-7 mb-2">Add the properties on your NFT.</small>

              <div className="flex py-3 border-b border-b-black-shade-800">
                <i className="fa-solid fa-star"></i>
                <div className="flex-1 px-3">
                  <p className="-mt-1">Define Properties</p>
                  <small className="text-color-ass-7">Add the properties on your NFT.</small>
                </div>
                <i class="fa-regular fa-square-plus text-2xl cursor-pointer"
                  onClick={() => setShowAddPropertyModal(true)} ></i>
              </div>

              <div className="flex py-3 border-b border-b-black-shade-800">
                <i class="fa-regular fa-grip-lines"></i>
                <div className="flex-1 px-3">
                  <p className="-mt-1">Properties</p>
                  <small className="text-color-ass-7">Add NFT properties</small>
                </div>
                <i class="fa-regular fa-square-plus text-2xl cursor-pointer"
                  onClick={() => setShowAddPropertyModal(true)} ></i>
              </div>




            </div>
          </div>
        </section>


        <br /><br /><br /><br /><br />


        <section className="flex my-9 flex-col md:flex-row text-white">
          <div className="flex-1">
            <h3 className="mb-8">Start build your NFT</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label
                  className="block text-sm font-bold font-satoshi-bold"
                  htmlFor="name"
                >
                  Name
                </label>
                <small className="block text-xs text-color-ass-7 mb-2">Fill the name for your NFT</small>
                <input
                  className="block mb-3"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Name"
                  {...register("name", {
                    required: "Name is required.",
                  })}
                  defaultValue={"Look So Clean #21124"}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label
                  className="block text-sm font-bold font-satoshi-bold"
                  htmlFor="description"
                >
                  Description
                </label>
                <small className="block text-xs text-color-ass-7 mb-2">What this NFT about or story behind this NFT</small>

                <textarea
                  className="block h-32  mb-3"
                  id="description"
                  name="description"
                  placeholder="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here"
                  {...register("description", {
                    required: "Name is required.",
                  })}
                  defaultValue={""}
                >
                </textarea>
                {errors.name && (
                  <p className="text-red-500 text-xs font-medium">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label
                  className="block text-sm font-bold font-satoshi-bold"
                  htmlFor="blockchain"
                >
                  Blockchain
                </label>
                <small className="block text-xs text-color-ass-7 mb-2">Choose the blockchain you want to use for this NFT</small>
                <div className="icon-blockchain">
                  <input
                    className="block mb-3"
                    id="blockchain"
                    name="blockchain"
                    type="text"
                    placeholder="Polygon"
                    {...register("blockchain")}
                    defaultValue={"Polygon"}
                    disabled={true}
                  />
                  {errors.blockchain && (
                    <p className="text-red-500 text-xs font-medium">
                      {errors.blockchain.message}
                    </p>
                  )}
                </div>

              </div>
              <div className="mb-6">
                <button type="submit" className="btn btn-primary btn-sm">
                  CREATE
                </button>
              </div>
            </form>
          </div>
          <div className="w-[1px] bg-black-shade-800  mx-11 hidden md:block"></div>
          <div className="flex-1">
            <div className="mb-6">
              <img src={dummyImg} className="rounded-xl  max-w-full w-40 h-40 object-cover" />
            </div>
            <div className="mb-6">
              <div
                className="text-sm font-bold font-satoshi-bold"
              >
                Properties
              </div>
              <small className="block text-xs text-color-ass-7 mb-2">Add the properties on your NFT.</small>

              <div className="flex py-3 border-b border-b-black-shade-800">
                <i className="fa-solid fa-star"></i>
                <div className="flex-1 px-3 flex flex-col">
                  <p className="-mt-1">Define Properties</p>
                  <small className="text-color-ass-7">Add the properties on your NFT.</small>

                  <div className="flex items-center mt-3">
                    <input
                      name="ss"
                      type="text"
                      className="w-32"
                    />
                    <input
                      name="ss"
                      type="text"
                      className="w-32 ml-3"
                    />
                    <i class="fa-solid fa-trash cursor-pointer ml-3" ></i>
                  </div>

                </div>
                <i class="fa-regular fa-square-plus text-2xl cursor-pointer"
                  onClick={() => setShowAddPropertyModal(true)} ></i>
              </div>



              <div className="flex py-3 border-b border-b-black-shade-800">
                <i class="fa-regular fa-grip-lines"></i>
                <div className="flex-1 px-3">
                  <p className="-mt-1">Properties</p>
                  <small className="text-color-ass-7">Add NFT properties</small>
                </div>
                <i class="fa-regular fa-square-plus text-2xl cursor-pointer"
                  onClick={() => setShowAddPropertyModal(true)} ></i>
              </div>




            </div>
          </div>
        </section>


        <Modal
          show={showAddPropertyModal}
          handleClose={() => setShowAddPropertyModal(false)}
          height={"auto"}
          width={"564"}
        >
          <h2 className="mb-3">Add your defined Properties</h2>


          <div className="w-10/12">
            <p className="mb-4">
              Add the properties, with value , you can add more than 5 properties
            </p>
            <p className="text-color-ass-9 text-sm">Add Properties</p>
            {propertyList &&
              propertyList.map((property, index) => (
                <>
                  <div className="flex items-center mt-3">
                    <input
                      name={`type-${index}`}
                      type={"text"}
                      className="w-32"
                      defaultValue={property.type}
                      onChange={(e) => handleOnChangeType(e, index)}
                    />

                    <input
                      name={`name-${index}`}
                      type={"text"}
                      className="ml-3 w-32"
                      defaultValue={property.name}
                      onChange={(e) => handleOnChangeName(e, index)}
                    />
                    <i class="fa-solid fa-trash cursor-pointer ml-3" onClick={() => removeProperty(index)}></i>
                  </div>
                </>
              ))}


            <div className="mt-5">
              <button
                type="button"
                class="btn btn-text-gradient"
                onClick={() => addProperty()} >
                Add more +
              </button>
            </div>

            <div className="mt-5">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddPropertyModal(false)}
              >
                SAVE
              </button>
            </div>
          </div>
        </Modal>




      </main>


      <br /><br /><br /><br /><br /><br /><br /><br />

      {/* ===== old code ======= */}
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
                htmlFor="collection"
              >
                Properties
              </label>
              <small>Textual traits that show up as rectangles</small>
            </div>
          </div>
          <div className="flex flex-wrap mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-gray-700 text-s font-bold mb-2"
                htmlFor="collection"
              >
                Levels
              </label>
              <small>Numerical traits that show as a progress bar</small>
              <div
                className="text-right text-[#0ab4af] cursor-pointer"
                onClick={() => setShowAddPropertyModal(true)}
              >
                + ADD
              </div>
              <div className="mt-1">
                <div className="grid grid-cols-6 gap-1">
                  {propertyList &&
                    propertyList.map((property, index) => (
                      <div className="border border-gray-400 h-24 w-24 text-center p-4">
                        <p>{property.type}</p>
                        <p>{property.name}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap mb-6">
            <div className="w-full px-3 mb-6 md:mb-0">
              <label
                className="block tracking-wide text-gray-700 text-s font-bold mb-2"
                htmlFor="collection"
              >
                Stats
              </label>
              <small>Numerical traits that just show as numbers</small>
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
                defaultValue={1}
                disabled={true}
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
                defaultValue={"Ethereum Mainnet"}
                disabled={true}
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
        {/* <Modal
          show={showAddPropertyModal}
          handleClose={() => setShowAddPropertyModal(false)}
          height={"auto"}
          width={"500"}
        >
          <div className="text-center my-4 font-semibold">Add Properties</div>
          <div className="border-b border-gray-500 mx-4"></div>
          <div className="my-4 mx-4">
            <small>
              Properties show up underneath your item, are clickable, and can be
              filtered in your collection's sidebar.
            </small>
            <div class="mt-2 grid grid-cols-2 gap-4">
              <div className="ml-5">Type</div>
              <div>Name</div>
              {propertyList &&
                propertyList.map((property, index) => (
                  <>
                    <div className="flex">
                      <span
                        className="cursor-pointer"
                        onClick={() => removeProperty(index)}
                      >
                        X&nbsp;&nbsp;
                      </span>
                      <input
                        name={`type-${index}`}
                        type={"text"}
                        className="h-8 border rounded border-gray-300"
                        defaultValue={property.type}
                        onChange={(e) => handleOnChangeType(e, index)}
                      />
                    </div>
                    <div>
                      <input
                        name={`name-${index}`}
                        type={"text"}
                        className="h-8 border rounded border-gray-300"
                        defaultValue={property.name}
                        onChange={(e) => handleOnChangeName(e, index)}
                      />
                    </div>
                  </>
                ))}
            </div>
            <div className="ml-5 mt-4">
              <button
                type="button"
                class="border rounded-full border-gray-400 text-gray-400"
                onClick={() => addProperty()}
              >
                <div className="mx-4 my-1">Add more</div>
              </button>
            </div>
            <div className="text-center mt-4">
              <button
                type="button"
                className="h-12 w-32 sm:w-48  rounded bg-[#0ab4af] text-white pl-0 hover:bg-[#192434] cursor-pointer"
                onClick={() => setShowAddPropertyModal(false)}
              >
                SAVE
              </button>
            </div>
          </div>
        </Modal> */}

      </div>
    </>
  );
};
export default MintNFT;
