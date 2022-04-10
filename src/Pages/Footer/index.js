import React from "react";
import { ReactComponent as Discord } from "assets/images/footer/ico_discord.svg";
import { ReactComponent as Logo } from "assets/images/footer/logo.svg";

function FooterPage(props) {
  return (
    <>
      <div className="w-full bg-[#192434] mt-24">
        <span className="block sm:hidden grid grid-cols-1 pt-8 place-items-center">
          <Logo height={76} width={200} />
        </span>
        <div className="divide-y divide-gray-600 mx-4 sm:mx-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 place-content-center mb-4">
            <span className="hidden sm:block self-center">
              <span className="hidden xl:block">
                <Logo height={76} width={375} />
              </span>
              <span className="hidden lg:block xl:hidden">
                <Logo height={76} width={250} />
              </span>
              <span className="hidden sm:block lg:hidden xl:hidden">
                <Logo height={76} width={200} />
              </span>
            </span>
            <div>
              <ul class="list-none text-gray-100 text-base font-sans">
                <li className="text-lg font-bold m-2.5">Service</li>
                <li className="text-sm m-2.5">Create Project</li>
                <li className="text-sm m-2.5">Project List</li>
                <li className="text-sm m-2.5">Meet Up</li>
                <li className="text-sm m-2.5">What’s CREABO</li>
                <li className="text-sm m-2.5">Contact</li>
              </ul>
            </div>
            <div>
              <ul class="list-none text-gray-100 text-base font-sans">
                <li className="text-lg font-bold m-2.5">Company</li>
                <li className="text-sm m-2.5">About</li>
                <li className="text-sm m-2.5">Terms of service</li>
                <li className="text-sm m-2.5">
                  Specified commercial transactions
                </li>
                <li className="text-sm m-2.5">Privacy policy</li>
                <li className="text-sm m-2.5">Join our team</li>
              </ul>
            </div>
          </div>
          <div className="text-gray-100 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-8 text-sm place-items-center sm:place-items-stretch">
              <span className="hidden sm:block inline-block align-middle">
                Copyright © 2022 CRASTONIC Ltd. All Rights Reserved.
              </span>
              <div className="flex flex-row-reverse">
                <span className="cursor-pointer pl-4">
                  <Discord className="fill-white" />
                </span>
                <i
                  class="fa fa-instagram fa-lg m-2 pl-4 cursor-pointer"
                  aria-hidden="true"
                ></i>
                <i
                  class="fa fa-facebook fa-lg m-2 pl-4 cursor-pointer"
                  aria-hidden="true"
                ></i>
                <i
                  class="fa fa-twitter fa-lg m-2 pl-4 cursor-pointer"
                  aria-hidden="true"
                ></i>
              </div>
              <span className="block sm:hidden inline-block align-middle">
                Copyright © 2022 CRASTONIC Ltd. All Rights Reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FooterPage;
