/**
 * uuid加密模块
 */

import { AES, DES, mode, pad, RAS } from "crypto-js";

const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC0HvosNomhSfTbfHbQdQeDARLt
m1853PwqmtaRSyoyB40g26iInN/U4img4hXIpaK9cBVCQu46OKZXsqa6ebnyUpeE
R1U4irbQDZbq56YVGKgSsKDQzDg7bcCYzp4cXVfZn4hajj5gu73U88RlJgbOZ33c
qSXTe37aK9uyCSjHdQIDAQAB
-----END PUBLIC KEY-----
`;

/**
 * @description 生成Authorization
 */
export const createAuthorization = (uuid: string) => {
  if (!uuid) {
    return "";
  }
  // const butter = Buffer.from(uuid, "base64");
  // return AES.encrypt(
  //   {
  //     key: publicKey,
  //     padding: constants.RSA_PKCS1_PADDING,
  //   },
  //   butter
  // ).toString("base64");
  // return DES.encrypt(uuid, publicKey, {
  //   mode: mode.CBC
  // }).toString().toUpperCase();
};
