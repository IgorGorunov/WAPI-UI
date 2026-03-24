import React, { useState } from 'react';
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import styles from './styles.module.scss';
import { AttachedFilesType } from "@/types/utility";
import { Zoom } from "yet-another-react-lightbox/plugins";

type ImagePreviewPropsType = {
    images: AttachedFilesType[];
    show: boolean;
    setShow: (show: boolean) => void;
}

const ImageSlider: React.FC<ImagePreviewPropsType> = ({ images, show, setShow }) => {
    const [index, setIndex] = useState(0);

    return (
        <div className={`${styles['image-slider'] || 'image-slider'} image-slider ${styles['image-slider__wrapper'] || 'image-slider__wrapper'} image-slider__wrapper ${show ? `${styles['active'] || 'active'} active` : ''}`}>
            <Lightbox
                open={show}
                close={() => setShow(false)}
                slides={images.map((img) => ({ src: 'data:image/jpeg;base64,' + img.data }))}
                index={index} // Set active image
                on={{ view: ({ index }) => setIndex(index) }} // Update index when navigating
                carousel={{ finite: false, preload: 2 }} // Smooth scrolling without preview shifting
                thumbnails={{ position: "bottom", width: 80, height: 80, gap: 10 }} // Customize thumbnails
                plugins={[Thumbnails, Zoom]} // Enables thumbnail navigation
                // animation={{ swipe: 0 }} // Disable swipe animations
                controller={{ closeOnBackdropClick: true }} // Allow closing on backdrop click
                zoom={{ maxZoomPixelRatio: 3 }}
            />
        </div>
    );
}

export default ImageSlider;