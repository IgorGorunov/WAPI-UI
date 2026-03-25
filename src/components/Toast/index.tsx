import { toast, ToastContainer as OriginalToastContainer } from 'react-toastify';
import styles from "./styles.module.scss";

const ToastContainer = (props: any) => (
    <OriginalToastContainer className={styles.toastWrapper} {...props} />
);

export { toast, ToastContainer };

// components/ToastMessage.tsx
export const showToast = (message: string) => {
    toast.error(message);
};