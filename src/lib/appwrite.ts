import { Account, Client, ID, Permission, Query, Role, Storage, TablesDB } from 'appwrite';
import { config } from './config';

export const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);

export { ID, Query, Permission, Role };
