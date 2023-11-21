import React from 'react';
import './styles.scss';

const Skeleton = ({ type, width, height }) => {
    if (type === 'spinner') {
        return <div className="skeleton-spinner" style={{ width, height }}></div>;
    }

    if (type === 'line') {
        return <div className="line" style={{ width, height }}></div>;
    }

    if (type === 'loading') {
        return (
            <div className="loading">Loading...</div>
        );
    }
    if (type === 'round') {
        return (
            <span className="round"></span>
        );
    }

    if (type === 'files-uploading') {
        return (
            <span className="files-uploading">Files uploading...</span>
        );
    }



    return null;
}

export default Skeleton;
