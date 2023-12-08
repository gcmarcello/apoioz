import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','phone','name','password','role','createdAt','updatedAt']);

export const UserInfoScalarFieldEnumSchema = z.enum(['userId','birthDate','stateId','partyId','cityId','zoneId','sectionId','createdAt','updatedAt']);

export const PartyScalarFieldEnumSchema = z.enum(['id','number','name','ideology']);

export const CampaignScalarFieldEnumSchema = z.enum(['id','userId','options','name','year','cityId','stateId','type','createdAt','updatedAt']);

export const SupporterScalarFieldEnumSchema = z.enum(['id','campaignId','userId','referralId','level','createdAt','updatedAt','sectionId','zoneId']);

export const SupporterGroupScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt']);

export const SupporterGroupMembershipScalarFieldEnumSchema = z.enum(['supporterId','supporterGroupId','isOwner','id','createdAt','updatedAt']);

export const EventScalarFieldEnumSchema = z.enum(['id','name','description','location','dateStart','dateEnd','campaignId','hostId','status','createdAt','updatedAt','observations']);

export const InviteCodeScalarFieldEnumSchema = z.enum(['id','campaignId','referralId','expiresAt','enteredAt','submittedAt','createdAt','updatedAt']);

export const AddressScalarFieldEnumSchema = z.enum(['id','lat','lng','address','location','neighborhood','zipcode','cityId']);

export const CityScalarFieldEnumSchema = z.enum(['id','name','stateId']);

export const City_To_ZoneScalarFieldEnumSchema = z.enum(['id','cityId','zoneId']);

export const SectionScalarFieldEnumSchema = z.enum(['id','number','addressId','zoneId']);

export const StateScalarFieldEnumSchema = z.enum(['id','code','name']);

export const ZoneScalarFieldEnumSchema = z.enum(['id','number','stateId']);

export const ZoneGeoJSONScalarFieldEnumSchema = z.enum(['zoneId','geoJSON']);

export const NeighborhoodScalarFieldEnumSchema = z.enum(['id','name','cityId','geoJSON']);

export const PasswordRecoveryScalarFieldEnumSchema = z.enum(['id','userId','createdAt','expiresAt','updatedAt']);

export const PollScalarFieldEnumSchema = z.enum(['id','title','campaignId','activeAtSignUp','active','createdAt','updatedAt']);

export const PollQuestionScalarFieldEnumSchema = z.enum(['id','pollId','question','allowMultipleAnswers','allowFreeAnswer','createdAt','updatedAt','active']);

export const PollOptionScalarFieldEnumSchema = z.enum(['id','questionId','name','createdAt','updatedAt','active']);

export const PollAnswerScalarFieldEnumSchema = z.enum(['id','answer','pollId','questionId','supporterId','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const UserOrderByRelevanceFieldEnumSchema = z.enum(['id','email','phone','name','password','role']);

export const UserInfoOrderByRelevanceFieldEnumSchema = z.enum(['userId','stateId','partyId','cityId','zoneId','sectionId']);

export const PartyOrderByRelevanceFieldEnumSchema = z.enum(['id','name','ideology']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const CampaignOrderByRelevanceFieldEnumSchema = z.enum(['id','userId','name','year','cityId','stateId']);

export const SupporterOrderByRelevanceFieldEnumSchema = z.enum(['id','campaignId','userId','referralId','sectionId','zoneId']);

export const SupporterGroupOrderByRelevanceFieldEnumSchema = z.enum(['id']);

export const SupporterGroupMembershipOrderByRelevanceFieldEnumSchema = z.enum(['supporterId','supporterGroupId','id']);

export const EventOrderByRelevanceFieldEnumSchema = z.enum(['id','name','description','location','campaignId','hostId','status','observations']);

export const InviteCodeOrderByRelevanceFieldEnumSchema = z.enum(['id','campaignId','referralId']);

export const AddressOrderByRelevanceFieldEnumSchema = z.enum(['id','lat','lng','address','location','neighborhood','zipcode','cityId']);

export const CityOrderByRelevanceFieldEnumSchema = z.enum(['id','name','stateId']);

export const City_To_ZoneOrderByRelevanceFieldEnumSchema = z.enum(['id','cityId','zoneId']);

export const SectionOrderByRelevanceFieldEnumSchema = z.enum(['id','addressId','zoneId']);

export const StateOrderByRelevanceFieldEnumSchema = z.enum(['id','code','name']);

export const ZoneOrderByRelevanceFieldEnumSchema = z.enum(['id','stateId']);

export const ZoneGeoJSONOrderByRelevanceFieldEnumSchema = z.enum(['zoneId']);

export const NeighborhoodOrderByRelevanceFieldEnumSchema = z.enum(['id','name','cityId']);

export const PasswordRecoveryOrderByRelevanceFieldEnumSchema = z.enum(['id','userId']);

export const PollOrderByRelevanceFieldEnumSchema = z.enum(['id','title','campaignId']);

export const PollQuestionOrderByRelevanceFieldEnumSchema = z.enum(['id','pollId','question']);

export const PollOptionOrderByRelevanceFieldEnumSchema = z.enum(['id','questionId','name']);

export const PollAnswerOrderByRelevanceFieldEnumSchema = z.enum(['id','pollId','questionId','supporterId']);

export const CampaignTypesSchema = z.enum(['conselheiro_tutelar','vereador','prefeito','deputado_estadual','deputado_federal','senador','governador','presidente']);

export type CampaignTypesType = `${z.infer<typeof CampaignTypesSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  name: z.string().nullable(),
  password: z.string().nullable(),
  role: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

// USER RELATION SCHEMA
//------------------------------------------------------

export type UserRelations = {
  info?: UserInfoWithRelations | null;
  campaign: CampaignWithRelations[];
  supporter: SupporterWithRelations[];
  PasswordRecovery: PasswordRecoveryWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  info: z.lazy(() => UserInfoWithRelationsSchema).nullable(),
  campaign: z.lazy(() => CampaignWithRelationsSchema).array(),
  supporter: z.lazy(() => SupporterWithRelationsSchema).array(),
  PasswordRecovery: z.lazy(() => PasswordRecoveryWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// USER INFO SCHEMA
/////////////////////////////////////////

export const UserInfoSchema = z.object({
  userId: z.string().uuid(),
  birthDate: z.coerce.date().nullable(),
  stateId: z.string().nullable(),
  partyId: z.string().nullable(),
  cityId: z.string().nullable(),
  zoneId: z.string().nullable(),
  sectionId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UserInfo = z.infer<typeof UserInfoSchema>

// USER INFO RELATION SCHEMA
//------------------------------------------------------

export type UserInfoRelations = {
  user: UserWithRelations;
  party?: PartyWithRelations | null;
  State?: StateWithRelations | null;
  City?: CityWithRelations | null;
  Zone?: ZoneWithRelations | null;
  Section?: SectionWithRelations | null;
};

export type UserInfoWithRelations = z.infer<typeof UserInfoSchema> & UserInfoRelations

export const UserInfoWithRelationsSchema: z.ZodType<UserInfoWithRelations> = UserInfoSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
  party: z.lazy(() => PartyWithRelationsSchema).nullable(),
  State: z.lazy(() => StateWithRelationsSchema).nullable(),
  City: z.lazy(() => CityWithRelationsSchema).nullable(),
  Zone: z.lazy(() => ZoneWithRelationsSchema).nullable(),
  Section: z.lazy(() => SectionWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// PARTY SCHEMA
/////////////////////////////////////////

export const PartySchema = z.object({
  id: z.string(),
  number: z.number().int(),
  name: z.string(),
  ideology: z.string(),
})

export type Party = z.infer<typeof PartySchema>

// PARTY RELATION SCHEMA
//------------------------------------------------------

export type PartyRelations = {
  UserInfo: UserInfoWithRelations[];
};

export type PartyWithRelations = z.infer<typeof PartySchema> & PartyRelations

export const PartyWithRelationsSchema: z.ZodType<PartyWithRelations> = PartySchema.merge(z.object({
  UserInfo: z.lazy(() => UserInfoWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// CAMPAIGN SCHEMA
/////////////////////////////////////////

export const CampaignSchema = z.object({
  type: CampaignTypesSchema,
  id: z.string().uuid(),
  userId: z.string(),
  options: JsonValueSchema,
  name: z.string(),
  year: z.string(),
  cityId: z.string().nullable(),
  stateId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Campaign = z.infer<typeof CampaignSchema>

// CAMPAIGN RELATION SCHEMA
//------------------------------------------------------

export type CampaignRelations = {
  user?: UserWithRelations | null;
  supporters: SupporterWithRelations[];
  city?: CityWithRelations | null;
  state?: StateWithRelations | null;
  Event: EventWithRelations[];
  InviteCode: InviteCodeWithRelations[];
  Poll: PollWithRelations[];
};

export type CampaignWithRelations = Omit<z.infer<typeof CampaignSchema>, "options"> & {
  options?: JsonValueType | null;
} & CampaignRelations

export const CampaignWithRelationsSchema: z.ZodType<CampaignWithRelations> = CampaignSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema).nullable(),
  supporters: z.lazy(() => SupporterWithRelationsSchema).array(),
  city: z.lazy(() => CityWithRelationsSchema).nullable(),
  state: z.lazy(() => StateWithRelationsSchema).nullable(),
  Event: z.lazy(() => EventWithRelationsSchema).array(),
  InviteCode: z.lazy(() => InviteCodeWithRelationsSchema).array(),
  Poll: z.lazy(() => PollWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SUPPORTER SCHEMA
/////////////////////////////////////////

export const SupporterSchema = z.object({
  id: z.string().uuid(),
  campaignId: z.string(),
  userId: z.string(),
  referralId: z.string().nullable(),
  level: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  sectionId: z.string().nullable(),
  zoneId: z.string().nullable(),
})

export type Supporter = z.infer<typeof SupporterSchema>

// SUPPORTER RELATION SCHEMA
//------------------------------------------------------

export type SupporterRelations = {
  campaign?: CampaignWithRelations | null;
  user: UserWithRelations;
  referral?: SupporterWithRelations | null;
  referred: SupporterWithRelations[];
  supporterGroupsMemberships: SupporterGroupMembershipWithRelations[];
  Event: EventWithRelations[];
  Section?: SectionWithRelations | null;
  Zone?: ZoneWithRelations | null;
  InviteCode: InviteCodeWithRelations[];
  PollAnswer: PollAnswerWithRelations[];
};

export type SupporterWithRelations = z.infer<typeof SupporterSchema> & SupporterRelations

export const SupporterWithRelationsSchema: z.ZodType<SupporterWithRelations> = SupporterSchema.merge(z.object({
  campaign: z.lazy(() => CampaignWithRelationsSchema).nullable(),
  user: z.lazy(() => UserWithRelationsSchema),
  referral: z.lazy(() => SupporterWithRelationsSchema).nullable(),
  referred: z.lazy(() => SupporterWithRelationsSchema).array(),
  supporterGroupsMemberships: z.lazy(() => SupporterGroupMembershipWithRelationsSchema).array(),
  Event: z.lazy(() => EventWithRelationsSchema).array(),
  Section: z.lazy(() => SectionWithRelationsSchema).nullable(),
  Zone: z.lazy(() => ZoneWithRelationsSchema).nullable(),
  InviteCode: z.lazy(() => InviteCodeWithRelationsSchema).array(),
  PollAnswer: z.lazy(() => PollAnswerWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SUPPORTER GROUP SCHEMA
/////////////////////////////////////////

export const SupporterGroupSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type SupporterGroup = z.infer<typeof SupporterGroupSchema>

// SUPPORTER GROUP RELATION SCHEMA
//------------------------------------------------------

export type SupporterGroupRelations = {
  memberships: SupporterGroupMembershipWithRelations[];
};

export type SupporterGroupWithRelations = z.infer<typeof SupporterGroupSchema> & SupporterGroupRelations

export const SupporterGroupWithRelationsSchema: z.ZodType<SupporterGroupWithRelations> = SupporterGroupSchema.merge(z.object({
  memberships: z.lazy(() => SupporterGroupMembershipWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// SUPPORTER GROUP MEMBERSHIP SCHEMA
/////////////////////////////////////////

export const SupporterGroupMembershipSchema = z.object({
  supporterId: z.string(),
  supporterGroupId: z.string(),
  isOwner: z.boolean(),
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type SupporterGroupMembership = z.infer<typeof SupporterGroupMembershipSchema>

// SUPPORTER GROUP MEMBERSHIP RELATION SCHEMA
//------------------------------------------------------

export type SupporterGroupMembershipRelations = {
  supporter: SupporterWithRelations;
  supporterGroup: SupporterGroupWithRelations;
};

export type SupporterGroupMembershipWithRelations = z.infer<typeof SupporterGroupMembershipSchema> & SupporterGroupMembershipRelations

export const SupporterGroupMembershipWithRelationsSchema: z.ZodType<SupporterGroupMembershipWithRelations> = SupporterGroupMembershipSchema.merge(z.object({
  supporter: z.lazy(() => SupporterWithRelationsSchema),
  supporterGroup: z.lazy(() => SupporterGroupWithRelationsSchema),
}))

/////////////////////////////////////////
// EVENT SCHEMA
/////////////////////////////////////////

export const EventSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  dateStart: z.coerce.date(),
  dateEnd: z.coerce.date(),
  campaignId: z.string(),
  hostId: z.string(),
  status: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  observations: z.string().nullable(),
})

export type Event = z.infer<typeof EventSchema>

// EVENT RELATION SCHEMA
//------------------------------------------------------

export type EventRelations = {
  Campaign: CampaignWithRelations;
  Supporter?: SupporterWithRelations | null;
};

export type EventWithRelations = z.infer<typeof EventSchema> & EventRelations

export const EventWithRelationsSchema: z.ZodType<EventWithRelations> = EventSchema.merge(z.object({
  Campaign: z.lazy(() => CampaignWithRelationsSchema),
  Supporter: z.lazy(() => SupporterWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// INVITE CODE SCHEMA
/////////////////////////////////////////

export const InviteCodeSchema = z.object({
  id: z.string().uuid(),
  campaignId: z.string(),
  referralId: z.string(),
  expiresAt: z.coerce.date(),
  enteredAt: z.coerce.date().nullable(),
  submittedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type InviteCode = z.infer<typeof InviteCodeSchema>

// INVITE CODE RELATION SCHEMA
//------------------------------------------------------

export type InviteCodeRelations = {
  campaign: CampaignWithRelations;
  referral: SupporterWithRelations;
};

export type InviteCodeWithRelations = z.infer<typeof InviteCodeSchema> & InviteCodeRelations

export const InviteCodeWithRelationsSchema: z.ZodType<InviteCodeWithRelations> = InviteCodeSchema.merge(z.object({
  campaign: z.lazy(() => CampaignWithRelationsSchema),
  referral: z.lazy(() => SupporterWithRelationsSchema),
}))

/////////////////////////////////////////
// ADDRESS SCHEMA
/////////////////////////////////////////

export const AddressSchema = z.object({
  id: z.string(),
  lat: z.string().nullable(),
  lng: z.string().nullable(),
  address: z.string().nullable(),
  location: z.string().nullable(),
  neighborhood: z.string().nullable(),
  zipcode: z.string().nullable(),
  cityId: z.string(),
})

export type Address = z.infer<typeof AddressSchema>

// ADDRESS RELATION SCHEMA
//------------------------------------------------------

export type AddressRelations = {
  City: CityWithRelations;
  Section: SectionWithRelations[];
};

export type AddressWithRelations = z.infer<typeof AddressSchema> & AddressRelations

export const AddressWithRelationsSchema: z.ZodType<AddressWithRelations> = AddressSchema.merge(z.object({
  City: z.lazy(() => CityWithRelationsSchema),
  Section: z.lazy(() => SectionWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// CITY SCHEMA
/////////////////////////////////////////

export const CitySchema = z.object({
  id: z.string(),
  name: z.string(),
  stateId: z.string(),
})

export type City = z.infer<typeof CitySchema>

// CITY RELATION SCHEMA
//------------------------------------------------------

export type CityRelations = {
  Address: AddressWithRelations[];
  State: StateWithRelations;
  City_To_Zone: City_To_ZoneWithRelations[];
  UserInfo: UserInfoWithRelations[];
  Campaign: CampaignWithRelations[];
  Neighborhood: NeighborhoodWithRelations[];
};

export type CityWithRelations = z.infer<typeof CitySchema> & CityRelations

export const CityWithRelationsSchema: z.ZodType<CityWithRelations> = CitySchema.merge(z.object({
  Address: z.lazy(() => AddressWithRelationsSchema).array(),
  State: z.lazy(() => StateWithRelationsSchema),
  City_To_Zone: z.lazy(() => City_To_ZoneWithRelationsSchema).array(),
  UserInfo: z.lazy(() => UserInfoWithRelationsSchema).array(),
  Campaign: z.lazy(() => CampaignWithRelationsSchema).array(),
  Neighborhood: z.lazy(() => NeighborhoodWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// CITY TO ZONE SCHEMA
/////////////////////////////////////////

export const City_To_ZoneSchema = z.object({
  id: z.string(),
  cityId: z.string(),
  zoneId: z.string(),
})

export type City_To_Zone = z.infer<typeof City_To_ZoneSchema>

// CITY TO ZONE RELATION SCHEMA
//------------------------------------------------------

export type City_To_ZoneRelations = {
  City: CityWithRelations;
  Zone: ZoneWithRelations;
};

export type City_To_ZoneWithRelations = z.infer<typeof City_To_ZoneSchema> & City_To_ZoneRelations

export const City_To_ZoneWithRelationsSchema: z.ZodType<City_To_ZoneWithRelations> = City_To_ZoneSchema.merge(z.object({
  City: z.lazy(() => CityWithRelationsSchema),
  Zone: z.lazy(() => ZoneWithRelationsSchema),
}))

/////////////////////////////////////////
// SECTION SCHEMA
/////////////////////////////////////////

export const SectionSchema = z.object({
  id: z.string(),
  number: z.number().int(),
  addressId: z.string().nullable(),
  zoneId: z.string(),
})

export type Section = z.infer<typeof SectionSchema>

// SECTION RELATION SCHEMA
//------------------------------------------------------

export type SectionRelations = {
  Address?: AddressWithRelations | null;
  Zone: ZoneWithRelations;
  UserInfo: UserInfoWithRelations[];
  Supporter: SupporterWithRelations[];
};

export type SectionWithRelations = z.infer<typeof SectionSchema> & SectionRelations

export const SectionWithRelationsSchema: z.ZodType<SectionWithRelations> = SectionSchema.merge(z.object({
  Address: z.lazy(() => AddressWithRelationsSchema).nullable(),
  Zone: z.lazy(() => ZoneWithRelationsSchema),
  UserInfo: z.lazy(() => UserInfoWithRelationsSchema).array(),
  Supporter: z.lazy(() => SupporterWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// STATE SCHEMA
/////////////////////////////////////////

export const StateSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
})

export type State = z.infer<typeof StateSchema>

// STATE RELATION SCHEMA
//------------------------------------------------------

export type StateRelations = {
  City: CityWithRelations[];
  Zone: ZoneWithRelations[];
  UserInfo: UserInfoWithRelations[];
  Campaign: CampaignWithRelations[];
};

export type StateWithRelations = z.infer<typeof StateSchema> & StateRelations

export const StateWithRelationsSchema: z.ZodType<StateWithRelations> = StateSchema.merge(z.object({
  City: z.lazy(() => CityWithRelationsSchema).array(),
  Zone: z.lazy(() => ZoneWithRelationsSchema).array(),
  UserInfo: z.lazy(() => UserInfoWithRelationsSchema).array(),
  Campaign: z.lazy(() => CampaignWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// ZONE SCHEMA
/////////////////////////////////////////

export const ZoneSchema = z.object({
  id: z.string(),
  number: z.number().int(),
  stateId: z.string(),
})

export type Zone = z.infer<typeof ZoneSchema>

// ZONE RELATION SCHEMA
//------------------------------------------------------

export type ZoneRelations = {
  City_To_Zone: City_To_ZoneWithRelations[];
  Section: SectionWithRelations[];
  State: StateWithRelations;
  UserInfo: UserInfoWithRelations[];
  Supporter: SupporterWithRelations[];
  ZoneGeoJSON?: ZoneGeoJSONWithRelations | null;
};

export type ZoneWithRelations = z.infer<typeof ZoneSchema> & ZoneRelations

export const ZoneWithRelationsSchema: z.ZodType<ZoneWithRelations> = ZoneSchema.merge(z.object({
  City_To_Zone: z.lazy(() => City_To_ZoneWithRelationsSchema).array(),
  Section: z.lazy(() => SectionWithRelationsSchema).array(),
  State: z.lazy(() => StateWithRelationsSchema),
  UserInfo: z.lazy(() => UserInfoWithRelationsSchema).array(),
  Supporter: z.lazy(() => SupporterWithRelationsSchema).array(),
  ZoneGeoJSON: z.lazy(() => ZoneGeoJSONWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// ZONE GEO JSON SCHEMA
/////////////////////////////////////////

export const ZoneGeoJSONSchema = z.object({
  zoneId: z.string().uuid(),
  geoJSON: JsonValueSchema,
})

export type ZoneGeoJSON = z.infer<typeof ZoneGeoJSONSchema>

// ZONE GEO JSON RELATION SCHEMA
//------------------------------------------------------

export type ZoneGeoJSONRelations = {
  Zone: ZoneWithRelations;
};

export type ZoneGeoJSONWithRelations = Omit<z.infer<typeof ZoneGeoJSONSchema>, "geoJSON"> & {
  geoJSON?: JsonValueType | null;
} & ZoneGeoJSONRelations

export const ZoneGeoJSONWithRelationsSchema: z.ZodType<ZoneGeoJSONWithRelations> = ZoneGeoJSONSchema.merge(z.object({
  Zone: z.lazy(() => ZoneWithRelationsSchema),
}))

/////////////////////////////////////////
// NEIGHBORHOOD SCHEMA
/////////////////////////////////////////

export const NeighborhoodSchema = z.object({
  id: z.string(),
  name: z.string(),
  cityId: z.string(),
  geoJSON: JsonValueSchema,
})

export type Neighborhood = z.infer<typeof NeighborhoodSchema>

// NEIGHBORHOOD RELATION SCHEMA
//------------------------------------------------------

export type NeighborhoodRelations = {
  City: CityWithRelations;
};

export type NeighborhoodWithRelations = Omit<z.infer<typeof NeighborhoodSchema>, "geoJSON"> & {
  geoJSON?: JsonValueType | null;
} & NeighborhoodRelations

export const NeighborhoodWithRelationsSchema: z.ZodType<NeighborhoodWithRelations> = NeighborhoodSchema.merge(z.object({
  City: z.lazy(() => CityWithRelationsSchema),
}))

/////////////////////////////////////////
// PASSWORD RECOVERY SCHEMA
/////////////////////////////////////////

export const PasswordRecoverySchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type PasswordRecovery = z.infer<typeof PasswordRecoverySchema>

// PASSWORD RECOVERY RELATION SCHEMA
//------------------------------------------------------

export type PasswordRecoveryRelations = {
  user: UserWithRelations;
};

export type PasswordRecoveryWithRelations = z.infer<typeof PasswordRecoverySchema> & PasswordRecoveryRelations

export const PasswordRecoveryWithRelationsSchema: z.ZodType<PasswordRecoveryWithRelations> = PasswordRecoverySchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
}))

/////////////////////////////////////////
// POLL SCHEMA
/////////////////////////////////////////

export const PollSchema = z.object({
  id: z.string(),
  title: z.string(),
  campaignId: z.string(),
  activeAtSignUp: z.boolean(),
  active: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Poll = z.infer<typeof PollSchema>

// POLL RELATION SCHEMA
//------------------------------------------------------

export type PollRelations = {
  campaign: CampaignWithRelations;
  PollQuestion: PollQuestionWithRelations[];
  PollAnswer: PollAnswerWithRelations[];
};

export type PollWithRelations = z.infer<typeof PollSchema> & PollRelations

export const PollWithRelationsSchema: z.ZodType<PollWithRelations> = PollSchema.merge(z.object({
  campaign: z.lazy(() => CampaignWithRelationsSchema),
  PollQuestion: z.lazy(() => PollQuestionWithRelationsSchema).array(),
  PollAnswer: z.lazy(() => PollAnswerWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// POLL QUESTION SCHEMA
/////////////////////////////////////////

export const PollQuestionSchema = z.object({
  id: z.string(),
  pollId: z.string().nullable(),
  question: z.string(),
  allowMultipleAnswers: z.boolean(),
  allowFreeAnswer: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  active: z.boolean(),
})

export type PollQuestion = z.infer<typeof PollQuestionSchema>

// POLL QUESTION RELATION SCHEMA
//------------------------------------------------------

export type PollQuestionRelations = {
  poll?: PollWithRelations | null;
  PollOption: PollOptionWithRelations[];
  PollAnswer: PollAnswerWithRelations[];
};

export type PollQuestionWithRelations = z.infer<typeof PollQuestionSchema> & PollQuestionRelations

export const PollQuestionWithRelationsSchema: z.ZodType<PollQuestionWithRelations> = PollQuestionSchema.merge(z.object({
  poll: z.lazy(() => PollWithRelationsSchema).nullable(),
  PollOption: z.lazy(() => PollOptionWithRelationsSchema).array(),
  PollAnswer: z.lazy(() => PollAnswerWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// POLL OPTION SCHEMA
/////////////////////////////////////////

export const PollOptionSchema = z.object({
  id: z.string(),
  questionId: z.string().nullable(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  active: z.boolean(),
})

export type PollOption = z.infer<typeof PollOptionSchema>

// POLL OPTION RELATION SCHEMA
//------------------------------------------------------

export type PollOptionRelations = {
  question?: PollQuestionWithRelations | null;
};

export type PollOptionWithRelations = z.infer<typeof PollOptionSchema> & PollOptionRelations

export const PollOptionWithRelationsSchema: z.ZodType<PollOptionWithRelations> = PollOptionSchema.merge(z.object({
  question: z.lazy(() => PollQuestionWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// POLL ANSWER SCHEMA
/////////////////////////////////////////

export const PollAnswerSchema = z.object({
  id: z.string(),
  answer: JsonValueSchema,
  pollId: z.string(),
  questionId: z.string(),
  supporterId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type PollAnswer = z.infer<typeof PollAnswerSchema>

// POLL ANSWER RELATION SCHEMA
//------------------------------------------------------

export type PollAnswerRelations = {
  poll: PollWithRelations;
  PollQuestion: PollQuestionWithRelations;
  supporter?: SupporterWithRelations | null;
};

export type PollAnswerWithRelations = Omit<z.infer<typeof PollAnswerSchema>, "answer"> & {
  answer?: JsonValueType | null;
} & PollAnswerRelations

export const PollAnswerWithRelationsSchema: z.ZodType<PollAnswerWithRelations> = PollAnswerSchema.merge(z.object({
  poll: z.lazy(() => PollWithRelationsSchema),
  PollQuestion: z.lazy(() => PollQuestionWithRelationsSchema),
  supporter: z.lazy(() => SupporterWithRelationsSchema).nullable(),
}))
