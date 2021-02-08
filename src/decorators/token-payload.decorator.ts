import { createParamDecorator } from '@nestjs/common';

export const TokenPayload = createParamDecorator((data, req) => {
    return {
        userId: req.user.id,
        name: req.user.name,
        mail: req.user.mail
    };
});