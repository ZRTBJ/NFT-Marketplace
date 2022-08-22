import axios from "axios";

export async function cryptoConvert(FromUnit, ToUnit) {
  return await axios({
    method: "GET",
    url: `https://min-api.cryptocompare.com/data/price?fsym=${
      FromUnit ? FromUnit : "MATIC"
    }&tsyms=${ToUnit ? ToUnit : "USD"}`,
    headers: { "Content-Type": "application/json" },
  });
}
