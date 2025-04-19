// src/features/books/booksSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch books from backend API
export const fetchBooks = createAsyncThunk('books/fetchBooks', async (_, { getState }) => {
    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.post(
            'http://localhost:3000/api/v1/books/getBooks', 
            {}, 
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            }
        );
        console.log("Token from localStorage:", localStorage.getItem("accessToken"));

        console.log("Books fetched from backend:", response.data); // This should be an array of books
        return response.data; // Return the array directly
    } catch (error) {
        console.error("Error fetching books:", error.response?.data || error.message);
        throw error;
    }
});


const booksSlice = createSlice({
    name: 'books',
    initialState: {
        dbBooks: [],  // Books from your database
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBooks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.dbBooks = action.payload; // Use the data directly
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default booksSlice.reducer;
