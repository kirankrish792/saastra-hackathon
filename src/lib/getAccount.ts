const getAccount = async (web: any, setAccount: any) => {
  const accounts = await web().eth.getAccounts();
  setAccount(accounts[0]);
};

export default getAccount;
