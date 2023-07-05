export interface IEveryActionEmail {
  email: string,
  type?: 'W' | 'P';
  isPreferred?: boolean,
}

export interface IEveryActionAddress {
  city: string;
  type: string;
  countryCode: string;
  addressLine1: string;
  addressLine2: string;
  zipOrPostalCode: string;
  stateOrProvince: string;
}

export interface IEveryActionCustomField {
  customFieldId: number;
  customFieldGroupId: number;
  assignedValue: number | string;
}

export interface IEveryActionPayload {
  vanId?: string;
  firstName?: string;
  lastName?: string;
  employer?: string;
  emails?: IEveryActionEmail[];
  addresses?: IEveryActionAddress[];
  customFieldValues?: IEveryActionCustomField[]
}

export type IEveryActionFindPayload = Pick<IEveryActionPayload, 'firstName' | 'lastName' | 'emails' | 'vanId'>

export type NotifyPayload = {
  base: {
    id: string;
  };
  webhook: {
    id: string;
  };
  timestamp: string;
};
