import React, {useState} from 'react';
import Image from 'next/image';
import Lightbox from "yet-another-react-lightbox";
import { Zoom } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/styles.css";
import './styles.scss';

type ImageBlockPropsType = {
    imageUrl: string;
    caption?: string;
    alt: string;
    isHalf?: boolean;
}

const ImageComponent: React.FC<ImageBlockPropsType> = (props) => {
    const {imageUrl, alt, caption, isHalf=false} = props;
    const [openImageView, setOpenImageView] = useState(false);

    return (
        <div className='image-component'>
            <div className='image-component__wrapper'>
                <Image src={imageUrl}
                       alt={alt}
                       width={0}
                       height={0}
                       sizes={`(max-width: 768px) 100vw, ${isHalf ? '50vw' : '100vw'}`}
                       loading="eager"
                       onClick={()=>setOpenImageView(true)}
                />
                {caption ? <p className='image-component__caption'>{caption}</p> : null}
            </div>
            <Lightbox
                open={openImageView}
                close={() => setOpenImageView(false)}
                slides={[{src: imageUrl}]}
                plugins={[Zoom]} // Add zoom plugin
                animation={{ swipe: 0 }} // Disable swipe animations
                controller={{ closeOnBackdropClick: true }} // Allow closing on backdrop click
                styles={{
                    navigationPrev: { display: "none" }, // Hide 'Previous' button
                    navigationNext: { display: "none" }, // Hide 'Next' button
                }}
                zoom={{ maxZoomPixelRatio: 3 }}
            />
        </div>
    )

}

export default ImageComponent;