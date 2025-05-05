import React, {useEffect, useState} from "react";
import "./styles.scss";
import {AttachedFilesType} from "@/types/utility";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import DropZone from "@/components/Dropzone";
import Button from "@/components/Button/Button";

type ProductImagesWithPreviewPropsType = {
    productPhotos: AttachedFilesType[];
    onChange: (productPhotos: AttachedFilesType[]) => void;
}

const ProductImagesWithPreview:React.FC<ProductImagesWithPreviewPropsType> = ({productPhotos, onChange}) => {

    const [showDropzone, setShowDropzone] = useState(false);

    const [files, setFiles] = useState<AttachedFilesType[]>(productPhotos);

    useEffect(() => {
        onChange(files);
    }, [files]);

    const handleRemoveFile = (fileId: string) => {
        onChange(productPhotos.filter(item=> item.id !== fileId));
    }

    return (
        <div className="product-photos-with-preview">
            <Button type='button' icon={'add'} classNames="product-photos-with-preview__add-btn" onClick={() => setShowDropzone(true)}>Add photo</Button>
            <ul className={`product-photos-with-preview__list`}>
                {productPhotos && productPhotos.length > 0 ?
                    productPhotos.map((item, index) => (
                        <li key={item.name + '_' + index} className={`product-photos-with-preview__list-item`}>
                            <span>{item.name}</span>
                            <button
                                className="remove-photo"
                                type='button'
                                onClick={() => handleRemoveFile(item.id)}
                            >
                                <Icon name={"plus"} />
                            </button>
                        </li>
                    ))
                    : <span className="product-photos-with-preview__empty-label">(no photos)</span>}
            </ul>

            {showDropzone && (
                <Modal title={'Add photos of the product / product type'} onClose={() => setShowDropzone(false)}>
                    <>
                        <DropZone files={productPhotos} onFilesChange={setFiles} allowOnlyFormats={['jpeg', 'jpg', 'png']}
                              hint="Please, add images in JPEG, JPG or PNG formats"/>
                        <div className="product-photos-with-preview__btn-wrapper">
                            <Button type="button" onClick={() => setShowDropzone(false)}>
                                OK
                            </Button>
                        </div>
                    </>
                </Modal>)
            }
        </div>
    );
};

export default ProductImagesWithPreview;