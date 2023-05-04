import {
  ParentComponent,
  createContext,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import Web3 from "web3";

export const WebContext = createContext();

const WebProvider: ParentComponent = (props) => {
  const [web, setWeb] = createSignal();

  return (
    <WebContext.Provider value={{ web: () => web(), setWeb: () => setWeb }}>
      {props.children}
    </WebContext.Provider>
  );
};

export const useWebcontext = () => useContext(WebContext);

export default WebProvider;
