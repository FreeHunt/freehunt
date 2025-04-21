export class UserResponseDto {
  user: {
    pk: number;
    username: string;
    name: string;
    is_active: boolean;
    is_superuser: boolean;
    groups: {
      name: string;
      pk: string;
    }[];
    email: string;
    avatar: string;
    uid: string;
    settings: {
      locale: string;
    };
    type: string;
    system_permissions: string[];
  };
}
