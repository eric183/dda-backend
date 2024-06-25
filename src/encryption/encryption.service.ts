import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly stringLength = 11;
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32; // 256 bits
  private readonly ivLength = 12; // 96 bits
  private readonly tagLength = 16; // 128 bits

  private readonly key: Buffer | string;

  constructor() {
    // 在实际应用中，应该从安全的配置或密钥管理系统获取密钥
    // this.key = crypto.randomBytes(this.keyLength);
    this.key = Buffer.from(
      'e20348b01dad0f8058400acb2ff08e07da5ffc872f5e0078e55a17dbc85fd8c2',
      'hex',
    );
  }

  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    // 将 IV、加密数据和认证标签组合成一个字符串
    return iv.toString('hex') + ':' + encrypted + ':' + tag.toString('hex');
  }

  decrypt(ciphertext: string): string {
    const [ivHex, encryptedHex, tagHex] = ciphertext.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString('utf8');
  }

  generateCryptoByLength(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }
}
