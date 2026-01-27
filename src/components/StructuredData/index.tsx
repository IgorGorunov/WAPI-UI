import Head from 'next/head';
import useTenant from '@/context/tenantContext';

interface StructuredDataProps {
    type: 'WebPage' | 'WebSite' | 'Organization' | 'BreadcrumbList';
    name: string;
    description: string;
    path: string;
}

/**
 * StructuredData component for adding JSON-LD schema markup
 * Tenant-aware: automatically uses correct site URL and name based on current tenant
 * Only references main website for WAPI tenant (ui.wapi.com)
 */
export default function StructuredData({ type, name, description, path }: StructuredDataProps) {
    const { tenant, getTenantData } = useTenant();
    const tenantData = getTenantData(tenant);

    const siteUrl = typeof window !== 'undefined'
        ? window.location.origin
        : (tenantData?.uiLink || 'https://ui.wapi.com');

    const siteName = tenantData?.name || 'User Cabinet';
    const mainWebsite = tenantData?.mainWebsite; // Only WAPI has this set

    const schema: Record<string, any> = {
        '@context': 'https://schema.org',
        '@type': type,
        name,
        description,
        url: `${siteUrl}${path}`,
        inLanguage: 'en',
    };

    // Only add isPartOf if there's a main website (WAPI tenant only)
    if (mainWebsite) {
        schema.isPartOf = {
            '@type': 'WebSite',
            name: siteName,
            url: mainWebsite,
        };
    }

    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
        </Head>
    );
}
