import * as bcrypt from 'bcryptjs';

const SALT_ROUNDS = (process.env.SALT_ROUNDS as unknown as number) || 10;
class BtUtil {
  static getBtId(bt: string): string {
    return bt.split(' ')[0];
  }

  static async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(Number(SALT_ROUNDS));

      return bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  }

  static async comparePassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plainTextPassword, hashedPassword);
    } catch (error) {
      throw new Error(`Password comparison failed: ${error.message}`);
    }
  }
}

export { BtUtil };
