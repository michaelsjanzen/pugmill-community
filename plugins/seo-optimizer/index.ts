import { hooks } from "../../src/lib/hooks";
import { getConfig } from "../../src/lib/config";

// 1. Define the function that generates the SEO tags
const injectSEOTags = async (postData?: any) => {
  const config = getConfig();
  const siteName = config.site.name;
  
  // Use post title if available, otherwise use site name
  const title = postData?.title ? `${postData.title} | ${siteName}` : siteName;
  const description = postData?.excerpt || config.site.description;

  console.log(`[SEO Plugin] Injecting tags for: ${title}`);

  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:type" content="website" />
    <meta name="generator" content="ReplPress 0.1.0" />
  `;
};

// 2. Register the function with the 'theme_head' hook
// This ensures that whenever the theme calls doAction('theme_head'), this runs.
hooks.addFilter('theme_head_tags', injectSEOTags);

