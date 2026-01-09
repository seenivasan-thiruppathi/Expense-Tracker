import axiosInstance from "../../axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTransactions = createAsyncThunk(
    "transactions/fetchTransactions",
    async (params = {}) => {
        const response = await axiosInstance.get('/api/transactions', { params });
        return response.data || [];
    }
);

export const fetchCategories = createAsyncThunk(
    "transactions/fetchCategories",
    async (type) => {
        if (!type) return [];
        const response = await axiosInstance.get(`/api/categories/type/${type}`);
        return response.data;
    }
);

const transactionSlice = createSlice({
    name: "transactions",
    initialState: {
        transactions: [],
        analyticsData: [],
        loading: false,
        error: null,
        filters: {
            type: "",
            category: "",
            startDate: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1)).toISOString(),
            endDate: new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth() + 1, 0)).toISOString(),
        },
        categories: [],
        searchTerm: "",
    },
    reducers: {
        setType: (state, action) => {
            state.filters.type = action.payload;
            state.filters.category = ""; // reset category
        },
        setCategory: (state, action) => {
            state.filters.category = action.payload;
        },
        setStartDate: (state, action) => {
            state.filters.startDate = action.payload.toISOString();
        },
        setEndDate: (state, action) => {
            state.filters.endDate = action.payload.toISOString();
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        resetFilters: (state) => {
            const now = new Date();
            state.filters.type = "";
            state.filters.category = "";
            state.filters.startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)).toISOString();
            state.filters.endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0)).toISOString();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload.txns || [];
                state.analyticsData = action.payload.analyticsData || [];
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            });
    },
});

export const { setType, setCategory, setStartDate, setEndDate, setSearchTerm, resetFilters } = transactionSlice.actions;

export default transactionSlice.reducer;