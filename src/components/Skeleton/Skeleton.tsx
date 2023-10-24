import React from 'react';
import './styles.scss';

const Skeleton = ({ type, width, height }) => {
    if (type === 'spinner') {
        return <div className="skeleton-spinner" style={{ width, height }}></div>;
    }
    if (type === 'line') {
        return <div className="line" style={{ width, height }}></div>;
    }
}

export default Skeleton;