import publishModalSvg from "assets/images/modal/publishModalSvg.svg";
import Modal from "components/Commons/Modal";

const PublishCollectionModal = ({
  handleClose,
  show,
  publishProject,
  type,
  isRoyaltyPublished = "",
}) => {
  return (
    <Modal width={600} show={show} handleClose={() => handleClose(false)}>
      <div className="text-center">
        <img
          className="h-[200px] md:w-[300px] mx-auto"
          src={publishModalSvg}
          alt=""
        />
        <div className="md:mx-16">
          <div className="font-black text-[16px]">
            {type === "Collection" ? (
              <>
                {isRoyaltyPublished ? (
                  <span>
                    You can’t change some fields once you publish this
                    Collection
                  </span>
                ) : (
                  <span className="text-danger-900">
                    <i class="fa-regular fa-triangle-exclamation"></i> Royalty
                    Splitter is not published yet.
                  </span>
                )}
              </>
            ) : (
              <span>
                You can’t change some fields once you publish this {type}
              </span>
            )}
          </div>
          <div className="text-[#9499AE] mt-[12px]">
            Do you want to publish anyway?
          </div>
          {type === "Collection" && (
            <div className="message-info">
              Once transaction has made, you can not add new NFT, collection and NFT data will not be
              changeable except benefits fields.
            </div>
          )}
          {type == "Royalty Splitter" && (
            <div className="message-info">
              Once you publish, all contributors royalty percent will be locked and unchangable.
            </div>
          )}
          <div className="flex justify-center mt-[30px]">
            <button
              className="btn contained-button btn-sm"
              onClick={publishProject}
            >
              Publish now
            </button>
            <button
              className="ml-4 bg-primary-900/[0.20] text-primary-900 px-3 font-semibold rounded w-[110px] h-[38px]"
              onClick={() => handleClose(false)}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PublishCollectionModal;
