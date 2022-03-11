import { SetMetadata } from '@nestjs/common';
import { Roles } from '@prisma/client';

export const hasRoles = (...hasRoles: Roles[]) =>
  SetMetadata('roles', hasRoles);
