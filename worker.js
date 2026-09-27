export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;

    return new HTMLRewriter()
      .on('head', {
        element(element) {
          element.append('<link rel="stylesheet" href="/layout-overrides.css">', { html: true });
        }
      })
      .transform(response);
  }
};
