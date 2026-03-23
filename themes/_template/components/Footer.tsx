/**
 * Footer — server component stub
 *
 * Fetches site config to render copyright, social links, or any other
 * footer content. Keep as a server component for config access.
 *
 * See /themes/default/components/Footer.tsx for a reference implementation
 * that renders SVG icon links for all configured social platforms.
 *
 * Global config fields available here:
 *   config.site.name               — site name for copyright line
 *   config.site.showPoweredBy      — boolean; hide the "Made with Pugmill" credit when false
 *   config.site.socialLinks        — social platform URLs (set in Settings → Social Links)
 *     .twitter, .github, .linkedin, .instagram, .youtube, .facebook
 */

import { getConfig } from "../../../src/lib/config";

export default async function Footer() {
  const config = await getConfig();
  const siteName = config.site?.name ?? "My Site";
  const social = config.site?.socialLinks ?? {};
  const socialEntries = Object.entries(social).filter(([, url]) => !!url) as [string, string][];

  const showPoweredBy = config.site.showPoweredBy !== false;

  return (
    <footer>
      <p>
        &copy; {new Date().getFullYear()} {siteName}.
        {showPoweredBy && (
          <> · <a href="https://pugmillcms.com" target="_blank" rel="noopener noreferrer">Made with Pugmill &lt;/&gt;&gt;&gt;</a></>
        )}
      </p>

      {socialEntries.length > 0 && (
        <nav aria-label="Social links">
          {socialEntries.map(([platform, url]) => (
            <a key={platform} href={url} target="_blank" rel="noopener noreferrer" aria-label={platform}>
              {platform}
            </a>
          ))}
        </nav>
      )}
    </footer>
  );
}
