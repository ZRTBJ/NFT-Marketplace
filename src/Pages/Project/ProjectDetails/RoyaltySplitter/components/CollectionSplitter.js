import DefaultImage from "assets/images/defaultImage.svg";
import Open from "assets/images/open.svg";
import Closed from "assets/images/closed.svg";
import Splitter from "./Splitter";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

const CollectionSplitter = ({
  members,
  name,
  status,
  image,
  id,
  openedCollection,
  setOpenedCollection,
  date,
}) => {
  return (
    <div className="mb-10">
      <div className="flex items-center w-full flex-wrap">

        <div className="flex items-center w-[50%] md:w-[20%]">
          <img
            src={image?.path ? image.path : DefaultImage}
            className="w-[44px] h-[44px] rounded mr-4"
            alt="Collection"
          />
          <Link
            className="!no-underline"
            to={`/collection-details/${id}`}
          >
            <p className="text-[16px] font-black">{name}</p>
          </Link>
        </div>
        <div className="w-[20%] text-center hidden md:flex items-center justify-center">
          {/* Temporary disable it for now {members ? (
            members.map((member) => (
              <img
                src={member?.avatar ? member.avatar : Profile}
                alt="member"
                className="w-[32px] h-[32px] rounded-full -ml-[8px] -mr-[8px]"
              />
            ))
          ) : (
            <p>No members</p>
          )} */}
        </div>
        <p className="w-[20%] text-[14px] font-normal text-center hidden md:block">
          {" "}
          {dayjs(date).format("DD/MM/YYYY - HH:mm")}
        </p>
        <p className="text-[14px] font-normal w-[20%] text-center hidden md:block">
          {status && status === "published" ? "Locked" : "Not Locked"}
        </p>
        <div className="w-[50%] md:w-[20%]">
          {openedCollection === id ? (
            <img
              src={Open}
              alt="Open"
              className="ml-auto cursor-pointer"
              onClick={() => setOpenedCollection(null)}
            />
          ) : (
            <img
              src={Closed}
              alt="Close"
              className="ml-auto cursor-pointer"
              onClick={() => setOpenedCollection(id)}
            />
          )}
        </div>
        <div className="w-[33%] text-center flex md:hidden mt-4 items-center justify-center">
          {/* Temporary disable it for now {members ? (
            members.map((member) => (
              <img
                src={member?.avatar ? member.avatar : Profile}
                alt="member"
                className="w-[32px] h-[32px] rounded-full -ml-[8px] -mr-[8px]"
              />
            ))
          ) : (
            <p>No members</p>
          )} */}
        </div>
        <p className="w-[33%] text-[14px] font-normal text-center  block md:hidden  mt-4">
          {dayjs(date).format("DD/MM/YYYY - HH:mm")}
        </p>
        <p className="text-[14px] font-normal w-[33%] text-center  block md:hidden  mt-4">
          {status === "published" ? "Locked" : "Not Locked"}
        </p>
      </div>
      {openedCollection === id ? (
        <div className="transition duration-150 ease-in-out">
          <Splitter collectionId={id} />
        </div>
      ) : null}
    </div>
  );
};

export default CollectionSplitter;
