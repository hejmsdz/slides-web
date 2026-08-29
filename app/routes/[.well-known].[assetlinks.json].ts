export const loader = async () => {
  const packageName = process.env.ASSETLINKS_PACKAGE_NAME;
  const fingerprints = process.env.ASSETLINKS_FINGERPRINTS?.split(',');

  if (!packageName || !fingerprints?.length) {
    return new Response("Not Found", { status: 404 });
  }

  return Response.json([{
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: packageName,
      sha256_cert_fingerprints: fingerprints,
    }
  }]);
};
