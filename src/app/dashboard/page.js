"use client";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context/UserContext";
// import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

// https://chat.mistral.ai/chat/13fa5c37-20a5-4390-aec4-209b91592369 style guide chat reply
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import {
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import dayjs from "dayjs";
import axiosInstance from "../axiosInstance";
import TransactionTable from "../components/TransactionTable";
import Link from "next/link";
import PieActiveArc from "../components/CategoriesChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import { ArrowRight, Plus, TrendingDown, TrendingUp, Wallet } from "lucide-react";
// import Modal from "../components/Modal";
// import TransactionForm from "../components/TransactionForm";
// import { set } from "mongoose";
import TransactionModal from "../components/TransactionModal";
import { CircularProgress } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../store/slices/transactionSlice";

const Page = () => {
  const { user, userloading, error } = useContext(UserContext);
  console.log('context user:', user)
  // const [date, setDate] = useState(dayjs());
  // const handleDateChange = (newValue) => {
  //   setDate(newValue.toISOString());
  //   console.log(newValue);
  //   console.log("Selected Date:", newValue ? newValue.toISOString() : null);
  //   console.log(date.format("DD-MM-YYYY hh:mm A"));
  // };
  // const dayjsValue = dayjs();

  // Fetching Transactions
  const [recentTxns, setRecentTxns] = useState([]);

  // Getting current month's all Transactions
  // const [allTxns, setAllTxns] = useState([]);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [analyData, setAnalyData] = useState([]);
  // const [balance, setBalance] = useState(0);
  // const [exCatData, setExCatData] = useState([]);
  // const [incCatData, setIncCatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [txnsLen, setTxnsLen] = useState(0);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTxnID, setEditTxnID] = useState("");
  const [modalType, setModalType] = useState("");

  // Date range
  const now = new Date();
  const [startDate, setStartDate] = useState(
    new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)).toISOString()
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1)).toISOString()
  );
  const dispatch = useDispatch();
  const { transactions } = useSelector(state => state.transactions);
  // dispatch(fetchTransactions({ startDate, endDate}));
  console.log("redux store- transactions:", transactions)

  // Fetching recent (10) Transactions
  const fetchRecentTransactions = async () => {
    try {
      setLoading(true);
      const params = { limit: 10 };
      params.startDate = startDate;
      params.endDate = endDate;
      const response = await axiosInstance.get("/api/transactions", { params });
      console.log("/dashboard/page.js recent Txn :", response.data.txns);
      console.log("/dashboard/page.js recent response :", response);
      if (response.data.txns?.length > 0) {
        setRecentTxns(response.data.txns);
      }
      setTxnsLen(response.data.txns?.length);
      setAnalyData(response.data.analyticsData);
      // const income = response.data.analyticsData[0]?.totalAmount;
      // const expense = response.data.analyticsData[1]?.totalAmount;
      // const bal = income - expense;

      // setTotalIncome(income);
      // setTotalExpense(expense);
      // setBalance(bal);
      // console.log("totalExpense:", totalExpense);
      // setBalance(totalIncome - totalExpense);
      // console.log(response.data);
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetching all transactions of the month
  // const fettchAllTransactions = async () => {
  //   try {
  //     const params = { startDate: startDate, endDate: endDate };

  //     const response = await axiosInstance.get("/api/transactions", { params });
  //     console.log("/dashboard/page.js all Txn :", response.data.txns);
  //     if (response.data.txns?.length > 0) {
  //       setAllTxns(response.data.txns);
  //     }
  //   } catch (error) {
  //     console.error("error", error);
  //   }
  // };
  useEffect(() => {
    // console.log("Transactions Page mounted ");

    fetchRecentTransactions();
  }, []);
  const totInc = () => {
    const found = analyData?.find(item => item.txnType === 'Income');
    return found ? found.totalAmount : 0;
  }
  const totExp = () => {
    const found = analyData?.find(item => item.txnType === 'Expense');
    return found ? found.totalAmount : 0;
  }
  useEffect(() => {
    console.log("AnalyData updated:", analyData);

    setTotalIncome(totInc());
    setTotalExpense(totExp());

  }, [analyData]);
  // console.log("dashboard All Txns:", allTxns);
  // Calculating category wise total amount spent current month
  // const categoryTotal = allTxns.map((txn) => {});

  function createData(_id, date, category, description, amount, txnType) {
    return { _id, date, category, description, amount, txnType };
  }

  const rows = recentTxns.map((txn) =>
    createData(
      txn._id,
      txn.date,
      txn.category,
      txn.description,
      txn.amount,
      txn.txnType
    )
  );

  console.log("AnalyData", analyData);

  // setExCatData(analyData[1].categories);
  // console.log("exCatData:", exCatData);
  // console.log("rows", rows);
  const theadStyles = {
    color: "#7008e7",
    fontWeight: 600,
    fontSize: 16,
  };
  return (
    <div className="text-black text-center w-full  mx-auto text-2xl my-5">
      <h2 className="capitalize text-left mb-5 font-semibold text-blue-500 ">Welcome back, {user.name}!</h2>
      {/* <p className="text-slate-800 text-[13px]">{JSON.stringify(user)}</p>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          value={date}
          onChange={handleDateChange}
          enableAccessibleFieldDOMStructure={false}
          slots={{
            textField: (params) => <TextField {...params} />,
          }}
        />
      </LocalizationProvider>
      <p className="text-black">{dayjsValue.toISOString()}</p> */}
      {loading ? (
        <div className="flex justify-center items-center h-screen w-screen fixed inset-0 z-100">
          <div className="justify-center items-center">
            <CircularProgress size="lg" variant="soft" color="neutral" value={60} />
            <p className="text-slate-500 text-center text-sm mt-3">
              Loading...
            </p>
          </div>
        </div>
      ) : txnsLen > 0 ? (
        <>
          <div className="flex flex-col md:flex-row mx-auto gap-8 lg:flex-nowrap flex-wrap justify-between mb-10 z-10!">
            {analyData.map((data) => (
              <div
                key={data.txnType}
                className={
                  " bg-white px-5 py-5 lg:w-[33%]  w-[80%] mx-auto min-h-[300px] rounded-xl items-center shadow-xl gap-5"
                }
              >
                <div className="flex flex-row items-center gap-3">
                  <div
                    className={`px-3 py-2 rounded-lg ${data.txnType === "Income" ? "bg-green-100" : "bg-red-100"
                      }`}
                  >
                    {data.txnType === "Income" ? (
                      <BarChartIcon className=" text-green-500" />
                    ) : (
                      <BarChartIcon className="text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-800 font-medium">
                      {data.txnType} BreakDown
                    </p>
                  </div>
                </div>
                <PieActiveArc data={analyData} type={data.txnType} totalIncome={totalIncome} totalExpense={totalExpense} />
              </div>
            ))}

            <div className="bg-white px-10 lg:px-3 lg:w-[33%] w-[80%] mx-auto min-h-[300px] flex flex-col justify-evenly rounded-xl shadow-lg">
              <div className="flex flex-row items-center gap-3">
                <div className={"p-3 rounded-lg bg-green-100"}>
                  <TrendingUp className=" text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-800 font-medium text-left">
                    Total Income
                  </p>
                  <h3 className="text-xl font-bold text-left text-green-500">
                    ₹ {/* ₹ {
                      (() => {
                        const found = analyData?.find(item => item.txnType === 'Income');
                        return found ? ` ${found.totalAmount}` : " 0";
                      })() }*/
                      totalIncome.toLocaleString()
                    }
                  </h3>
                </div>
              </div>
              <div className="flex flex-row items-center gap-3">
                <div className={"p-3 rounded-lg bg-red-100"}>
                  <TrendingDown className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-800 font-medium text-left">
                    Total Expense
                  </p>
                  <h3 className="text-xl font-bold text-left text-red-500">
                    ₹ {
                      // (() => {
                      //   const found = analyData?.find(item => item.txnType === 'Income');
                      //   return found ? ` ${found.totalAmount}` : " 0";
                      // })() 
                      totalExpense.toLocaleString()
                    }
                  </h3>
                </div>
              </div>
              <div className="flex flex-row items-center gap-3">
                <div className={"p-3 rounded-lg bg-blue-100"}>
                  <Wallet className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-800 font-medium text-left">
                    Balance
                  </p>
                  <h3 className="text-xl font-bold text-left text-blue-500">
                    ₹ {(totalIncome - totalExpense).toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-5 text-right">
            <h2 className="text-left text-2xl mb-3 sm:mb-0 font-semibold text-blue-600">Recent Transactions</h2>
            <div className="
            flex gap-4 justify-between sm:justify-end w-full sm:w-auto">

              <button
                className="bg-amber-100 border border-amber-200 text-amber-500 px-3 py-2 flex items-center gap-1.5 text-sm rounded-md font-medium cursor-pointer"
                onClick={() => {
                  setIsModalOpen(true);
                  setModalType('add');

                }}
              ><Plus />
                <span>
                  Add Transaction
                </span>
              </button>
              <Link
                href={"/transactions"}
                className="bg-cyan-100 border border-cyan-200 text-cyan-500 text-sm font-medium rounded-lg px-3 py-2 flex items-center gap-1.5"
              >
                <span>All Transactions
                </span>  <ArrowRight />
              </Link>
            </div>
          </div>
          <div className="mb-5">
            <TransactionTable
              rows={rows}
              txnsLen={txnsLen}
              theadStyles={theadStyles}
            />
          </div>

        </>
      ) : (
        <>
          <div>
            <h2>No Transactions Found..</h2>
            <p>
              Please start adding your Transactions here:
              <button
                className="bg-amber-100 border border-amber-200 text-amber-500 px-3 py-2 text-sm rounded-md font-medium"
                onClick={() => {
                  setIsModalOpen(true);
                  setModalType('add');
                }}
              >
                Add
              </button>
            </p>
          </div>
        </>
      )}

      {/* Add Transaction Modal
      <Modal
        isOpen={isModalOpen}
        title={`${modalType === 'add' ? 'Add' : 'Edit'} Transaction`}
        onClose={() => setIsModalOpen(false)}       
      >
        {modalType === 'add' ? <TransactionForm /> : <TransactionForm
          initialData={recentTxns.find((item) => item._id === editTxnID)}
        />}
      </Modal> */}
      <TransactionModal isModalOpen={isModalOpen} modalType={modalType} editTxnID={editTxnID} Txns={recentTxns} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};

export default Page;
