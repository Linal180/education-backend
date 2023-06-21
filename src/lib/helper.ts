import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

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

// export const removeEmojisFromArray= async (array)=>{
//   const regex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|\n|[^\x00-\x7F]/g;
//   const cleanArray = array.map(obj => {
//     const newObj = {};
//     for (let key in obj) {
//       console.log("key: ",key)
//       console.log("obj[key]: ",obj[key])
//       console.log("key replace: ", obj[key].replace(regex, '').trim())
//       newObj[key.replace(regex, '')] = obj[key].replace(regex, '').trim();
//       console.log("above line not execute")
//     }
//     return newObj;
//   });
//   return cleanArray;
// }


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

 /**
  * Set meta data.
  * Will not set a null value.
  *
  * @param key - The key of the meta data.
  * @param val - The value of the meta data.
  * @return this - The updated object.
  */
export const setMeta = async (metaData: string, { key, value }: { key: string, value: string }): Promise<string>  => {
  if (value === null) return '';

  const meta = JSON.parse(metaData) || {};
  meta[key] = value;

  return JSON.stringify(meta);
}

  /**
   * Get meta data out of the JSON key/value pair.
   *
   * @param key - The key to search for in the meta data.
   * @param defaultVal - The default value to return if the key is not found.
   * @returns String - The value corresponding to the key in the meta data or the default value.
   */
export const getMeta = async (user: User, key: string, defaultVal = ''): Promise<string> =>  {
    const json = user.meta;

    // Return default value if the field is empty
    if (!json) {
      return defaultVal;
    }
    switch (typeof json) {
      case 'string':
        if (json.includes('{')) {
          try {
            const decoded = JSON.parse(json);
            if (decoded && typeof decoded === 'object' && decoded[key]) {
              return decoded[key];
            }
          } catch (error) {
            return defaultVal;
          }
        }
        break;

      case 'object':
        if (json && json[key]) {
          return json[key];
        }
        break;

      default:
        return defaultVal;
    }
  }
