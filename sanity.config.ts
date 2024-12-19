import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure'
import schemas from "@/sanity/schemas";
import { table } from '@sanity/table';
import {structure} from "@/sanity/config/structure";

const config = defineConfig({
    projectId: "26uk05nn",
    dataset: "production",
    title: "WAPI documentation",
    apiVersion: "2024-12-19",
    basePath: "/sanity",
    plugins: [
        structureTool({
            structure
        }),
        table(),
    ],
    schema: { types: schemas },
})

export default config