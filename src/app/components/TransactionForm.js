"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import RadioGroup from "./Inputs/RadioGroup.js";
import Input from "./Inputs/Input.js";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axiosInstance from "../axiosInstance.js";
import toast from "react-hot-toast";
// import { log } from "console";
import { capitalize } from "../../utils/helper.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, resetFilters } from "../store/slices/transactionSlice.js";


const TransactionForm = ({ initialData = {}, setIsModalOpen }) => {
  console.log("Txn Form -Initial Data:", initialData);

  const [type, setType] = useState(initialData?.txnType || "Expense");
  const [amount, setAmount] = useState(initialData?.amount || Number);
  const [category, setCategory] = useState(initialData?.category || "");
  const [desc, setDesc] = useState(initialData?.description || "");
  const [date, setDate] = useState(dayjs(initialData?.date) || dayjs());
  const [catOptions, setCatOptions] = useState(initialData?.catOptions || []);
  const isEditing = Boolean(initialData?._id);
  const router = useRouter();
  const path = usePathname();
  // console.log("/TXN FOrm isEditing:", isEditing);

  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { filters } = useSelector(state => state.transactions);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`/api/categories/type/${type}`);
      console.log("/api/categories/type/[type] response", response.data);
      if (response.data.length > 0) {
        setCatOptions(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [type]);

  useEffect(() => {
    if (initialData?.category) {
      setCategory(initialData?.category);
      return;
    }
  }, []);

  const handleDateChange = (newValue) => {
    setDate(newValue);
    console.log(newValue);
    console.log("Selected Date:", newValue ? newValue.toISOString() : null);
    console.log(date.format("DD-MM-YYYY hh:mm A"));
  };

  const data = {
    txnType: type,
    amount: amount,
    category: category,
    description: desc,
    date: date.toISOString(),
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    // Validate whether all Inputs entered
    if (!amount) {
      setError("Please enter the Amount");
      return;
    }
    if (amount <= 0) {
      setError("Amount should be greater than 0");
      return;
    }
    if (!category) {
      setError("Please enter the Category");
      return;
    }
    if (!date) {
      setError("Please select the date");
      return;
    }
    setError("");

    try {
      if (isEditing) {
        const res = await axiosInstance.put(
          `/api/transactions/${initialData?._id}`,
          data
        );

        console.log(
          "Transaction updated Successfully- updated Transaction:",
          res
        );
        toast.success("Transaction Updated");
      } else {
        const res = await axiosInstance.post(`/api/transactions/`, data);
        console.log(
          "Transaction Created Successfully- Created Transaction:",
          res
        );
        toast.success("Transaction Created");
      }
    } catch (error) {
      console.log("error on Editing or creating transaction:", error.message);
    } finally {
      setIsModalOpen(false);
    }
    if (path === '/transactions') {
      dispatch(fetchTransactions(filters));
    }
    if (path === '/dashboard') {
      resetFilters();
      dispatch(fetchTransactions(filters));
    }
    // Clean the URL to remove any unwanted params
    // router.replace(router.pathname);
  };

  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(`/api/transactions/${id}`);
      console.log("Deleted successfully -id:", id);
      console.log("Deleted successfully res:", res);
      toast.success("Transaction Deleted");
    } catch (error) {
      console.log("Error deleting txn", error);
    } finally {
      setIsModalOpen(false);
    }
    if (path === '/transactions') {
      dispatch(fetchTransactions(filters));
    }
    else if (path === '/dashboard') {
      resetFilters();
      dispatch(fetchTransactions(filters));
    }
    
    // Clean the URL to remove any unwanted params
    // router.replace(router.pathname);
  };

  return (
    <div className="w-full mx-auto txn-form">
      <form>
        <RadioGroup
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setCategory("");
          }}
          values={["Expense", "Income"]}
        />
        <Input
          label={"Amount"}
          type={"Number"}
          placeholder={"Enter Amount"}
          prefix={"₹"}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        {/* <Input
          label={"Category"}
          type={"text"}
          placeholder={"Enter Category"}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        /> */}
        <div className="flex flex-col txn-form-elem">
          <label
            htmlFor="category-selector"
            className="text-slate-800 text-[13px] mb-2"
          >
            Category
          </label>
          <FormControl fullWidth>
            {/* <InputLabel id="demo-simple-select-label">Select Category</InputLabel> */}

            <Select
              labelId="category-selector"
              id="category-selector"
              value={category}
              className="w-full mb-3"
              placeholder="Select Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {catOptions.map((catOption, index) => (
                <MenuItem key={catOption._id} value={catOption.name}>
                  {capitalize(catOption.name)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <Input
          label={"Description"}
          type={"text"}
          placeholder={"Enter Description"}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <div className="flex flex-col">
          <label
            htmlFor="dateTimePicker"
            className="text-slate-800 text-[13px] my-3"
          >
            Date
          </label>
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
        </div>
        {error && (
          <p className="text-red-500 font-medium text-[13px] pb-3">{error}</p>
        )}
        <div className="flex justify-end gap-5 items-center mt-3">
          {isEditing ? (
            <button
              className="bg-error-500 hover:bg-error-600 text-white px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-colors duration-200"
              onClick={() => handleDelete(initialData._id)}
            >
              Delete
            </button>
          ) : (
            ""
          )}
          <button
            type="submit"
            onClick={submitHandler}
            className="text-blue-500 border hover:bg-blue-200 border-blue-300 bg-blue-100 text-sm font-medium  rounded-md px-4 py-2 cursor-pointer transition-colors duration-200"
          >
            {isEditing ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default TransactionForm;
