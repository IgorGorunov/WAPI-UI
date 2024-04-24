import React from "react";

import "./styles.scss";
import {HierarchyNodeType} from "@/screens/ProfilePage/components/ApiProtocols";
import AccordionFile from "@/components/AccordionFile";
import SingleFile from "@/screens/ProfilePage/components/ApiProtocols/SingleFile";

type FileFolderPropsType = {
    folder: HierarchyNodeType;
}

const FileFolder: React.FC<FileFolderPropsType> = ({folder}) => {

    return (
        <>
            { folder.isFolder ?
                <AccordionFile title={folder.name} isOpen >
                    <>{folder.children ? folder.children.map(item=> <div key={item.name}><FileFolder folder={item} /></div>) : null}</>
                </AccordionFile> :
                <SingleFile file={folder} />
            }

        </>

    );
};

export default FileFolder;