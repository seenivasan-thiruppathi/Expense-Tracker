"use client";
import React from "react";
import {
  // Table,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableHead,
  // TableRow,
  // Paper,
  colors,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TransactionModal from "./TransactionModal";
import { CircularProgress } from "@mui/joy";
import { capitalize } from "../../utils/helper";

const TransactionTable = ({ rows, theadStyles, txnsLen, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState("add");
  const [editTxnID, setEditTxnID] = React.useState(null);
  const recentTxns = rows;
  const router = useRouter();
  const TCellStyles = { fontSize: 14, fontWeight: 400 };
  return (
    // <TableContainer component={Paper} >
    <>
      <table
        className="w-full mx-auto  rounded-xl shadow-lg"
        aria-label="Transactions table"
      >
        <thead className="rounded-tr-xl rounded-tl-xl">
          <tr className="bg-violet-100 rounded-tr-xl py-3">
            <th className="txn-table-head sm:table-cell hidden" align="center">
              Date
            </th>
            <th className="txn-table-head sm:table-cell hidden" align="center">
              Category
            </th>
            <th className="txn-table-head" align="center">
              Description
            </th>
            <th className="txn-table-head" align="center">
              Amount(₹)
            </th>
            {/* <th sx={theadStyles} align="left">
              <FaRegEdit />
            </th> */}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center py-10">
                <div className="flex flex-col justify-center items-center">
                  <CircularProgress
                    size="lg"
                    variant="soft"
                    color="neutral"
                    value={60}
                  />
                  <p className="text-slate-500 text-center text-sm mt-3">
                    Loading...
                  </p>
                </div>
              </td>
            </tr>
          ) : txnsLen > 0 ? (
            rows?.length > 0 ? (
              rows.map((row) => (
                <tr
                  className="py-3 cursor-pointer hover:bg-gray-200 not-last:border-b border-gray-300 border-b-"
                  key={row._id}
                  onClick={() => {
                    setIsModalOpen(true);
                    setModalType("edit");
                    setEditTxnID(row._id);
                  }}
                >
                  <td
                    className="txn-table-cell sm:table-cell hidden "
                    align="center"
                    sx={TCellStyles}
                  >
                    {moment(row.date).format("DD-MM-YYYY hh:mm A")}
                  </td>
                  <td className="txn-table-cell sm:block hidden">
                    {capitalize(row.category)}
                  </td>
                  <td
                    className="txn-table-cell text-violet-600! sm:text-slate-800!"
                    sx={TCellStyles}
                  >
                    <p> {row.description}</p>

                    <p className="text-[10px] sm:hidden block pb-1.5 pt-1.5 text-slate-800">
                      Category:{" "}
                      <span className="text-xs text-blue-600">
                        {capitalize(row.category)}
                      </span>
                    </p>
                    <p className="text-[10px] sm:hidden  block text-slate-800">
                      {moment(row.date).format("DD-MM-YYYY")}
                    </p>
                  </td>
                  <td
                    className={`txn-table-cell font-medium ${
                      row.txnType == "Income"
                        ? "text-green-500!"
                        : "text-red-500!"
                    }`}
                  >
                    ₹{row.amount.toLocaleString()}
                  </td>
                  {/* {console.log("txn table row.txnType:", row.txnType)} */}
                  {/* <td>
                <Link href={`/transactions/${row._id}`}>
                  <FaRegEdit className="text-blue-500 text-lg" />
                </Link>
              </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-5">
                  <p className="text-sm font-medium text-center text-purple-500">
                    No Records Found..
                  </p>
                  <p className="text-sm font-normal text-slate-700 text-center">
                    Try Adjusting your Search or Add a new Transaction
                  </p>
                </td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan={4} className="py-5">
                <p className="text-sm font-medium text-center text-purple-500">
                  No Records Found..
                </p>
                <p className="text-sm font-normal text-slate-700 text-center">
                  Try Adjusting your Search or Add a new Transaction
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <TransactionModal
        isModalOpen={isModalOpen}
        modalType={modalType}
        editTxnID={editTxnID}
        Txns={recentTxns}
        setIsModalOpen={setIsModalOpen}
      />
    </>
    // </TableContainer>
  );
};

export default TransactionTable;
