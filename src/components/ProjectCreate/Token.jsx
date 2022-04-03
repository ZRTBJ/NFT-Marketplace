import React from "react";
import { useForm } from "react-hook-form";

export default function Token() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <div class="grid justify-items-center">
      <h1 className="text-5xl font-bold mb-16">TOKEN SETTING</h1>
      <form className="w-full max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label
              className="block tracking-wide text-gray-700 text-s font-bold mb-2"
              for="token-name"
            >
              Token name
            </label>
            <input
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="token-name"
              name="tokenName"
              type="text"
              placeholder=""
            />
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label
              className="block tracking-wide text-gray-700 text-s font-bold mb-2"
              for="token-symbol"
            >
              Token symbol (Up to 5 characters)
            </label>
            <input
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="token-symbol"
              name="tokenSymbol"
              type="text"
              placeholder=""
            />
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block tracking-wide text-gray-700 text-s font-bold mb-2"
              for="number-of-tokens"
            >
              Number Of Tokens
            </label>
            <input
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="number-of-tokens"
              name="numberOfTokens"
              type="text"
              placeholder=""
            />
            <p className="hidden text-red-500 text-xs italic">
              Please fill out this field.
            </p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block tracking-wide text-gray-700 text-s font-bold mb-2">
              &nbsp;
            </label>
            <div className="pt-2">
              KAT <span className="text-gray-400">(0000MATIC)</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
