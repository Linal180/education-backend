import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Role } from './role.entity';

import { Grade } from '../../Grade/entities/grade-levels.entity';
import { SubjectArea } from '../../subjectArea/entities/subject-areas.entity';
import { Organization, schoolType } from '../../organizations/entities/organization.entity';

export enum UserStatus {
  DEACTIVATED = 0,
  ACTIVE,
}

export enum Country {
  UNITED_STATES = 'US',
  AFGHANISTAN = 'AF',
  ALAND_ISLANDS = 'AX',
  ALBANIA = 'AL',
  ALGERIA = 'DZ',
  AMERICAN_SAMOA = 'AS',
  ANDORRA = 'AD',
  ANGOLA = 'AO',
  ANGUILLA = 'AI',
  ANTARCTICA = 'AQ',
  ANTIGUA_AND_BARBUDA = 'AG',
  ARGENTINA = 'AR',
  ARMENIA = 'AM',
  ARUBA = 'AW',
  AUSTRALIA = 'AU',
  AUSTRIA = 'AT',
  AZERBAIJAN = 'AZ',
  BAHAMAS = 'BS',
  BAHRAIN = 'BH',
  BANGLADESH = 'BD',
  BARBADOS = 'BB',
  BELARUS = 'BY',
  BELGIUM = 'BE',
  BELIZE = 'BZ',
  BENIN = 'BJ',
  BERMUDA = 'BM',
  BHUTAN = 'BT',
  BOLIVIA = 'BO',
  BONAIRE_SINT_EUSTATIUS_SABA = 'BQ',
  BOSNIA_AND_HERZEGOVINA = 'BA',
  BOTSWANA = 'BW',
  BOUVET_ISLAND = 'BV',
  BRAZIL = 'BR',
  BRITISH_INDIAN_OCEAN_TERRITORY = 'IO',
  BRUNEI_DARUSSALAM = 'BN',
  BULGARIA = 'BG',
  BURKINA_FASO = 'BF',
  BURUNDI = 'BI',
  CAMBODIA = 'KH',
  CAMEROON = 'CM',
  CANADA = 'CA',
  CAPE_VERDE = 'CV',
  CAYMAN_ISLANDS = 'KY',
  CENTRAL_AFRICAN_REPUBLIC = 'CF',
  CHAD = 'TD',
  CHILE = 'CL',
  CHINA = 'CN',
  CHRISTMAS_ISLAND = 'CX',
  COCOS_KEELING_ISLANDS = 'CC',
  COLOMBIA = 'CO',
  COMOROS = 'KM',
  CONGO = 'CG',
  CONGO_DEMOCRATIC_REPUBLIC = 'CD',
  COOK_ISLANDS = 'CK',
  COSTA_RICA = 'CR',
  COTE_D_IVOIRE = 'CI',
  CROATIA = 'HR',
  CUBA = 'CU',
  CURACAO = 'CW',
  CYPRUS = 'CY',
  CZECH_REPUBLIC = 'CZ',
  DENMARK = 'DK',
  DJIBOUTI = 'DJ',
  DOMINICA = 'DM',
  DOMINICAN_REPUBLIC = 'DO',
  ECUADOR = 'EC',
  EGYPT = 'EG',
  EL_SALVADOR = 'SV',
  EQUATORIAL_GUINEA = 'GQ',
  ERITREA = 'ER',
  ESTONIA = 'EE',
  ETHIOPIA = 'ET',
  FALKLAND_ISLANDS = 'FK',
  FAROE_ISLANDS = 'FO',
  FIJI = 'FJ',
  FINLAND = 'FI',
  FRANCE = 'FR',
  FRENCH_GUIANA = 'GF',
  FRENCH_POLYNESIA = 'PF',
  FRENCH_SOUTHERN_TERRITORIES = 'TF',
  GABON = 'GA',
  GAMBIA = 'GM',
  GEORGIA = 'GE',
  GERMANY = 'DE',
  GHANA = 'GH',
  GIBRALTAR = 'GI',
  GREECE = 'GR',
  GREENLAND = 'GL',
  GRENADA = 'GD',
  GUADELOUPE = 'GP',
  GUAM = 'GU',
  GUATEMALA = 'GT',
  GUERNSEY = 'GG',
  GUINEA = 'GN',
  GUINEA_BISSAU = 'GW',
  GUYANA = 'GY',
  HAITI = 'HT',
  HEARD_ISLAND_MCDONALD_ISLANDS = 'HM',
  HOLY_SEE_VATICAN_CITY_STATE = 'VA',
  HONDURAS = 'HN',
  HONG_KONG = 'HK',
  HUNGARY = 'HU',
  ICELAND = 'IS',
  INDIA = 'IN',
  INDONESIA = 'ID',
  IRAN = 'IR',
  IRAQ = 'IQ',
  IRELAND = 'IE',
  ISLE_OF_MAN = 'IM',
  ISRAEL = 'IL',
  ITALY = 'IT',
  JAMAICA = 'JM',
  JAPAN = 'JP',
  JERSEY = 'JE',
  JORDAN = 'JO',
  KAZAKHSTAN = 'KZ',
  KENYA = 'KE',
  KIRIBATI = 'KI',
  KOREA = 'KR',
  KOREA_DEMOCRATIC_PEOPLES_REPUBLIC = 'KP',
  KUWAIT = 'KW',
  KYRGYZSTAN = 'KG',
  LAO_PEOPLES_DEMOCRATIC_REPUBLIC = 'LA',
  LATVIA = 'LV',
  LEBANON = 'LB',
  LESOTHO = 'LS',
  LIBERIA = 'LR',
  LIBYAN_ARAB_JAMAHIRIYA = 'LY',
  LIECHTENSTEIN = 'LI',
  LITHUANIA = 'LT',
  LUXEMBOURG = 'LU',
  MACAO = 'MO',
  MACEDONIA = 'MK',
  MADAGASCAR = 'MG',
  MALAWI = 'MW',
  MALAYSIA = 'MY',
  MALDIVES = 'MV',
  MALI = 'ML',
  MALTA = 'MT',
  MARSHALL_ISLANDS = 'MH',
  MARTINIQUE = 'MQ',
  MAURITANIA = 'MR',
  MAURITIUS = 'MU',
  MAYOTTE = 'YT',
  MEXICO = 'MX',
  MICRONESIA = 'FM',
  MOLDOVA = 'MD',
  MONACO = 'MC',
  MONGOLIA = 'MN',
  MONTENEGRO = 'ME',
  MONTSERRAT = 'MS',
  MOROCCO = 'MA',
  MOZAMBIQUE = 'MZ',
  MYANMAR = 'MM',
  NAMIBIA = 'NA',
  NAURU = 'NR',
  NEPAL = 'NP',
  NETHERLANDS = 'NL',
  NEW_CALEDONIA = 'NC',
  NEW_ZEALAND = 'NZ',
  NICARAGUA = 'NI',
  NIGER = 'NE',
  NIGERIA = 'NG',
  NIUE = 'NU',
  NORFOLK_ISLAND = 'NF',
  NORTHERN_MARIANA_ISLANDS = 'MP',
  NORWAY = 'NO',
  OMAN = 'OM',
  PAKISTAN = 'PK',
  PALAU = 'PW',
  PALESTINIAN_TERRITORY = 'PS',
  PANAMA = 'PA',
  PAPUA_NEW_GUINEA = 'PG',
  PARAGUAY = 'PY',
  PERU = 'PE',
  PHILIPPINES = 'PH',
  PITCAIRN = 'PN',
  POLAND = 'PL',
  PORTUGAL = 'PT',
  PUERTO_RICO = 'PR',
  QATAR = 'QA',
  REUNION = 'RE',
  ROMANIA = 'RO',
  RUSSIAN_FEDERATION = 'RU',
  RWANDA = 'RW',
  SAINT_BARTHELEMY = 'BL',
  SAINT_HELENA = 'SH',
  SAINT_KITTS_AND_NEVIS = 'KN',
  SAINT_LUCIA = 'LC',
  SAINT_MARTIN = 'MF',
  SAINT_PIERRE_AND_MIQUELON = 'PM',
  SAINT_VINCENT_AND_GRENADINES = 'VC',
  SAMOA = 'WS',
  SAN_MARINO = 'SM',
  SAO_TOME_AND_PRINCIPE = 'ST',
  SAUDI_ARABIA = 'SA',
  SENEGAL = 'SN',
  SERBIA = 'RS',
  SEYCHELLES = 'SC',
  SIERRA_LEONE = 'SL',
  SINGAPORE = 'SG',
  SINT_MAARTEN = 'SX',
  SLOVAKIA = 'SK',
  SLOVENIA = 'SI',
  SOLOMON_ISLANDS = 'SB',
  SOMALIA = 'SO',
  SOUTH_AFRICA = 'ZA',
  SOUTH_GEORGIA_AND_SANDWICH_ISL = 'GS',
  SOUTH_SUDAN = 'SS',
  SPAIN = 'ES',
  SRI_LANKA = 'LK',
  SUDAN = 'SD',
  SURINAME = 'SR',
  SVALBARD_AND_JAN_MAYEN = 'SJ',
  SWAZILAND = 'SZ',
  SWEDEN = 'SE',
  SWITZERLAND = 'CH',
  SYRIAN_ARAB_REPUBLIC = 'SY',
  TAIWAN = 'TW',
  TAJIKISTAN = 'TJ',
  TANZANIA = 'TZ',
  THAILAND = 'TH',
  TIMOR_LESTE = 'TL',
  TOGO = 'TG',
  TOKELAU = 'TK',
  TONGA = 'TO',
  TRINIDAD_AND_TOBAGO = 'TT',
  TUNISIA = 'TN',
  TURKEY = 'TR',
  TURKMENISTAN = 'TM',
  TURKS_AND_CAICOS_ISLANDS = 'TC',
  TUVALU = 'TV',
  UGANDA = 'UG',
  UKRAINE = 'UA',
  UNITED_ARAB_EMIRATES = 'AE',
  UNITED_KINGDOM = 'GB',
  UNITED_STATES_OUTLYING_ISLANDS = 'UM',
  URUGUAY = 'UY',
  UZBEKISTAN = 'UZ',
  VANUATU = 'VU',
  VENEZUELA = 'VE',
  VIETNAM = 'VN',
  VIRGIN_ISLANDS_BRITISH = 'VG',
  VIRGIN_ISLANDS_US = 'VI',
  WALLIS_AND_FUTUNA = 'WF',
  WESTERN_SAHARA = 'EH',
  YEMEN = 'YE',
  ZAMBIA = 'ZM',
  ZIMBABWE = 'ZW'
}


registerEnumType(Country, {
  name: 'Country',
  description: 'The country code',
});

registerEnumType(UserStatus, {
  name: 'UserStatus',
  description: 'The user status',
});

@Entity({ name: 'Users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  lastName: string;

  @Column({ nullable: true , unique: true })
  username: string;
  
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.DEACTIVATED,
  })
  @Field((type) => UserStatus)
  status: UserStatus;

  @Column({ nullable: true, default: false })
  @Field()
  emailVerified: boolean;

  @Column()
  password: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Field((type) => [Role], { nullable: 'itemsAndList' })
  @ManyToMany((type) => Role, (role) => role.users, { eager: true })
  @JoinTable({ name: 'UserRoles' })
  roles: Role[];

  @Column({
    type: 'enum',
    enum: Country,
    default: Country.UNITED_STATES
  })
  @Field((type) => Country)
  country: string;

  @Field((type) => [Grade], { nullable: 'itemsAndList' })
  @ManyToMany((type) => Grade, (grade) => grade.users)
  @JoinTable({ name: 'UserGrades' })
  gradeLevel: Grade[];

  @Field((type) => [SubjectArea] , {nullable: 'itemsAndList'})
  @ManyToMany(type => SubjectArea, subjectArea => subjectArea.users)
  @JoinTable({ name: 'UsersSubjectAreas'})
  subjectArea: SubjectArea[];

  @Field((type) => Organization , {nullable: true})
  @ManyToOne(() => Organization, organization => organization.users )
  organization: Organization;

  @Column({ nullable: true })
  @Field(() => schoolType)
  category: schoolType

  @Column({ nullable: true })
  @Field({ nullable: true })
  zip: string;

  @Column({ nullable: true, default: true })
  @Field((type) => Boolean , {defaultValue: true})
  nlnOpt: boolean;

  @Column({nullable: true ,default: false})  
  @Field((type) => Boolean , {defaultValue: false} )
  siftOpt: boolean

  @Column({nullable: true , default: 0})
  numOfLogins:number

  @Column({type: 'timestamp'  , nullable: true})
  lastLoginAt: Date

  @Column({ nullable: true })
  @Field({ nullable: true, defaultValue: null })
  awsAccessToken: string;

  @Column({ nullable: true })
  @Field({ nullable: true, defaultValue: null })
  awsRefreshToken: string;

  @Column({ unique: true })
  @Field()
  awsSub: string;

  @Column({ type: 'json', nullable: true })
  meta: string;

  @Column({ type: 'text', nullable: true , default:'' })
  log: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  token: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @Field()
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field()
  updatedAt: string;

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
