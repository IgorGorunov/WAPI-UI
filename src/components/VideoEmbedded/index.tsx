import React from 'react';
import './styles.scss';

type VideoEmbeddedProps = {
    url: string;
    mimeType?: string;
}

const formatEmbedUrl = (url: string) => {
    const youtubeShortsRegex = /https:\/\/www\.youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;
    const youtubeRegularRegex = /https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
    const loomRegex = /https:\/\/www\.loom\.com\/share\/([a-zA-Z0-9]+)/;
    const vimeoRegex = /https:\/\/vimeo\.com\/([0-9]+)/;

    const youtubeShortsMatch = url.match(youtubeShortsRegex);
    const youtubeRegularMatch = url.match(youtubeRegularRegex);
    const loomMatch = url.match(loomRegex);
    const vimeoMatch = url.match(vimeoRegex);

    // if (youtubeShortsMatch) {
    //     return `https://www.youtube.com/embed/${youtubeShortsMatch[1]}`;
    // } else if (youtubeRegularMatch) {
    //     return `https://www.youtube.com/embed/${youtubeRegularMatch[1]}`;
    if (youtubeShortsMatch) {
        return `https://www.youtube-nocookie.com/embed/${youtubeShortsMatch[1]}`;
    } else if (youtubeRegularMatch) {
        return `https://www.youtube-nocookie.com/embed/${youtubeRegularMatch[1]}`;
    } else if (loomMatch) {
        return `https://www.loom.com/embed/${loomMatch[1]}`;
    } else if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Return the original URL if it's not a known embeddable format
    return url;
};

const VideoEmbedded: React.FC<VideoEmbeddedProps> = ({ url, mimeType='' }) => {

    const embedUrl = url ? formatEmbedUrl(url) : null;

    return (
        <div className='embedded-video-wrapper'>
            <iframe className='embedded-video-iframe'
                    src={embedUrl}
                    loading="lazy"
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
        </div>
    );
};

export default VideoEmbedded;