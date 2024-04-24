import React, {useCallback, useMemo} from "react";

import "./styles.scss";
import {ApiProtocolType} from "@/types/profile";
import FileFolder from "@/screens/ProfilePage/components/ApiProtocols/FileFolder";

type ApiProtocolsPropsType = {
    apiProtocols: ApiProtocolType[] | null;
}

export type HierarchyNodeType = {
    name: string;
    isFolder: boolean;
    children?: HierarchyNodeType[];
    uuid?: string;
}

const ApiProtocols: React.FC<ApiProtocolsPropsType> = ({apiProtocols}) => {

    console.log('protocols', apiProtocols)

    const getHierarchicalFileStructure = useCallback((filePaths: ApiProtocolType[]) : HierarchyNodeType => {
        const rootNode: Record<string, any> = { name: '', isFolder: true, children: [] };
        const fileMap = new Map<string, Record<string, any>>();

        for (const filePath of filePaths) {
            const pathParts = [...filePath.path.split('/'), filePath.name];

            let currentNode = rootNode;
            for (let i = 0; i < pathParts.length; i++) {
                const part = pathParts[i];

                // Check if the folder already exists in the map
                if (fileMap.has(currentNode.name + '/' + part)) {
                    currentNode = fileMap.get(currentNode.name + '/' + part)!;
                } else {
                    if (i === pathParts.length - 1) {
                        currentNode.children.push({ name: part, isFolder: false, uuid: filePath.uuid });
                    } else {
                        const newFolder = {name: part, isFolder: true, children: []};
                        currentNode.children.push(newFolder);
                        fileMap.set(currentNode.name + '/' + part, newFolder); // Add to map for efficient lookup
                        currentNode = newFolder;
                    }
                }
            }
        }

        return rootNode.children[0];
    }, []);

    const fileHierarchy = useMemo(()=>getHierarchicalFileStructure(apiProtocols || []), [apiProtocols]);


    console.log('hierarchy: ', getHierarchicalFileStructure(apiProtocols ? apiProtocols : []))






    return (
        <div className={`api-protocols`}>
            {/*<h2 className="api-protocols--title">*/}
            {/*    Available delivery protocols*/}
            {/*</h2>*/}
            {apiProtocols && apiProtocols.length && fileHierarchy ?
                <div className='api-protocols__wrapper'>
                    <FileFolder folder={fileHierarchy} />
                </div>
                : null
            }
        </div>
    );
};

export default ApiProtocols;
