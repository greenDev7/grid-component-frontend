import { createStore } from 'vuex'
import grid from "./modules/grid";
import gridOptions from "./modules/gridOptions";

export default createStore({
  modules: {
    grid,
    gridOptions
  }
})
