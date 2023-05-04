import Web3 from "web3";
import { useWebcontext } from "~/components/WebProvider";

export function setProviderFn() {
  const { web, setWeb } = useWebcontext();

  const ethereum = window.ethereum;
  const web3 = new Web3(ethereum);

  setWeb(web3);
}
