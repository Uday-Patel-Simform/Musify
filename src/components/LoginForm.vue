<template>
    <!-- Login Form -->
    <div class="text-white text-center font-bold p-4 mb-4" v-if="login_show_alert" :class="login_alert_variant">{{
        login_alert_msg }}</div>
    <vee-form :validation-schema="login_schema" @submit="login">
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block mb-2">Email</label>
            <vee-field type="email" name="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />
            <ErrorMessage class="text-red-600" name="email"></ErrorMessage>
        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Password</label>
            <vee-field type="password" name="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password" />
            <ErrorMessage class="text-red-600" name="password"></ErrorMessage>
        </div>
        <button type="submit" :disabled="login_in_submission"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700">
            Submit
        </button>
    </vee-form>
</template>
<script>
import { mapActions } from 'pinia'
import { use_user_store } from '../stores/user'

export default {
    data() {
        return {

            login_schema: {
                email: 'required|email',
                password: 'required|min:8|max:100|excluded:password',
            },
            login_in_submission: false,
            login_show_alert: false,
            login_alert_variant: 'bg-blue-500',
            login_alert_msg: 'Please wait! We are logging you in.',
        }
    },
    methods: {

        ...mapActions(use_user_store, ['authenticate']),

        async login(values) {
            this.login_in_submission = true
            this.login_show_alert = true

            try {
                await this.authenticate(values)
            } catch (e) {
                this.login_alert_variant = "bg-red-500";
                this.login_alert_msg = "Invalid detail!!"
                this.login_in_submission = false;
                return
            }

            this.login_alert_variant = 'bg-green-500'
            this.login_alert_msg = 'Success! You are now logged in.'
            window.location.reload()
        }
    }
}
</script>