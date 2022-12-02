import { useMemo } from "react";
import { useDropzone } from "react-dropzone";

export default function FileDragAndDrop({
  height,
  maxFiles,
  onDrop,
  sizePlaceholder,
  maxSize,
  disabled,
  type,
  width,
  rounded,
}) {
  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: height,
    width: width,
    borderWidth: 1,
    borderRadius: rounded ? "50% " : 12,
    borderColor: "#E6E8EE",
    borderStyle: "solid",
    backgroundColor: "#E6E8EE",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
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
      accept: {
        "image/*": [".jpeg", ".png", ".jpg", ".svg"],
      },
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

          {type === "logo" ? (
            <i className="fa-regular fa-image text-[25px] "></i>
          ) : (
            <>
              <i className="fa-regular fa-image text-[25px] "></i>
              <p className="text-[#646A80] text-[15px]  font-bold ">
                Add Image/Drag from
              </p>
              <div className=" text-primary-900 text-[13px] font-bold">
                Computer
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
