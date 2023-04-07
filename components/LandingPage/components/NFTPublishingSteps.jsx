import React from "react";
import bg from "assets/images/profile/bg-gradient.svg";
import frame from "assets/images/profile/nftFrame.svg";
import Image from "next/image";
const steps = [
  {
    title: "Have solid utilities",
    text: "Innovative use cases draw investors and collectors. Make your project stand out",
  },
  {
    title: "Build a community",
    text: "The community sits at the heart of any successful web3 project. Do not hesitate",
  },
  {
    title: "Embrace active marketing",
    text: "Your quality project still needs to be known. Try out a combination of web3 marketing tactics to spread the word about your project.",
  },
];
export default function NFTPublishingSteps() {
  return (
    <div
      className="rounded-xl bg-black text-white px-4 py-2"
      style={{
        backgroundImage: `url(${bg.src})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-wrap gap-6 items-center justify-between">
        <div className="text-[20px] font-black md:max-w-[175px]">
          Tips for a solid NFT project
        </div>
        <div className="relative order-first md:order-last">
          <Image
            className=" h-[138px] w-[120] md:rotate-[15deg]"
            alt="nft frame"
            src={frame}
            height={138}
            width={120}
          ></Image>
        </div>
      </div>
      <div className="md:mt-[-10px]">
        {steps.map((i, index) => (
          <div key={index}>
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <div>
                  <div className="flex bg-white items-center justify-center w-4 h-4 border rounded-full"></div>
                </div>
                {index !== 2 && <div className="w-px h-full bg-gray-300"></div>}
              </div>
              <div className="">
                <p className="font-black text-[14px] w-fit gradient-text-new mb-0">{`Step ${
                  index + 1
                }`}</p>
                <p className="font-black text-[14px] mt-0">{i?.title}</p>
                <p className="ml-4 text-[12px] pb-2 break-word">{i?.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
