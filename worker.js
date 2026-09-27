export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return response;

    return new HTMLRewriter()
      .on('head', {
        element(element) {
          element.append('<link rel="stylesheet" href="/layout-overrides.css"><link rel="stylesheet" href="/redesign-direct.css"><link rel="stylesheet" href="/sensor-evidence-view.css">', { html: true });
        }
      })
      .on('body', {
        element(element) {
          element.append('<script src="/visualization-layout.js"></script><script src="/sensor-evidence-view.js"></script>', { html: true });
        }
      })
      .transform(response);
  }
};
