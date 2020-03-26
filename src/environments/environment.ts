/**
 * This file can be replaced during build by using the `fileReplacements` array.
 * The list of file replacements can be found in `angular.json`.
 * `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
 */

const baseUrl = `http://localhost`;
/**
 * Set the port to 8080
 */
const port = '8080';

// combination of the base uniform resource locator and its port number
const url = `${baseUrl}:${port}`;

/**
 * google map api key 
 */
const googleKey = process.env.GOOGLEMAPSKEY;
 /**
   * This is the environment config.
   */

export const environment = {
 
  production: false,
  environmentName: 'Default Environment',
  userUri: `${url}/users/`,
  loginUri: `${url}/login/`,
  batchesUri: `${url}/batches/`,
  carUri: `${url}/cars/`,
  adminUri: `${url}/admins/`,
  infoUri: `${url}/info/`,
  googleMapKey: `${googleKey}`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
