import thumbIcon from "assets/images/profile/card.svg";
const Card = ({ cardInfo }) => {
  return (
    <>
      <div className="rounded-lg border border-primary-50  p-6">
        <a href="#">
          <img className="rounded-lg" src={thumbIcon} alt="card image" />
        </a>
        <div className="p-5">
          {/* <a href="#">
            <h3 class="mb-2 tracking-tight text-color-grey">
              Project by mustrad face colony Track
            </h3>
          </a> */}

          <p className="mt-4 text-white  font-bold">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>

          {/* <div class="mt-4">
            <a
              href="#"
              className="inline-flex items-center mr-1 py-2 px-3 text-xs font-bold text-center text-color-gold bg-color-brown rounded-full ease-in-out duration-300 hover:text-color-brown hover:bg-color-gold focus:ring-4 focus:outline-none focus:ring-primary-300 "
            >
              Member
            </a>

            <a
              href="#"
              className="inline-flex items-center mr-1 py-2 px-3 text-xs font-bold text-center text-primary-50 bg-primary-900 rounded-full ease-in-out duration-300 hover:text-primary-900 hover:bg-primary-200 focus:ring-4 focus:outline-none focus:ring-primary-300 "
            >
              Member
            </a>
          </div> */}

          {/* <div className="flex flex-wrap mt-4">
            <a className="flex space-x-2 items-center text-white mr-4">
              <i className="fa-thin fa-eye"></i>

              <span className=" ml-1">120</span>
            </a>

            <a className="flex space-x-2 items-center text-white mr-4">
              <i class="fa-thin fa-heart"></i>

              <span className=" ml-1">120</span>
            </a>

            <a className="flex space-x-2 items-center text-white mr-4">
              <i class="fa-thin fa-bookmark"></i>

              <span className=" ml-1">120</span>
            </a>
          </div> */}
        </div>
      </div>
    </>
  );
};
export default Card;
