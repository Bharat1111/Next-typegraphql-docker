import { EntityManager } from '@mikro-orm/core';
import { Connection } from '@mikro-orm/core/connections';
import { IDatabaseDriver } from '@mikro-orm/core/drivers';
import { Request, Response } from 'express';

export interface MyContext  {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    req: Request & {
        session: {
          userId?: any;
        };
    };
    res: Response;
}