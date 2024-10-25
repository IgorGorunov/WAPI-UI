import React from 'react';
import './styles.scss';

type LoomVideoProps = {
    url: string;
}

const LoomVideo: React.FC<LoomVideoProps> = ({ url }) => {""
    const fixTheLink = (url: string) => {
        return url.includes('/share/') ? url.replace('/share/', '/embed/') : url;
    }

    return (
        <div className='loom-video-wrapper'>
            <iframe className='loom-video-iframe'
                    src={fixTheLink(url)}
                    loading="lazy"
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
            <video controls autoPlay width="100%" height="100%" preload="metadata">
                <source src={url} type="video/mp4"/>
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default LoomVideo;