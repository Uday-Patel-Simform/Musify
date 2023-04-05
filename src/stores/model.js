import {defineStore} from "pinia";

export default defineStore("modal",{
    state:()=>({
        is_open: false,
    }),
    getters:{
        hidden_class(state){
            return !state.is_open ? "hidden" : "";
        }
    }
})