import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';

interface Query {
  [key: string]: string | number | boolean;
}

export function createToken(): string {
  return uuidv4();
}

export async function createPasswordHash(password: string): Promise<string> {
  return await bcrypt.hash(password, await bcrypt.genSalt());
}

export const mediaFilesFilter = (_req, file, callback) => {
  if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx)$/)) {
    return callback(
      new HttpException(
        'Only jpeg|jpg|png|svg files are allowed',
        HttpStatus.FORBIDDEN,
      ),
      false,
    );
  }
  callback(null, true);
};

export const queryParamasString = (query: Query): string  => {
  return Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}