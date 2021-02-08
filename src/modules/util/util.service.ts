import { Injectable } from '@nestjs/common';

import { accentMap } from './util.constants';

@Injectable()
export class UtilService {

    accentFold (text: string) {
        if (!text) return '';
        
        let resultText = '';
        for (let i=0; i<text.length; i++) {
            resultText += accentMap[text.charAt(i)] || text.charAt(i);
        }

        return resultText;
    }
}