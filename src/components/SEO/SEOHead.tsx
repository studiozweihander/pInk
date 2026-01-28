import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DEFAULT_OG_IMAGE } from '../../constants';

interface SEOProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
}

export const SEOHead: React.FC<SEOProps> = ({
    title,
    description,
    image,
    url,
    type = 'website'
}) => {
    const fullTitle = `pInk | ${title}`;
    const canonicalUrl = url || window.location.href;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image || DEFAULT_OG_IMAGE} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="pInk" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image || DEFAULT_OG_IMAGE} />
            <meta name="twitter:site" content="@pinkcomics" />
        </Helmet>
    );
};
