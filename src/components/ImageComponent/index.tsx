import React from 'react';
import Image from 'next/image';
import './styles.scss';

type ImageBlockPropsType = {
    imageUrl: string;
    caption?: string;
    alt: string;
    isHalf?: boolean;
}

const ImageComponent: React.FC<ImageBlockPropsType> = (props) => {
    const {imageUrl, alt, caption, isHalf=false} = props;
    return (
        <div className='image-component'>
            <div className='image-component__wrapper'>
                <Image src={imageUrl}
                       alt={alt}
                       width={0}
                       height={0}
                       sizes={`(max-width: 768px) 100vw, ${isHalf ? '50vw' : '100vw'}`}
                />
                {caption ? <p className='image-component__caption'>{caption}</p> : null}
            </div>
        </div>
    )

}

export default ImageComponent;