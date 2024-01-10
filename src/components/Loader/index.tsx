import React from 'react';
import Skeleton from "@/components/Skeleton/Skeleton";
import './styles.scss';

const Loader: React.FC = () => {
    return (
        <div className='loader-wrapper'>
            <Skeleton type="round" width="500px" height="300px"/>
        </div>
    );
};

export default Loader;