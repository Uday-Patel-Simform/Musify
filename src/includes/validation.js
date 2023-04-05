import { Form as VeeForm, Field as VeeField, defineRule, ErrorMessage, configure, } from "vee-validate"
import { required, min, max, alpha_spaces as alphaSpaces, email, min_value as minVal, max_value as maxVal,confirmed, not_one_of as excluded } from "@vee-validate/rules";

export default {
    install(app) {
        app.component('VeeForm', VeeForm)
        app.component('VeeField', VeeField)
        app.component('ErrorMessage', ErrorMessage)

        defineRule('required', required)
        defineRule('tos', required)
        defineRule('min', min)
        defineRule('max', max)
        defineRule('alpha_spaces', alphaSpaces)
        defineRule('email', email)
        defineRule('min_value', minVal)
        defineRule('max_value', maxVal)
        defineRule('passwords_mismatch', confirmed)
        defineRule('excluded', excluded)
        defineRule('country_excluded', excluded)

        configure({
            generateMessage:(ctx)=>{
                const messages={
                    required:`${ctx.field} field is required.`,
                    min:`${ctx.field} is too short.`,
                    max:`${ctx.field} is too long.`,
                    alpha_spaces:`${ctx.field} can only contain alphabetical characters and spaces.`,
                    email:`${ctx.field} must be a valid email.`,
                    min_value:`${ctx.field} must be over 18.`,
                    max_value:`${ctx.field} must be below 100.`,
                    excluded:`This value is not allowed for ${ctx.field} field.`,
                    country_excluded:`We are not accepting users from this location currently due to restrictions.`,
                    passwords_mismatch:`Confirm password and Password don't match.`,
                    tos:`You must accept "Terms of Service".`
                }

                const message = messages[ctx.rule.name] ? messages[ctx.rule.name] : `${ctx.field} is not valid.`;
                return message
            },
            validateOnBlur:true,
            validateOnChange:true,
            validateOnInput:false,
            validateOnModelUpdate:true,
        })
    },
}