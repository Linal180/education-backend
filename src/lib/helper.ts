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


export const removeEmojisFromArray= (arr: object[]): object[] => {
  const regex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\n|[^\x00-\x7F]/g; // Regular expression to match emojis

  return arr.map(obj => {
    const newObj = {};

    for (const key in obj) {
      const newKey = key.replace(regex, '');

      let value = obj[key];

      if (typeof value === 'string') {
        value = value.replace(regex, '');
      } else if (Array.isArray(value)) {
        value = value.map(item => {
          if (typeof item === 'string') {
            return item.replace(regex, '');
          } else if (typeof item === 'object') {
            return removeEmojisFromObject(item);
          }
          return item;
        });
      } else if (typeof value === 'object') {
        value = removeEmojisFromObject(value);
      }

      newObj[newKey] = value;
    }

    return newObj;
  });
}

function removeEmojisFromObject(obj: object): object {
  const regex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\n|[^\x00-\x7F]/g; // Regular expression to match emojis
  const newObj = {};

  for (const key in obj) {
    const newKey = key.replace(regex, '');

    let value = obj[key];

    if (typeof value === 'string') {
      value = value.replace(regex, '');
    } else if (Array.isArray(value)) {
      value = value.map(item => {
        if (typeof item === 'string') {
          return item.replace(regex, '');
        } else if (typeof item === 'object') {
          return removeEmojisFromObject(item);
        }
        return item;
      });
    } else if (typeof value === 'object') {
      value = removeEmojisFromObject(value);
    }

    newObj[newKey] = value;
  }

  return newObj;
}
