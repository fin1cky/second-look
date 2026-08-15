import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

// Temporary probe: confirms Base44 egress can reach the Shopify Catalog API
// (auth + search) without being blocked. Delete once verified.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const authRes = await fetch('https://api.shopify.com/auth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: secrets.get('SHOPIFY_CATALOG_CLIENT_ID'),
        client_secret: secrets.get('SHOPIFY_CATALOG_CLIENT_SECRET')
      })
    });
    const authBody = await authRes.text();
    if (!authRes.ok) {
      return Response.json({
        stage: 'auth',
        status: authRes.status,
        body: authBody.slice(0, 2000)
      });
    }

    const token = JSON.parse(authBody).access_token;
    const url = new URL('https://discover.shopifyapps.com/global/v2/search');
    url.searchParams.set('q', 'oversized light blue distressed denim jacket');
    url.searchParams.set('limit', '4');
    url.searchParams.set('ships_to', 'US');

    const searchRes = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const searchBody = await searchRes.text();

    return Response.json({
      stage: 'search',
      auth_status: authRes.status,
      search_status: searchRes.status,
      search_headers: Object.fromEntries(searchRes.headers),
      body: searchBody.slice(0, 3000)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}