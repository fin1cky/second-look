import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { INTELLIGENCE_API_BASE } from '../../shared/config.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { upload_id } = await req.json();
    if (!upload_id) return Response.json({ error: 'upload_id is required' }, { status: 400 });

    const upload = await base44.entities.Upload.get(upload_id);
    await base44.entities.Upload.update(upload_id, { status: 'analyzing' });

    const res = await fetch(`${INTELLIGENCE_API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: upload.image_url })
    });

    if (!res.ok) {
      await base44.entities.Upload.update(upload_id, { status: 'failed' });
      return Response.json({ error: `Intelligence service error (${res.status})` }, { status: 502 });
    }

    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.items || []);

    const created = items.length
      ? await base44.entities.DetectedItem.bulkCreate(items.map((i) => ({
          upload_id,
          label: i.label,
          category: i.category,
          color: i.color,
          material: i.material,
          style_descriptors: i.style_descriptors || [],
          search_query: i.search_query,
          confidence: i.confidence
        })))
      : [];

    await base44.entities.Upload.update(upload_id, { status: 'complete' });
    return Response.json({ items: created });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}