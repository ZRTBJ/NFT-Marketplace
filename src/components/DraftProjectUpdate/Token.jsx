import React from "react";
import { DebounceInput } from "react-debounce-input";
import { useForm } from "react-hook-form";

export default function Token({
  tokenName,
  alreadyTakenTokenName,
  onTokenNameChange,
  tokenSymbol,
  alreadyTakenSymbol,
  onTokenSymbolChange,
  numberOfTokens,
  onNumberOfTokenChange,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <div className="">
      <h1 className="text-5xl text-center font-bold mb-16">TOKEN SETTING</h1>
      <form className="w-full max-w-2xl" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap mb-6">
          <div className="w-full">
            <label
              className="block tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="token-name"
            >
              Token name
            </label>
            <DebounceInput
              minLength={1}
              debounceTimeout={300}
              onChange={(event) => onTokenNameChange(event.target.value)}
              type="text"
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="token-name"
              name="tokenName"
              value={tokenName}
              placeholder="Project Token Name"
            />
            {alreadyTakenTokenName && (
              <div className="validationTag">Token name has already taken</div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full ">
            <label
              className="block tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="token-symbol"
            >
              Token symbol (Up to 5 characters)
            </label>
            <DebounceInput
              minLength={1}
              maxLength={5}
              debounceTimeout={300}
              onChange={(event) => onTokenSymbolChange(event.target.value)}
              type="text"
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="token-symbol"
              name="tokenSymbol"
              value={tokenSymbol}
              placeholder="KAT"
            />
            {alreadyTakenSymbol && (
              <div className="validationTag">
                Token symbol has already taken
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full md:w-1/2  md:mb-6 md:mb-0">
            <label
              className="block tracking-wide text-gray-700 text-s font-bold mb-2"
              htmlFor="number-of-tokens"
            >
              Number Of Tokens
            </label>
            <input
              className="block w-full border border-zinc-300 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="number-of-tokens"
              name="numberOfTokens"
              value={numberOfTokens}
              onChange={(event) => onNumberOfTokenChange(event.target.value)}
              placeholder="KAT"
              type="number"
              min="0"
            />
          </div>
          <div className="w-full md:w-1/2 ">
            <label className="hidden md:block tracking-wide text-gray-700 text-s font-bold mb-2">
              &nbsp;
            </label>
            <div className="ml-4 pt-2">
              KAT <span className="text-gray-400">(0000MATIC)</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
