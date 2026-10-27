// A small inline photo for the stories, so they need no network or asset files.
export const SAMPLE_PHOTO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#f2c6a0"/><stop offset="1" stop-color="#b86b77"/></linearGradient></defs>' +
      '<rect width="80" height="80" fill="url(#g)"/>' +
      '<circle cx="40" cy="31" r="14" fill="#fbe9dc"/>' +
      '<path d="M10 80c2-20 14-28 30-28s28 8 30 28z" fill="#fbe9dc"/></svg>',
  );
