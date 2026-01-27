import Head from 'next/head';
import useTenant from "@/context/tenantContext";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

/**
 * Enhanced SEO Component for public pages with tenant-aware branding
 * 
 * @param title - Page title (will be appended with site name)
 * @param description - Page description for search engines
 * @param canonical - Canonical URL (optional)
 * @param ogImage - Open Graph image URL (optional, defaults to tenant logo)
 * @param noindex - Set to true to prevent indexing (e.g., login pages)
 */
export default function SEO({
  title,
  description,
  canonical,
  ogImage,
  noindex = false
}: SEOProps) {
  const { tenant, getTenantData } = useTenant();
  const tenantData = getTenantData(tenant);

  // Use tenant-specific logo or fallback to default
  const tenantLogo = tenantData?.logo || '/default-logo.png';
  const finalOgImage = ogImage || tenantLogo;

  // Use tenant-specific name for site name
  const siteName = tenantData?.name || "User Cabinet";
  const fullTitle = `${title} | ${siteName}`;

  const siteUrl = typeof window !== 'undefined'
    ? window.location.origin
    : (tenantData?.uiLink || 'https://ui.wapi.com');

  // Always generate canonical URL
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const canonicalUrl = canonical || `${siteUrl}${currentPath}`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${finalOgImage}`} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${finalOgImage}`} />

      {/* Canonical URL - Always include */}
      <link rel="canonical" href={canonicalUrl} />


      {/* Robots directives */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Favicon - tenant-specific */}
      <link rel="icon" href={tenantLogo} type="image/png" />
      <link rel="apple-touch-icon" href={tenantLogo} />
    </Head>
  );
}
