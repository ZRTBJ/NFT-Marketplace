import React from "react";
import { DebounceInput } from "react-debounce-input";

export default function Token({
  tokenName,
  emptyToken,
  alreadyTakenTokenName,
  onTokenNameChange,
  tokenSymbol,
  emptySymbol,
  alreadyTakenSymbol,
  onTokenSymbolChange,
  numberOfTokens,
  onNumberOfTokenChange,
}) {
  return (
    <div>
      <div className="mb-6">
        <div className="label">Token name</div>
        <div className="label-grey">Your token name</div>
        <DebounceInput
          minLength={1}
          debounceTimeout={300}
          onChange={(event) => onTokenNameChange(event.target.value)}
          className="debounceInput"
          value={tokenName}
          placeholder="Project Token Name"
        />
        {alreadyTakenTokenName && (
          <div className="validationTag">Token name has already taken</div>
        )}
        {emptyToken && (
          <div className="validationTag">Token name is required</div>
        )}
      </div>
      <div className="mb-6">
        <div className="label">Token Symbol</div>
        <div className="label-grey">Your token symbol eg: ETH,BTC.CAR,SOL</div>
        <DebounceInput
          minLength={1}
          maxLength={5}
          debounceTimeout={300}
          onChange={(event) => onTokenSymbolChange(event.target.value)}
          className="debounceInput"
          value={tokenSymbol}
          placeholder="KAT"
        />
        {emptySymbol && (
          <div className="validationTag">Token symbol is required</div>
        )}
        {alreadyTakenSymbol && (
          <div className="validationTag">Token symbol has already taken</div>
        )}
      </div>
      <div className="md:flex flex-wrap items-center mb-6">
        <div className="md:w-[65%] md:mr-4">
          <div className="label">Number Of Tokens</div>
          <input
            className=""
            id="number-of-tokens"
            name="numberOfTokens"
            value={numberOfTokens}
            onChange={(event) => onNumberOfTokenChange(event.target.value)}
            placeholder=""
            type="number"
            min="0"
          />
        </div>
        <div className="md:mt-8">
          <input
            className=""
            id="number-of-tokens"
            name="numberOfTokens"
            value={numberOfTokens}
            onChange={(event) => onNumberOfTokenChange(event.target.value)}
            placeholder="-"
            type="number"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}
