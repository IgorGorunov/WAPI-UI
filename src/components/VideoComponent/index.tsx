import React from 'react';
import VideoEmbedded from "@/components/VideoEmbedded";
import './styles.scss';

type VideoComponentPropsType = {
    _id: string;
    _type: string;
    heading?: string | null;
    videoSource: string;
    videoUrl: string | null;
    videoFileUrl: string | null;
    mimeType: string | null;
}

const VideoComponent: React.FC<VideoComponentPropsType> = (props) => {
    const {heading, videoSource, videoUrl, videoFileUrl, mimeType} = props;

    return (
        <div className='video-component'>
            {heading ? <h3>{heading}</h3> : null}
            <div className='video-component__wrapper'>
                {videoSource === 'url' && videoUrl ? (
                    // <iframe
                    //     width="560"
                    //     height="315"
                    //     src={videoUrl}
                    //     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    //     allowFullScreen
                    // ></iframe>
                    <VideoEmbedded url={videoUrl} />
                ) : videoSource === 'file' && videoFileUrl ? (
                    <video controls width="560" height="315">
                        <source src={videoFileUrl} type={mimeType || 'video/mp4'} />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <p>No video available</p>
                )}
            </div>
        </div>
    )
}

export default VideoComponent;