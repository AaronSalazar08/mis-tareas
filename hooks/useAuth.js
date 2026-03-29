import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { setUser } from '../features/auth/authSlice';
import { clearTasks } from '../features/tasks/tasksSlice';

const useAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          })
        );
      } else {
        dispatch(setUser(null));
        dispatch(clearTasks());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
};

export default useAuth;