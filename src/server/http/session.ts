const encoder = new TextEncoder();
async function key(secret: string): Promise<CryptoKey> {
  if(secret.length<32) throw new Error('SERVICE_UNAVAILABLE');
  return crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);
}
function hex(bytes: ArrayBuffer): string {return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');}
/** HMAC namespaces prevent correlation between cookie and IP limiter identifiers. */
export async function hashIdentifier(value: string,secret: string): Promise<string> {return hex(await crypto.subtle.sign('HMAC',await key(secret),encoder.encode(value)));}
/** Issues a random signed identity; it does not authenticate a natural person. */
export async function issueSession(secret: string): Promise<string> {const id=crypto.randomUUID();return `${id}.${await hashIdentifier('cookie:'+id,secret)}`;}
/** Rejects unsigned, malformed and forged cookies using constant-time Web Crypto verification. */
export async function verifySession(value: string | undefined,secret: string): Promise<string | null> {
  if(!value||!/^[-0-9a-f]{36}\.[0-9a-f]{64}$/.test(value))return null;
  const [id,signature]=value.split('.');const bytes=new Uint8Array(signature.match(/../g)!.map(v=>parseInt(v,16)));
  if(!await crypto.subtle.verify('HMAC',await key(secret),bytes,encoder.encode('cookie:'+id)))return null;
  return hashIdentifier('session:'+id,secret);
}
export const COOKIE_NAME='gs_session';
/** Extracts only our cookie; the raw identity is never persisted server-side. */
export function readCookie(request: Request): string | undefined {return request.headers.get('cookie')?.split(';').map(v=>v.trim()).find(v=>v.startsWith(COOKIE_NAME+'='))?.slice(COOKIE_NAME.length+1);}
