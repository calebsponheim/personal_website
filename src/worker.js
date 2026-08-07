const CANONICAL_HOST = 'calebsponheim.com';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.hostname.toLowerCase() === `www.${CANONICAL_HOST}`) {
            url.hostname = CANONICAL_HOST;
            return Response.redirect(url.toString(), 301);
        }

        return env.ASSETS.fetch(request);
    },
};
