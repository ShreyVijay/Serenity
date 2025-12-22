import geoip from "geoip-lite";

export function getUserLocation(req) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;

  const geo = geoip.lookup(ip);

  return {
    country: geo?.country || null,
    region: geo?.region || null,
  };
}
