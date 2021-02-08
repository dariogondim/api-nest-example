import { createParamDecorator } from '@nestjs/common';

export const TokenUserId = createParamDecorator((data, req) => {
    return req.user.id;
});