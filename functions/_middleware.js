/* Cloudflare Pages middleware — HTTP Basic Auth gate.
 *
 * Runs on every request to the deployed site. If the AUTH_PASS
 * environment variable is set in Cloudflare Pages, the site is gated
 * behind a username + password. If AUTH_PASS is not set, the site is
 * open (useful for local dev / preview without auth).
 *
 * Configure in Cloudflare Pages dashboard:
 *   Settings → Environment variables → Production
 *     AUTH_USER  (defaults to "claudia" if unset)
 *     AUTH_PASS  (required to enable auth)
 *
 * To change the password later: update AUTH_PASS in the dashboard,
 * then trigger a redeploy (Settings → Builds & deployments → Retry).
 *
 * To remove auth temporarily: delete AUTH_PASS env var and redeploy.
 */

const REALM = 'Portfolio';

function unauthorized() {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Cache-Control': 'no-store',
    },
  });
}

export const onRequest = async ({ request, env, next }) => {
  // No password configured — allow all (dev mode / pre-launch).
  if (!env.AUTH_PASS) return next();

  const header = request.headers.get('Authorization');
  if (!header || !header.startsWith('Basic ')) {
    return unauthorized();
  }

  let decoded;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return unauthorized();
  }

  const sep = decoded.indexOf(':');
  if (sep < 0) return unauthorized();

  const user = decoded.slice(0, sep);
  const pass = decoded.slice(sep + 1);
  const expectedUser = env.AUTH_USER || 'claudia';

  if (user !== expectedUser || pass !== env.AUTH_PASS) {
    return unauthorized();
  }

  return next();
};
