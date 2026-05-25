import React, {useCallback, useMemo} from "react";

import styles from "./styles.module.scss";
import {ApiProtocolType} from "@/types/profile";
import FileFolder from "@/screens/ProfilePage/components/ApiProtocols/FileFolder";

type ApiProtocolsPropsType = {
    apiProtocols: ApiProtocolType[] | null;
}

export type HierarchyNodeType = {
    name?: string;
    isFolder?: boolean;
    children?: HierarchyNodeType[];
    uuid?: string;
}

const ApiProtocols: React.FC<ApiProtocolsPropsType> = ({apiProtocols}) => {

    const getHierarchicalFileStructure = useCallback((filePaths: ApiProtocolType[]) : HierarchyNodeType => {
        const rootNode: Record<string, any> = { name: '', isFolder: true, children: [] };
        const fileMap = new Map<string, Record<string, any>>();

        for (const filePath of filePaths) {
            const pathParts = [...filePath.path.split('/'), filePath.name];

            let currentNode = rootNode;
            let currentPath = ''; // full path accumulated segment by segment

            for (let i = 0; i < pathParts.length; i++) {
                const part = pathParts[i];
                const fullKey = currentPath + '/' + part;

                if (i === pathParts.length - 1) {
                    //is leaf
                    currentNode.children.push({ name: part, isFolder: false, uuid: filePath.uuid });
                } else if (fileMap.has(fullKey)) {
                    //folder already created under this exact path
                    currentNode = fileMap.get(fullKey)!;
                } else {
                    //new folder under this path
                    const newFolder = { name: part, isFolder: true, children: [] };
                    currentNode.children.push(newFolder);
                    fileMap.set(fullKey, newFolder);
                    currentNode = newFolder;
                }

                currentPath = fullKey;
            }
        }

        return rootNode;
    }, []);

    const fileHierarchy = useMemo(()=>getHierarchicalFileStructure(apiProtocols || []), [apiProtocols]);



    console.log('hierarchy: ', getHierarchicalFileStructure(apiProtocols ? apiProtocols : []))


    return (
        <div className={styles['api-protocols']}>
            {apiProtocols && apiProtocols.length && fileHierarchy && fileHierarchy.children && fileHierarchy.children.length ?
                <ul className={styles['api-protocols__wrapper']}>
                    {fileHierarchy.children.map(folder => <li key={folder.name}><FileFolder folder={folder} /></li>)}
                </ul>
                : null
            }
        </div>
    );
};

export default ApiProtocols;
