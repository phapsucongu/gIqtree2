import { createContext } from "react";
import { NativeIntegration } from "../interfaces";
import { LocalNative } from ".";

export let NativeContext = createContext<NativeIntegration>(new LocalNative());