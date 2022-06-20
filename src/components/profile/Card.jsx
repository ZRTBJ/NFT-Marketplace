import thumbIcon from "assets/images/profile/card.svg";
const Card = ({ cardInfo }) => {
  return (
    <>
      <div className="rounded-lg border border-primary-color shadow-primary-color shadow-xs p-6">
        <a href="#">
          <img className="rounded-lg" src={thumbIcon} alt="card image" />
        </a>
        <div className="p-5">

          <a href="#">
            <h3 class="mb-2 tracking-tight text-color-grey">Project by mustrad face colony Track</h3>
          </a>

          {/* <p className="mt-4 text-color-grey">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p> */}

          <div class="mt-4">
            <a href="#" className="inline-flex items-center mr-1 py-2 px-3 text-xs font-bold text-center text-color-gold bg-color-brown rounded-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Member
            </a>

            <a href="#" className="inline-flex items-center mr-1 py-2 px-3 text-xs font-bold text-center text-color-gold bg-color-brown rounded-full hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Member
            </a>

          </div>

          <div className="flex flex-wrap mt-4">

            <a className="flex space-x-2 items-center text-white mr-4">

              <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.998 15.3549C13.806 15.3549 17.289 12.6169 19.25 8.05292C17.289 3.48892 13.806 0.750916 9.998 0.750916H10.002C6.194 0.750916 2.711 3.48892 0.75 8.05292C2.711 12.6169 6.194 15.3549 10.002 15.3549H9.998Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <span className=" ml-1">
                120
              </span>
            </a>



            <a className="flex space-x-2 items-center text-white mr-4">

              <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.998 15.3549C13.806 15.3549 17.289 12.6169 19.25 8.05292C17.289 3.48892 13.806 0.750916 9.998 0.750916H10.002C6.194 0.750916 2.711 3.48892 0.75 8.05292C2.711 12.6169 6.194 15.3549 10.002 15.3549H9.998Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <span className=" ml-1">
                120
              </span>
            </a>




            <a className="flex space-x-2 items-center text-white mr-4">

              <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.998 15.3549C13.806 15.3549 17.289 12.6169 19.25 8.05292C17.289 3.48892 13.806 0.750916 9.998 0.750916H10.002C6.194 0.750916 2.711 3.48892 0.75 8.05292C2.711 12.6169 6.194 15.3549 10.002 15.3549H9.998Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <span className=" ml-1">
                120
              </span>
            </a>







          </div>


        </div>
      </div>
    </>
  );
};
export default Card;
