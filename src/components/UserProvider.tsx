import {
  ParentComponent,
  createContext,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import Web3 from "web3";

export const UserContext = createContext();

const UserProvider: ParentComponent = (props) => {
  const [account, setAccount] = createSignal("");
  const ethereum = window.ethereum;
  const web3 = new Web3(ethereum);

  onMount(async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  });
  return (
    <UserContext.Provider value={{ account, setAccount }}>
      {props.children}
    </UserContext.Provider>
  );
};

export const useUsercontext = () => useContext(UserContext);

export default UserProvider;
