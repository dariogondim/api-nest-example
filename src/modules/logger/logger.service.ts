import { Injectable } from '@nestjs/common';

import { Logger } from 'winston';
import * as winston from 'winston';

@Injectable()
export class LoggerService {

    private readonly logger: Logger;

    constructor() {
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.File({
                    level: 'error',
                    filename: 'error.log',
                    format: winston.format.simple()
                }),
                new winston.transports.File({
                    level: 'debug',
                    filename: 'all.log',
                    format: winston.format.simple()
                })
            ]
        });

        if(process.env.NODE_ENV !== 'prod' && process.env.NOD_ENV !== 'production') {
            this.logger.add(
                new winston.transports.Console({
                    level: 'silly',
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                })
            );
        }
    }

    error(message: string, trace?: string) {
        this.logger.error(message);
    }

    log(message: string) {
        this.logger.verbose(message);
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    info(message: string) {
        this.logger.info(message);
    }
}