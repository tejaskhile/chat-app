// import { WebContainer } from '@webcontainer/api';

// let webContainerInstance = null;

// export const getWebContainer = async () => {
//   if (!webContainerInstance) {
//     try {
//       if (!window.crossOriginIsolated) {
//         throw new Error('Cross-Origin Isolation is not enabled');
//       }
      
//       webContainerInstance = await WebContainer.boot();
      
//       // Add basic error handling
//       webContainerInstance.on('error', (error) => {
//         console.error('WebContainer error:', error);
//       });
      
//     } catch (error) {
//       console.error('WebContainer boot failed:', error);
//       throw error;
//     }
//   }
//   return webContainerInstance;
// };