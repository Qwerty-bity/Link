 export default {
  async fetch(request) {
    // YOUR CURRENT COLAB IP
    const COLAB_IP = "136.118.183.39"; 
    const COLAB_PORT = "8888";

    const url = new URL(request.url);
    // This directs the request to your Colab server
    const targetUrl = `http://${COLAB_IP}:${COLAB_PORT}${url.pathname}${url.search}`;

    const newHeaders = new Headers(request.headers);
    newHeaders.set("Host", `${COLAB_IP}:${COLAB_PORT}`);

    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: newHeaders,
        redirect: "follow",
        // Crucial: Prevents Cloudflare from trying to 'buffer' or 'cache' the 3GB file
        cf: { cacheTtl: 0, cacheEverything: false } 
      });

      // Stream the response body directly to the client
      return new Response(response.body, {
        status: response.status,
        headers: response.headers
      });
    } catch (e) {
      return new Response("Bridge Error: Is your Colab script running? " + e.message, { status: 500 });
    }
  }
};
