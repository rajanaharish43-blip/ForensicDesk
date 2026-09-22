export const calculateFileHash = async (file: File): Promise<{ sha256: string; md5: string }> => {
  const arrayBuffer = await file.arrayBuffer();

  // Web Crypto API supports SHA-256 natively
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const sha256 = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Note: Web Crypto doesn't support MD5 in all browsers natively.
  // For the sake of this client-side demo without heavy libraries, 
  // we'll return a stub or use a lightweight approach if needed.
  // For now, MD5 is stubbed as 'Unsupported in Web Crypto API'
  const md5 = 'MD5 not natively supported in WebCrypto';

  return { sha256, md5 };
};
