/**
 * uuid加密模块
 */
import { Buffer } from "buffer";
import { pki } from "node-forge";

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0HvosNomhSfTbfHbQdQeDARLt
m1853PwqmtaRSyoyB40g26iInN/U4img4hXIpaK9cBVCQu46OKZXsqa6ebnyUpeE
R1U4irbQDZbq56YVGKgSsKDQzDg7bcCYzp4cXVfZn4hajj5gu73U88RlJgbOZ33c
qSXTe37aK9uyCSjHdQIDAQAB
-----END PUBLIC KEY-----
`;

const publicK = pki.publicKeyFromPem(publicKey);

/**
 * @description 生成Authorization
 */
const createAuthorization = (uuid: string) => {
  if (!uuid) {
    return "";
  }
  const encryptMsg = publicK.encrypt(uuid, "RSA-OAEP");
  const token = Buffer.from(encryptMsg, "utf8").toString("base64");
  // const _token = window.btoa(unescape(encodeURIComponent(encryptMsg)));

  return token;
};

export default createAuthorization;
