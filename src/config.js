/** Extract the root URL (protocol + hostname + port) **/
const rootUrl =
  window.location.protocol +
  '//' +
  window.location.hostname +
  (window.location.port ? ':' + window.location.port : '')

/** SERVER-SIDE URL **/
// const serverUrl = "https://server.exampreptutor.com"; //ExamPrepTutor Server UR?

/** LOCALHOST TESTING URL **/
const serverUrl = 'http://localhost:3005' //Localhost

/** LOCALHOST SCHOOL TESTING URL **/
const schoolServerUrl = 'http://localhost:5000' //Localhost Test Server?

/** CODE-SANDBOX URL **/
// const serverUrl = 'https://nk7rt3-3005.csb.app' //Crownzcom codesandbox

// Groq api key
const REACT_APP_GROQ_API_KEY =
  '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'

// to be removed /** ======== CROWNZCOM/MAIN SERVER-SIDE URL ======== **/
const mainServerUrl = 'http://localhost:3003' //Localhost Test Server
/*=======================================================================*/

export {
  serverUrl,
  schoolServerUrl,
  rootUrl,
  REACT_APP_GROQ_API_KEY,
  mainServerUrl,
}
