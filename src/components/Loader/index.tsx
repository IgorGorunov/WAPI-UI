import React from 'react';
import Skeleton from "@/components/Skeleton/Skeleton";
import styles from './styles.module.scss';

type LoaderProps = {
    inline?: boolean;
};

const Loader: React.FC<LoaderProps> = ({ inline }) => {
    return (
        <div className={`${styles['loader-wrapper']} ${inline ? styles['inline'] : ''}`}>
            <Skeleton type="round" width="500px" height="300px" />
        </div>
    );
};

export default Loader;