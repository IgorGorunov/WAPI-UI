import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./styles.scss"

export {toast, ToastContainer};

// components/ToastMessage.tsx
export const showToast = (message: string) => {
    toast.error(message);
};