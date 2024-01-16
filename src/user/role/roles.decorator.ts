import { SetMetadata } from '@nestjs/common';
import { Role } from './enum.role';

export const HasRoles = (...role: Role[]) => SetMetadata('role', role);