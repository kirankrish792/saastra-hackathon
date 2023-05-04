import { Show, createSignal, onMount, useContext } from "solid-js";

import DonationAbi from "../contractAbi/donation.json";
import Web3 from "web3";
import getAccount from "~/lib/getAccount";
import { useUsercontext } from "~/components/UserProvider";
import { useWebcontext } from "~/components/WebProvider";

export default function Donation() {
  const { account, setAccount } = useUsercontext();
  const ethereum = window.ethereum;
  const web3 = new Web3(ethereum);

  onMount(() => {
    getTotalDonation();
  });

  const [donation, setDonation] = createSignal(0);
  const [totalDonation, setTotalDonation] = createSignal("");

  const contractAddress = "0xE921C675e7FFCFCDF833c1a995e7a2Cf0E329566";

  // Create an instance of the contract
  const abi = DonationAbi;
  const contract = new web3.eth.Contract(abi, contractAddress);

  function handleDonate(val: String) {
    setDonation(Math.abs(Number(val.trim())));
  }

  async function donate() {
    const amountToSend = web3.utils.toWei("" + donation(), "ether"); // Send 1 ether

    // Call the payable function
    const tx = await contract.methods
      .donate()
      .send({ from: account(), value: amountToSend });

    // Check the transaction status
    const receipt = await web3.eth.getTransactionReceipt(tx);
    console.log(receipt);

    getTotalDonation();
  }

  async function withdraw() {
    const tx = await contract.methods.withdraw().send({ from: account() });
    console.log(tx);
    getTotalDonation();
  }

  async function getTotalDonation() {
    const totalDonation = await contract.methods.totalDonations().call();
    const eth = Web3.utils.fromWei(totalDonation, "ether");
    setTotalDonation(() => eth);
  }

  return (
    <main class="text-center mx-auto text-white p-4">
      <h1>Donations</h1>
      {account}
      <div>
        <button class="bg-blue-500 px-4 py-2 m-2 rounded-lg" onClick={donate}>
          Donate
        </button>
        <input
          type="text"
          onChange={(e) => handleDonate(e.currentTarget.value)}
        />
      </div>
      <div>
        <button class="bg-blue-500 px-4 py-2 m-2 rounded-lg" onClick={withdraw}>
          Withdraw
        </button>
      </div>
      <div>
        <h3>Total Donation : {totalDonation()}</h3>
      </div>
    </main>
  );
}
