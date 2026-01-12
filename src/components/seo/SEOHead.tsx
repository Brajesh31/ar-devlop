import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'event';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  schema?: object;
}

export const SEOHead = ({
  title,
  description,
  keywords = [],
  canonical,
  image = 'https://bharatxr.co/og-image.png',
  type = 'website',
  author = 'Chhavi Garg',
  schema,
}: SEOHeadProps) => {
  const siteUrl = 'https://bharatxr.co';
  const fullTitle = title.includes('Bharat XR') ? title : `${title} | Bharat XR`;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bharat XR',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: "India's largest XR community for AR, VR, and MR technologies.",
    founder: {
      '@type': 'Person',
      name: 'Chhavi Garg',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'chhavi@bharatxr.co',
      contactType: 'customer service',
    },
    sameAs: [
      'https://twitter.com/bharatxr',
      'https://linkedin.com/company/bharatxr',
      'https://instagram.com/bharatxr',
    ],
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Bharat XR" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@bharatxr" />
      <meta name="twitter:creator" content="@bharatxr" />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1" />
      <meta name="theme-color" content="#FF6B35" />

      {/* Geo Tags */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schema || defaultSchema)}
      </script>
    </Helmet>
  );
};
