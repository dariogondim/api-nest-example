import { Injectable } from '@nestjs/common';

import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {

    private fbAdminSDK;

    constructor() {
        this.fbAdminSDK = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: 'eusa-api',
                clientEmail: 'firebase-adminsdk-l59b4@eusa-api.iam.gserviceaccount.com',
                privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDBf8l+XpCiV/vS\na/5dnEsokGmLnoydq61S0eo5wmXp3WuIk96JrDUTIqUoRjb0Ti23ajP+BBN3yUHB\nG+lbmXYVVZGdUWMSNG1iMrt86Sy+Qzrr3jUv5mBvqnGsxME3A755lU/p0xKox96h\nFZtAqOW8XyYkisLDhlOAPTOrSewvaLJH3qon0CBRtctRzL4SYdRfJtZLA/SRP+ai\nu6UaNwHpVE9nBq4PMXNdST2MCItTCYLwL7Pl6NQTyC1tnHvNoCeNnLxVFB47aLrL\nIL623pWDRPWWC0Wrwysjnykqhj8UhhcqOC2vyvInA/c/qwOqR/fhyV2BJI17eqpE\n1/F54SIlAgMBAAECggEAKS30GHXxE2+kirtLaqoer58OKzW+iLaWwBOm5IxrynnC\nDxKjD0sMD4q1ucy5mMQDhC9wqaw95WX6Han+P215HSC1CNUff6oTJk0ULAjmqgYe\nRcCoMo21c8ZDA2jrErV0BaWCWImARNWmWkNCI2BeZfic4jV6rghKAHZl5tvoTQ08\nnnwvJ534k003TLQoDpM4Gd2mg3IguK+nI8x5bufDZfcs3vHv669uMdqN96HKdgYU\n5QPRQ6UoxPkLzAUPGZKbVKZHnUj6YixL9xkQfJW+PWIbUDlkfg/dqy2J83G0QaBV\npVzkvhggcBPxWw4GtDm5Zat2jaLwSbr9o2TpVUZ5wQKBgQDyysj44OP8DEfYd0bV\n6Z+JiopDjaPvDd3QLcXELVlwANzBXIR/kwryOi5GZvowYhGL2X1jLCqH6XTvd1pv\n35fLDyivUYt2aokq/tmCrMfeDdkGm4XiLxyl3ds3jXRsePl0tq38YcfvdP9/gFtS\nTMsqY2ce8/VI7NzTIdyMoQgGwQKBgQDMBoeWJJw67zmd9rsRJV87f4ACucQIv0Ek\n1+jUISjWdGmSSbnp/dNi+GOTc5B2SMXgUVKczErXpD8HQ2IbFFAC5iy4DXBsi5W9\njv/+PYrbEJeJV3KvhKo7tJRCk8Pz+tnMTSi3lHzZfn4wd1k95jSBVQOy6jwc7i9t\n1jwavYx4ZQKBgQCFJEUvjgwX9RgVEdvLhLETOOD3iJ3kgyMnfWJdYU0RibeFZdnX\nJ+ixyswDmYcLr0vV+C+1icvM+m5Av5/dh6zzEt4JvlsPVf7gkB7xdRSppchkwjaa\nQaGhJ9eGUFEPBwwtP9yLcYe1veA6qEXsDObA2P/8zmWtVw8FzSToDYqcQQKBgGR0\nYpXeeL3bw7avIPQUPouA/3pYFNlpsZ1+YTjxCrZsov5QJqW7QDVer0iOgfZ7ZlJI\nODDTtZXvXMkquEc0/SAwTJxioZQQNi4bFpgLnS63QKVy1RjubRLwmn8dWkHqpQoe\ng4nAJqi/y0n5uYrsqbV0MloJUoe8DsY50WYpJdyxAoGBAOj6optgv7DkXRZWFf8d\ntIzeLZnwAfxEqrqKA70CTDHNG7wDw2uUTquMe2LLArhHSJyaU2aR8FP91DxHAo05\nWjGkOEa3bufFYQQ/Pa/j/ahyocMa8EjsVgdq3E82s1nICJp1rc5s62nMgdeoWUZp\n64xBzrm++bP4hj7ZWY3dWMuA\n-----END PRIVATE KEY-----\n'
            }),
            databaseURL: 'https://eusa-api.firebaseio.com'
        });
    }

    notifications() {
        if(this.fbAdminSDK)
            return this.fbAdminSDK.messaging();
        return null;
    }
}