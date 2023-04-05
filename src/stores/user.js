import {defineStore} from "pinia";
import { auth, users_collection } from "../includes/firebase";

export const use_user_store = defineStore("user",{
    state:()=>({
        user_logged_in: false,
    }),
    actions:{
        async register(values){
            const user_cred = await auth.createUserWithEmailAndPassword(values.email, values.password)

            await users_collection.doc(user_cred.user.uid).set({
                name: values.name,
                email: values.email,
                age: values.age,
                country: values.country,
            })

            await user_cred.user.updateProfile({
                displayName: values.name,
            })

            this.user_logged_in = true
        },
        async authenticate(values){
            await auth.signInWithEmailAndPassword(values.email, values.password)
            this.user_logged_in =true
        },
        async sign_out(){
            await auth.signOut()
            this.user_logged_in =false
        }
    }
})