import { AppProvider } from "./AppContext";

const Context = ({ children }) => {
  return <AppProvider>{children}</AppProvider>;
};

export default Context;
