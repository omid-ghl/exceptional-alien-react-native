import { NativeModules } from "react-native";
import Reactotron from "reactotron-react-native";

let scriptHostname;
if (__DEV__) {
	const scriptURL = NativeModules.SourceCode.scriptURL;
	scriptHostname = scriptURL.split("://")[1].split(":")[0];
	// @ts-ignore
	// console.log = Reactotron.log; // show log in reactotron
}

// @ts-ignore
const reactotron = Reactotron.configure(scriptHostname && { host: scriptHostname }) // controls connection & communication settings
	.useReactNative() // add all built-in react native plugins
	.connect(); // let's connect!

export default reactotron;
