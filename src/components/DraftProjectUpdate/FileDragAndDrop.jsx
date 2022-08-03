import { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import dragSvg from "assets/images/projectCreate/dragSvg.svg";

export default function FileDragAndDrop({
  height,
  maxFiles,
  onDrop,
  sizePlaceholder,
  maxSize,
  disabled,
}) {
  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: height,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#232032",
    borderStyle: "solid",
    backgroundColor: "#232032",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
    paddingTop: "12%",
  };

  const focusedStyle = {
    borderColor: "#0ab4af",
  };

  const acceptStyle = {
    borderColor: "#0ab4af",
  };

  const rejectStyle = {
    borderColor: "#ff1744",
  };

  const { isFocused, isDragAccept, isDragReject, getRootProps, getInputProps } =
    useDropzone({
      onDrop,
      accept: "image/*",
      maxFiles: maxFiles,
      noClick: false,
      maxSize: maxSize,
      disabled: disabled ? disabled : false,
    });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFocused, isDragAccept, isDragReject]
  );
  return (
    <div>
      <div className="Filecontainer">
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <img src={dragSvg} alt="" />
          <p className="text-[#646A80] text-[13px] font-bold ">
            Add Image/Drag from
          </p>
          <div className=" text-primary-900 text-[13px] font-bold">Computer</div>
          {/* {sizePlaceholder && <div>{sizePlaceholder}</div>} */}
        </div>
      </div>
    </div>
  );
}
