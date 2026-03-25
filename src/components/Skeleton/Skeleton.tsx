import React from 'react';
import styles from './styles.module.scss';

const Skeleton = ({ type, width, height }) => {
    if (type === 'spinner') {
        return <div className={styles["skeleton-spinner"] || "skeleton-spinner"} style={{ width, height }}></div>;
    }

    if (type === 'line') {
        return <div className={`${styles["skeleton-line"] || "skeleton-line"} ${styles.line || "line"}`} style={{ width, height }}></div>;
    }

    if (type === 'loading') {
        return (
            <div className={styles.loading || "loading"}>Loading...</div>
        );
    }
    if (type === 'round') {
        return (
            <span className={styles.round || "round"}></span>
        );
    }

    if (type === 'files-uploading') {
        return (
            <span className={styles["files-uploading"] || "files-uploading"}>Files uploading...</span>
        );
    }



    return null;
}

export default Skeleton;
