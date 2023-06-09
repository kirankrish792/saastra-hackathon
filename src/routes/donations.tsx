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

  setInterval(() => getTotalDonation(), 1000);

  onMount(async () => {
    getTotalDonation();
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    await getOwner();
  });

  const [donation, setDonation] = createSignal(0);
  const [totalDonation, setTotalDonation] = createSignal("");
  const [owner, setOwner] = createSignal("");

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

  async function getOwner() {
    let ownerAdd = await contract.methods.government().call();
    setOwner(() => ownerAdd);
  }

  return (
    <main class="text-center mx-auto text-white p-4">
      <h1 class="text-4xl">Donations</h1>
      <Show when={account} fallback={<div>Refresh the page</div>}>
        <div class="py-2 text-lg"> User Account : {account}</div>
      </Show>
      <div class="py-4">
        <button class="btn px-4 py-2 my-2 rounded-l-lg" onClick={donate}>
          Donate
        </button>
        <input
          type="text"
          onChange={(e) => handleDonate(e.currentTarget.value)}
          placeholder="Enter amount"
          class="rounded-r-lg"
        />
      </div>
      <div>
        <button
          class="bg-[#175873] hover:bg-[#0C1446] px-4 py-2 m-2 rounded-lg"
          onClick={withdraw}
        >
          Withdraw
        </button>
      </div>
      <div class="text-2xl p-4">
        <h3>Total Donation : {totalDonation()} ETH</h3>
      </div>
    </main>
  );
}
