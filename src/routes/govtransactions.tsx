import { For, Show, createSignal, onMount, useContext } from "solid-js";

import TransactionAbi from "../contractAbi/transaction.json";
import Web3 from "web3";
import { useUsercontext } from "~/components/UserProvider";
import { createStore } from "solid-js/store";

const GovTransactions = () => {
  enum TransactionStatus {
    Pending,
    Approved,
    Rejected,
  }
  enum BillStatus {
    NotSubmitted,
    Submitted,
  }

  const [approve, setApprove] = createSignal("");
  const [reject, setReject] = createSignal("");
  const [bill, setBill] = createSignal("");
  const [recipt, setRecipt] = createSignal("");
  const [amt, setAmt] = createSignal(0);

  const [transactions, setTransactions] = createStore<any[]>([]);

  const { account, setAccount } = useUsercontext();
  const ethereum = window.ethereum;
  const web3 = new Web3(ethereum);

  const contractAddress = "0x0684008bb58D239B09B22Be5299B481b176313f9";

  // Create an instance of the contract
  const abi = TransactionAbi;
  const contract = new web3.eth.Contract(abi, contractAddress);

  function approveTransaction() {
    contract.methods.approveTransaction(approve()).send({ from: account() });
  }

  function rejectTransaction() {
    contract.methods.rejectTransaction(reject()).send({ from: account() });
  }
  function submitBill() {
    contract.methods.submitBill(bill()).send({ from: account() });
  }

  function submitTransaction() {
    contract.methods
      .submitTransaction(recipt(), amt())
      .send({ from: account() });
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

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <div>
        <button
          class="bg-blue-500 text-white px-4 py-2 m-2 rounded-lg"
          onClick={approveTransaction}
        >
          Approve Transaction
        </button>
        <input
          type="text"
          onChange={(e) => setApprove(e.currentTarget.value)}
        />
      </div>
      <div>
        <button
          class="bg-blue-500 text-white px-4 py-2 m-2 rounded-lg"
          onClick={rejectTransaction}
        >
          Reject Transaction
        </button>
        <input
          type="text"
          onChange={(e) => setApprove(e.currentTarget.value)}
        />
      </div>
      <div>
        <button
          class="bg-blue-500 text-white px-4 py-2 m-2 rounded-lg"
          onClick={submitBill}
        >
          Submit Bill
        </button>
        <input type="text" onChange={(e) => setBill(e.currentTarget.value)} />
      </div>

      <div>
        <button
          class="bg-blue-500 text-white px-4 py-2 m-2 rounded-lg"
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
        <button
          class="bg-blue-500 text-white px-4 py-2 m-2 rounded-lg"
          onClick={displayTransactions}
        >
          Transactions
        </button>
      </div>

      <div>
        <For each={transactions}>
          {(transaction) => (
            <div>
              {transaction.id}
              {transaction.recipient}
              {transaction.amount}
              {TransactionStatus[transaction.status]}
              {BillStatus[transaction.billStatus]}
            </div>
          )}
        </For>
      </div>
    </main>
  );
};

export default GovTransactions;
