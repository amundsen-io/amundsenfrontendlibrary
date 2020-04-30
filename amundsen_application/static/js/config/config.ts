import { AppConfig } from './config-types';
import configDefault from './config-default';
import configCustom from './config-custom';

// This is not a shallow merge. Any defined members of customConfig will override configDefault.
const appConfig: AppConfig = { ...configDefault, ...configCustom };

// TODO: Fix the env, it doesn't seem to be available in the JS
export const publicPath = (process.env.BASE_URL || '/admundsen').replace(/\/$/, '');

export default appConfig;
