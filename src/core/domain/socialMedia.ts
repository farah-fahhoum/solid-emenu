export class SocialMedia {
  constructor(
    public readonly id: string,
    public link: string,
    public socialMediaType: SocialMediaType,
    public readonly createdAt: Date
  ) {}
}
export enum SocialMediaType {
  Facebook = "facebook",
  Twitter = "twitter",
  Instagram = "instagram",
  LinkedIn = "linkedin",
}
