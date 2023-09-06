/** this file imports a custom native module exported from android code
 * that android native module is responsible to handle complex cpu intensive functions
 * those computations are going to run in a separate thread from ui and js
 *
 * for example to get relative date in persian date
 * a little complex processing is needed
 * the function must be executed for each flatlist item
 * but if it doesn't execute in a separate thread
 * it will block ui and flat list items will render with so much delay
 */

import {NativeModules} from 'react-native';

const {ComputationModule} = NativeModules;

interface ComputationModuleInterface {
  getCustomPersianDateFormat(dateISOStr: string): Promise<string>;
}

export default ComputationModule as ComputationModuleInterface;
