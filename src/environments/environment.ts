// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // Initialize Firebase
  firebaseConfig : {
    apiKey: "AIzaSyCd-SKOQlDWTxsYIEbBrKi6ojJ-cxmVcLo",
    authDomain: "zekes-44376.firebaseapp.com",
    databaseURL: "https://zekes-44376.firebaseio.com",
    projectId: "zekes-44376",
    storageBucket: "zekes-44376.appspot.com",
    messagingSenderId: "977375997610"
  }
};
