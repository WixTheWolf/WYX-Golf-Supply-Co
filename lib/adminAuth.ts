export function isAuthorizedAdminRequest(request: Request) {
  const header = request.headers.get('authorization');
  const acceptedSecrets = [process.env.CRON_SECRET, process.env.OPS_SECRET, process.env.WYX_OPS_SECRET].filter(Boolean);
  return Boolean(header && acceptedSecrets.some((secret) => header === `Bearer ${secret}`));
}

export function unauthorizedResponse() {
  return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
}
