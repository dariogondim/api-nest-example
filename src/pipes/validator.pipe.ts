
import { PipeTransform, ArgumentMetadata, BadRequestException, Injectable } from '@nestjs/common';

import { validate, ValidatorOptions } from 'class-validator';
import { plainToClass } from 'class-transformer';

const validatorOptions: ValidatorOptions = {
    skipMissingProperties: true,
    forbidUnknownValues: true,
    whitelist: true,
    forbidNonWhitelisted: true,
}

@Injectable()
export class ValidatorPipe implements PipeTransform<any> {
    async transform(value, metadata: ArgumentMetadata) {
      const { metatype } = metadata;
      if (!metatype || !this.toValidate(metatype)) {
          return value;
      }
      const object = plainToClass(metatype, value);
      const errors = await validate(object, validatorOptions);
      const messages: any[] = [];
      if (errors.length > 0) {
        for(let error of errors) {
            messages.push({
                field: error.property,
                constraints: error.constraints
            });
        }
        throw new BadRequestException(messages);
      }
      return value;
    }

    private toValidate(metatype): boolean {
      const types = [String, Boolean, Number, Array, Object];
      return !types.find((type) => metatype === type);
    }
}