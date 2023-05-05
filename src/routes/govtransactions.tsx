import { For, Show, createSignal, onMount } from "solid-js";

import { createStore } from "solid-js/store";
import Web3 from "web3";
import { useUsercontext } from "~/components/UserProvider";
import TransactionAbi from "../contractAbi/transaction.json";

enum TransactionStatus {
  Pending,
  Approved,
  Rejected,
}
enum BillStatus {
  NotSubmitted,
  Submitted,
}

const GovTransactions = () => {

  onMount(async () => {
    displayTransactions();
    // if (account() == "") {
    //   const accounts = await window.ethereum.request({
    //     method: "eth_requestAccounts",
    //   });
    //   setAccount(accounts[0]);
    // }
    await getOwner();
  });

  const [bill, setBill] = createSignal("");
  const [recipt, setRecipt] = createSignal("");
  const [amt, setAmt] = createSignal(0);

  const [owner, setOwner] = createSignal("");

  const [transactions, setTransactions] = createStore<any[]>([]);

  const { account, setAccount } = useUsercontext();

  const contractAddress = "0x0684008bb58D239B09B22Be5299B481b176313f9";
  const ethereum = window.ethereum;
  const web3 = new Web3(ethereum);
  // Create an instance of the contract
  const abi = TransactionAbi;
  const contract = new web3.eth.Contract(abi, contractAddress);

  function approveTransaction(_transId: string) {
    contract.methods.approveTransaction(_transId).send({ from: account() })
  }

  function rejectTransaction(_transId: string) {
    contract.methods.rejectTransaction(_transId).send({ from: account() })
  }
  function submitBill() {
    contract.methods.submitBill(bill()).send({ from: account() })
  }

  function submitTransaction() {
    contract.methods
      .submitTransaction(recipt(), amt())
      .send({ from: account() })  
    
  }

  function displayTransactions() {
    contract.methods
      .transactionCount()
      .call()
      .then((res) => {
        console.log(res);
        for (let i = 0; i <= res; i++) {
          contract.methods
            .transactions(i)
            .call()
            .then((r) => {
              setTransactions([...transactions, r]);
            });
        }
      });

    // console.log(transactions)
  }

  async function getOwner() {
    let ownerAdd = await contract.methods.government().call();
    setOwner(() => ownerAdd);
  }

  return (
    <main class=" mx-auto p-4">
      <Show when={account} fallback={<div>Refresh the page</div>}>
        <div class="py-2 text-lg text-white"> User Account : {account}</div>
      </Show>
      <div>
        <button
          class="btn text-white px-4 py-2 m-2 rounded-lg"
          onClick={submitBill}
        >
          Submit Bill
        </button>
        <input
          type="text"
          placeholder="Transaction ID"
          onChange={(e) => setBill(e.currentTarget.value)}
        />
      </div>

      <div>
        <button
          class="btn text-white px-4 py-2 m-2 rounded-lg"
          onClick={submitTransaction}
        >
          Submit Transaction
        </button>
        <input
          type="text"
          placeholder="Amount"
          onChange={(e) => setAmt(e.currentTarget.value)}
        />
        <input
          type="text"
          placeholder="Recepient Address"
          onChange={(e) => setRecipt(e.currentTarget.value)}
        />
      </div>

      <div>
        <For each={transactions}>
          {(transaction) => (
            <TransCard
              transaction={transaction}
              reject={rejectTransaction}
              approve={approveTransaction}
              owner={owner}
              userAccount={account}
            />
          )}
        </For>
      </div>
    </main>
  );
};

export const TransCard = (props) => {
  const ethereum = window.ethereum;
  const web3 = new Web3(ethereum);

  return (
    <div class="p-6 bg-white rounded-lg my-4 max-w-5xl mx-auto">
      <div class="md:flex justify-between items-center my-4">
        <div>
          <div>ID : {props.transaction.id}</div>
          <div>Recipient : {props.transaction.recipient}</div>
          <div>Amount : {props.transaction.amount}</div>
        </div>
        <div class="md:px-8">
          <div>
            Status : <b>{TransactionStatus[props.transaction.status]}</b>
          </div>
          <div>
            Bill : <b>{BillStatus[props.transaction.billStatus]}</b>
          </div>
        </div>
      </div>
      <Show
        when={
          props.owner() == web3.utils.toChecksumAddress(props.userAccount())
        }
      >
        <div class="flex items-center">
          <button
            class=" bg-green-600 text-white px-4 py-2 m-2 rounded-lg"
            onClick={() => props.approve(props.transaction.id)}
          >
            Approve
          </button>

          <button
            class="bg-[#a90f04] text-white px-4 py-2 m-2 rounded-lg"
            onClick={() => props.reject(props.transaction.id)}
          >
            Reject
          </button>
        </div>
      </Show>
    </div>
  );
};

export default GovTransactions;
