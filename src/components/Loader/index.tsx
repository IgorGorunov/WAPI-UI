import React from 'react';
import Skeleton from "@/components/Skeleton/Skeleton";
import styles from './styles.module.scss';

const Loader: React.FC = () => {
    return (
        <div className={styles['loader-wrapper']}>
            <Skeleton type="round" width="500px" height="300px" />
        </div>
    );
};

export default Loader;