export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  ecocashNumber: string;
  email?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
