// export class AppConstants {
  

//   export function getBaseUrl() {
//     return document.getElementsByTagName('base')[0].href;
//   }
  
  
//   const providers = [
//     { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
//   ];
// }


 export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
  }
  
  
  const providers = [
    { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
  ];

