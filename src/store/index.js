import { createStore } from "redux";

// reducer
import rootReducer from "store/reducers/index";

// Create store
const appStore = createStore(rootReducer);

export default appStore;