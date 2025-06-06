import Head from 'next/head';
import useTenant from "@/context/tenantContext";

type SeoHeadProps = {
    title?: string;
    description?: string;
};

const SeoHead = ({ title = 'Default Title', description = 'Default description' }: SeoHeadProps) => {

    const {tenant, getTenantData} = useTenant();

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description}/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="icon" href={getTenantData(tenant)?.logo || '/default-logo.png'} type="image/png" />
        </Head>
    );
};

export default SeoHead;