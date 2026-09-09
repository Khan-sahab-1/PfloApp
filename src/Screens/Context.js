import { createContext,useContext } from 'react';
// export const AuthContext = createContext();
export const AuthContext = createContext();
export function useAuth(){
return useContext(AuthContext);
}
const userContext = createContext();
export const userProvider = userContext.Provider
const userConsumer = userContext.Consumer
export {userConsumer}