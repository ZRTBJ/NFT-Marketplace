import Upload from "../../../assets/images/icons/image-upload.svg";

const FileUploader = ({ name, label, handleImage, preview }) => {
  return (
    <div class="mb-[24px] w-fit">
      <label
        htmlFor={name}
        class="text-[16px] text-[#161423] font-bold outline-none"
      >
        {label}
      </label>
      <input id={name} type="file" className="hidden" onChange={handleImage} />
      {preview ? (
        <label htmlFor={name}>
          <img
            src={preview}
            alt="Preview"
            className="w-[158px] h-[158px] rounded-[12px] mt-3 cursor-pointer object-contain"
          />
        </label>
      ) : (
        <label
          htmlFor={name}
          className="bg-[#E6E8EE] rounded-[12px] mt-3 cursor-pointer flex-col flex items-center justify-center w-[158px] h-[158px]"
        >
          <img src={Upload} alt="Upload" />
          <p className="text-text-base text-center text-link-sub-text text-[13px]">
            Add a Asset from{" "}
            <span className="text-link-text block">Computer</span>
          </p>
        </label>
      )}
    </div>
  );
};

export default FileUploader;
