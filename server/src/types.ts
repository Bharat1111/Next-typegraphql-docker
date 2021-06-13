import { Request, Response } from 'express';
import { createUpdootLoader } from './utils/createUpdootLoader';
import { createUserLoader } from './utils/createUserLoader';
// import session from 'express-session';

export interface MyContext  {
    req: Request 
        // & { session: session.SessionOptions | undefined } 
        & {
        session: {
          userId?: any;
        };
    };
    res: Response;
    userLoader: ReturnType<typeof createUserLoader>
    updootLoader: ReturnType<typeof createUpdootLoader>
}