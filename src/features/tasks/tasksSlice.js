// src/features/tasks/tasksSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase/config';

const TASKS_COLLECTION = 'tasks';

// Thunk: Cargar tareas del usuario
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId, { rejectWithValue }) => {
    try {
      const q = query(
        collection(db, TASKS_COLLECTION),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toMillis?.() ?? null,
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk: Crear tarea
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async ({ title, description, userId }, { rejectWithValue }) => {
    try {
      const newTask = {
        title,
        description,
        status: 'pending',
        userId,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, TASKS_COLLECTION), newTask);
      return {
        id: docRef.id,
        ...newTask,
        createdAt: Date.now(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk: Actualizar tarea (título, descripción o estado)
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      const taskRef = doc(db, TASKS_COLLECTION, id);
      await updateDoc(taskRef, changes);
      return { id, changes };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk: Eliminar tarea
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, TASKS_COLLECTION, taskId));
      return taskId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    loading: false,
    error: null,
    loaded: false, 
  },
  reducers: {
    clearTasks(state) {
      state.items = [];
      state.loaded = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.loaded = true;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create
    builder
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Update
    builder
      .addCase(updateTask.fulfilled, (state, action) => {
        const { id, changes } = action.payload;
        const task = state.items.find((t) => t.id === id);
        if (task) Object.assign(task, changes);
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload;
      });

    // Delete
    builder
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearTasks } = tasksSlice.actions;
export default tasksSlice.reducer;