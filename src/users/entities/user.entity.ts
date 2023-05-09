import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
CreateDateColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Role } from './role.entity';

import { Grade } from '../../resources/entities/grade-levels.entity';
import { SubjectArea } from '../../resources/entities/subject-areas.entity';
import { Organization } from './organization.entity';

export enum UserStatus {
  DEACTIVATED = 0,
  ACTIVE,
}

export enum Country {
  Afghanistan = 'AF',
  AlandIslands = 'AX',
  Albania = 'AL',
  Algeria = 'DZ',
  AmericanSamoa = 'AS',
  Andorra = 'AD',
  Angola = 'AO',
  Anguilla = 'AI',
  Antarctica = 'AQ',
  AntiguaAndBarbuda = 'AG',
  Argentina = 'AR',
  Armenia = 'AM',
  Aruba = 'AW',
  Australia = 'AU',
  Austria = 'AT',
  Azerbaijan = 'AZ',
  Bahamas = 'BS',
  Bahrain = 'BH',
  Bangladesh = 'BD',
  Barbados = 'BB',
  Belarus = 'BY',
  Belgium = 'BE',
  Belize = 'BZ',
  Benin = 'BJ',
  Bermuda = 'BM',
  Bhutan = 'BT',
  Bolivia = 'BO',
  BonaireSintEustatiusSaba = 'BQ',
  BosniaAndHerzegovina = 'BA',
  Botswana = 'BW',
  BouvetIsland = 'BV',
  Brazil = 'BR',
  BritishIndianOceanTerritory = 'IO',
  BruneiDarussalam = 'BN',
  Bulgaria = 'BG',
  BurkinaFaso = 'BF',
  Burundi = 'BI',
  Cambodia = 'KH',
  Cameroon = 'CM',
  Canada = 'CA',
  CapeVerde = 'CV',
  CaymanIslands = 'KY',
  CentralAfricanRepublic = 'CF',
  Chad = 'TD',
  Chile = 'CL',
  China = 'CN',
  ChristmasIsland = 'CX',
  CocosKeelingIslands = 'CC',
  Colombia = 'CO',
  Comoros = 'KM',
  Congo = 'CG',
  CongoDemocraticRepublic = 'CD',
  CookIslands = 'CK',
  CostaRica = 'CR',
  CoteDIvoire = 'CI',
  Croatia = 'HR',
  Cuba = 'CU',
  Curacao = 'CW',
  Cyprus = 'CY',
  CzechRepublic = 'CZ',
  Denmark = 'DK',
  Djibouti = 'DJ',
  Dominica = 'DM',
  DominicanRepublic = 'DO',
  Ecuador = 'EC',
  Egypt = 'EG',
  ElSalvador = 'SV',
  EquatorialGuinea = 'GQ',
  Eritrea = 'ER',
  Estonia = 'EE',
  Ethiopia = 'ET',
  FalklandIslands = 'FK',
  FaroeIslands = 'FO',
  Fiji = 'FJ',
  Finland = 'FI',
  France = 'FR',
  FrenchGuiana = 'GF',
  FrenchPolynesia = 'PF',
  FrenchSouthernTerritories = 'TF',
  Gabon = 'GA',
  Gambia = 'GM',
  Georgia = 'GE',
  Germany = 'DE',
  Ghana = 'GH',
  Gibraltar = 'GI',
  Greece = 'GR',
  Greenland = 'GL',
  Grenada = 'GD',
  Guadeloupe = 'GP',
  Guam = 'GU',
  Guatemala = 'GT',
  Guernsey = 'GG',
  Guinea = 'GN',
  GuineaBissau = 'GW',
  Guyana = 'GY',
  Haiti = 'HT',
  HeardIslandMcdonaldIslands = 'HM',
  HolySeeVaticanCityState = 'VA',
  Honduras = 'HN',
  HongKong = 'HK',
  Hungary = 'HU',
  Iceland = 'IS',
  India = 'IN',
  Indonesia = 'ID',
  Iran = 'IR',
  Iraq = 'IQ',
  Ireland = 'IE',
  IsleOfMan = 'IM',
  Israel = 'IL',
  Italy = 'IT',
  Jamaica = 'JM',
  Japan = 'JP',
  Jersey = 'JE',
  Jordan = 'JO',
  Kazakhstan = 'KZ',
  Kenya = 'KE',
  Kiribati = 'KI',
  Korea = 'KR',
  KoreaDemocraticPeoplesRepublic = 'KP',
  Kuwait = 'KW',
  Kyrgyzstan = 'KG',
  LaoPeoplesDemocraticRepublic = 'LA',
  Latvia = 'LV',
  Lebanon = 'LB',
  Lesotho = 'LS',
  Liberia = 'LR',
  LibyanArabJamahiriya = 'LY',
  Liechtenstein = 'LI',
  Lithuania = 'LT',
  Luxembourg = 'LU',
  Macao = 'MO',
  Macedonia = 'MK',
  Madagascar = 'MG',
  Malawi = 'MW',
  Malaysia = 'MY',
  Maldives = 'MV',
  Mali = 'ML',
  Malta = 'MT',
  MarshallIslands = 'MH',
  Martinique = 'MQ',
  Mauritania = 'MR',
  Mauritius = 'MU',
  Mayotte = 'YT',
  Mexico = 'MX',
  Micronesia = 'FM',
  Moldova = 'MD',
  Monaco = 'MC',
  Mongolia = 'MN',
  Montenegro = 'ME',
  Montserrat = 'MS',
  Morocco = 'MA',
  Mozambique = 'MZ',
  Myanmar = 'MM',
  Namibia = 'NA',
  Nauru = 'NR',
  Nepal = 'NP',
  Netherlands = 'NL',
  NewCaledonia = 'NC',
  NewZealand = 'NZ',
  Nicaragua = 'NI',
  Niger = 'NE',
  Nigeria = 'NG',
  Niue = 'NU',
  NorfolkIsland = 'NF',
  NorthernMarianaIslands = 'MP',
  Norway = 'NO',
  Oman = 'OM',
  Pakistan = 'PK',
  Palau = 'PW',
  PalestinianTerritory = 'PS',
  Panama = 'PA',
  PapuaNewGuinea = 'PG',
  Paraguay = 'PY',
  Peru = 'PE',
  Philippines = 'PH',
  Pitcairn = 'PN',
  Poland = 'PL',
  Portugal = 'PT',
  PuertoRico = 'PR',
  Qatar = 'QA',
  Reunion = 'RE',
  Romania = 'RO',
  RussianFederation = 'RU',
  Rwanda = 'RW',
  SaintBarthelemy = 'BL',
  SaintHelena = 'SH',
  SaintKittsAndNevis = 'KN',
  SaintLucia = 'LC',
  SaintMartin = 'MF',
  SaintPierreAndMiquelon = 'PM',
  SaintVincentAndGrenadines = 'VC',
  Samoa = 'WS',
  SanMarino = 'SM',
  SaoTomeAndPrincipe = 'ST',
  SaudiArabia = 'SA',
  Senegal = 'SN',
  Serbia = 'RS',
  Seychelles = 'SC',
  SierraLeone = 'SL',
  Singapore = 'SG',
  SintMaarten = 'SX',
  Slovakia = 'SK',
  Slovenia = 'SI',
  SolomonIslands = 'SB',
  Somalia = 'SO',
  SouthAfrica = 'ZA',
  SouthGeorgiaAndSandwichIsl = 'GS',
  SouthSudan = 'SS',
  Spain = 'ES',
  SriLanka = 'LK',
  Sudan = 'SD',
  Suriname = 'SR',
  SvalbardAndJanMayen = 'SJ',
  Swaziland = 'SZ',
  Sweden = 'SE',
  Switzerland = 'CH',
  SyrianArabRepublic = 'SY',
  Taiwan = 'TW',
  Tajikistan = 'TJ',
  Tanzania = 'TZ',
  Thailand = 'TH',
  TimorLeste = 'TL',
  Togo = 'TG',
  Tokelau = 'TK',
  Tonga = 'TO',
  TrinidadAndTobago = 'TT',
  Tunisia = 'TN',
  Turkey = 'TR',
  Turkmenistan = 'TM',
  TurksAndCaicosIslands = 'TC',
  Tuvalu = 'TV',
  Uganda = 'UG',
  Ukraine = 'UA',
  UnitedArabEmirates = 'AE',
  UnitedKingdom = 'GB',
  UnitedStates = 'US',
  UnitedStatesOutlyingIslands = 'UM',
  Uruguay = 'UY',
  Uzbekistan = 'UZ',
  Vanuatu = 'VU',
  Venezuela = 'VE',
  Vietnam = 'VN',
  VirginIslandsBritish = 'VG',
  VirginIslandsUS = 'VI',
  WallisAndFutuna = 'WF',
  WesternSahara = 'EH',
  Yemen = 'YE',
  Zambia = 'ZM',
  Zimbabwe = 'ZW',
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
    default: Country.UnitedStates
  })
  @Field((type) => Country)
  country: string;



  @Field(type => [Grade], { nullable: 'itemsAndList' })
  @ManyToMany(type => Grade, grade => grade.users, {  onUpdate: 'CASCADE', onDelete: "CASCADE" })
  gradeLevel: Grade[];

  @Field((type) => [SubjectArea] , {nullable: 'itemsAndList'})
  @ManyToMany(type => SubjectArea, subjectArea => subjectArea.users, { onUpdate: 'CASCADE' , onDelete: "CASCADE"})
  subjectArea: SubjectArea[];

  @Field((type) => [Organization] , {nullable: 'itemsAndList'})
  @OneToMany(type => Organization , organization => organization.user , { onUpdate: 'CASCADE' , onDelete: 'SET NULL'} )
  organizations: Organization[];

  @Column({ nullable: true, default: false })
  @Field()
  newsLitNationAcess: boolean;

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
