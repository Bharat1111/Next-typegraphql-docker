import { __prod__ } from "./constants"
import { post } from "./entities/post"
import { MikroORM } from '@mikro-orm/core'
import path from 'path'
import { Users } from "./entities/User"

export default {
    migrations: {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-+\d+\.[tj]s$/,
    },
    entities: [post, Users],
    dbName: 'reddit',
    user: 'postgres',
    password: 'lsg@11_',
    type: 'postgresql',
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0]