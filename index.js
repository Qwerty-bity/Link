export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Uses the IP and Port defined in your wrangler.json
    const targetUrl = `http://${env.COLAB_IP}:${env.COLAB_PORT}${url.pathname}${url.search}`;

    const newHeaders = new Headers(request.headers);
    newHeaders.set("Host", `${env.COLAB_IP}:${env.COLAB_PORT}`);

    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: newHeaders,
        redirect: "follow",
        cf: { cacheTtl: 0, cacheEverything: false }
      });

      return new Response(response.body, {
        status: response.status,
        headers: response.headers
      });
    } catch (e) {
      return new Response("Bridge Error: Is Colab running? " + e.message, { status: 500 });
    }
  }
};
