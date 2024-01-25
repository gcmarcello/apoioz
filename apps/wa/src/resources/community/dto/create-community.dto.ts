export class CreateCommunityDto {
  communityTitle: string;
  clusterSlug: string;
  ownerNumber?: string;
  allowNonAdminSubGroupCreation?: boolean;
  description: string;
  membershipApprovalMode?: boolean;
}
