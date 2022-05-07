// import { createApp } from 'vue'

// /**
//  *  Vue Instance Initialization
//  */

// // export const useAuth0 = () => {

//   const app =  createApp({
//     data() {
//       return {
//         MOPopupsToShow: []
//       }
//     },
//     methods: {
//       // bgColor - optional
//       // textColor - optional
//       // type - optional; possible values: type, info, warn
//       // messageText - required
//       // closeDelay - optional in ms
//       showMOPopup(params) {
//         const id = Date.now() // create unique id

//         if (params.messageText.trim()) {
//           this.MOPopupsToShow.push({
//             id,
//             bgColor: '#ff00ff',
//             textColor: '#ffffff',
//             type: 'info',
//             ...params,
//           })

//           setTimeout(() => {
//             this.hideMOPopup(id)
//           }, params.closeDelay || 5000) 
//         }
//       },

//       hideMOPopup(popupId) {
//         const pos = this.MOPopupsToShow.findIndex(x => x.id === popupId); // find popup in array
//         if (pos !== -1) { // check if popup is founded
//           this.MOPopupsToShow.splice(pos, 1)
//         }
//       }
//     }

//   });



// export const MOPopup = {
//   install(app, options) {
//     app.
//     useAuth0.prototype.$moPopup = useAuth0(options);
//   },
// };
