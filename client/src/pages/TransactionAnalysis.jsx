import TransactionHourChart from "../components/TransactionHourChart";
import NavBar from "../components/NavBar";
import Menu from "../components/Menu";
import PoolGraphByEpoch from "../components/PoolGraphByEpoch";
import { useState, useEffect } from "react";
import axios from "axios";
import URL from "../../constants";

function TransactionAnalysis() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [data, setData] = useState({
        transactionData: [],
        activeAccountsData: [],
        poolData: []
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setIsSuccessful(false);
            try {
                // Fetch transaction stats
                const transactionResponse = await axios.get(`${URL}/rest/v1/daily-stats`);
                const transactionData = transactionResponse.data.data.transactionsPerMinute.map((count, index) => ({
                    minute: index + 1,
                    transactionCount: count,
                }));

                // Fetch active accounts data
                const activeAccountsResponse = await axios.get(`${URL}/rest/v1/active-accounts`);
                const activeAccountsData = activeAccountsResponse.data.data.map((epoch) => ({
                    epoch: epoch.epoch,
                    activeAccounts: epoch.activeAccounts,
                }));

                // Fetch pool data
                const poolResponse = await axios.get(`${URL}/rest/v1/pools.json?rows=true&limit=1000`);
                const poolData = poolResponse.data.rows;

                setData({
                    transactionData,
                    activeAccountsData,
                    poolData
                });
                setIsSuccessful(true);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <NavBar />
            <main className="flex flex-col lg:flex-row bg-primaryBg">
                <Menu />
                <div className="ml-2 sm:ml-6 lg:ml-28 flex-1">
                    {loading && (
                        <div className="flex items-center justify-center w-full h-screen">
                            <div className="text-black">
                                <span className="loading loading-infinity loading-lg"></span>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center justify-center w-full h-screen">
                            <p className="text-red-600 text-lg font-bold">{error.message}</p>
                        </div>
                    )}
                    {isSuccessful && (
                        <>
                            <TransactionHourChart 
                                transactionData={data.transactionData}
                                activeAccountsData={data.activeAccountsData}
                            />
                            <PoolGraphByEpoch poolData={data.poolData} />
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default TransactionAnalysis;