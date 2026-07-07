import { toast, ToastContainer as OriginalToastContainer } from 'react-toastify';
import styles from "./styles.module.scss";

import Draggable from 'react-draggable';

const ToastContainer = (props: any) => (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }}>
        <Draggable handle=".Toastify__toast" cancel=".Toastify__close-button, button, a">
            <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
                <OriginalToastContainer className={styles.toastWrapper} {...props} />
            </div>
        </Draggable>
    </div>
);

export { toast, ToastContainer };

// components/ToastMessage.tsx
export const showToast = (message: string) => {
    toast.error(message);
};