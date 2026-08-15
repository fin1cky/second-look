import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { INTELLIGENCE_API_BASE } from '../../shared/config.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const { detected_item_id } = await req.json();
    if (!detected_item_id) return Response.json({ error: 'detected_item_id is required' }, { status: 400 });

    // Public looks are viewable by guests, so this reads with the service role.
    const item = await base44.asServiceRole.entities.DetectedItem.get(detected_item_id);
    if (!item) return Response.json({ error: 'Item not found' }, { status: 404 });

    const res = await fetch(`${INTELLIGENCE_API_BASE}/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        label: item.label,
        category: item.category,
        color: item.color,
        material: item.material,
        style_descriptors: item.style_descriptors,
        search_query: item.search_query
      })
    });

    if (!res.ok) {
      return Response.json({ error: `Intelligence service error (${res.status})` }, { status: 502 });
    }

    const data = await res.json();
    // Service returns { primary: [...], mid: [...], budget: [...] }.
    const matches = [
      ...(data.primary || []).map((m) => ({ ...m, tier: 'primary' })),
      ...(data.mid || []).map((m) => ({ ...m, tier: 'mid' })),
      ...(data.budget || []).map((m) => ({ ...m, tier: 'budget' }))
    ];

    const created = matches.length
      ? await base44.asServiceRole.entities.ProductMatch.bulkCreate(matches.map((m) => ({
          detected_item_id,
          tier: m.tier,
          title: m.title,
          brand: m.brand,
          price: m.price,
          currency: m.currency || 'USD',
          image_url: m.image_url,
          product_url: m.product_url,
          shop_name: m.shop_name,
          is_secondhand: !!m.is_secondhand
        })))
      : [];

    return Response.json({ matches: created });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}