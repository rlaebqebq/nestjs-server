import { SetMetadata } from '@nestjs/common';

export const Member = (isMember: boolean) => SetMetadata('member', isMember);
