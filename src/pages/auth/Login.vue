<script setup lang="ts">
import router from '@/router';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { onMounted, ref } from 'vue';
import PageLayout from '../layouts/PageLayout.vue';
import GoogleIcon from '@/components/GoogleIcon.vue';
import type { FormInstance } from 'ant-design-vue';

const auth = getAuth();
let isLoading = ref<boolean>(false);
const formRef = ref<FormInstance>();
let formLogin = ref<any>({
    email: '',
    password: ''
})

onMounted(async () => {
    auth.onIdTokenChanged((user: any) => {
        // console.log("🚀 ~ file: Login.vue:7 ~ auth.onIdTokenChanged ~ user:", user)
    })
})

const handleLoginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(getAuth(), provider);
    // console.log("🚀 ~ file: Login.vue:14 ~ handleLogin ~ res:", res);
    if (res?.user?.uid) {
        await router.push("/home");
    }
}

const handleRouteToSignUp = async () => {
    await router.push("/signup")
}

const handleLogin = async () => {
    await formRef.value!.validate();
}
</script>

<template>
    <page-layout :is-loading="isLoading">
        <div class="main-page flex align-center">
            <div class="form-login">
                <a-form class="form flex-column" ref="formRef" :model="formLogin">
                    <div class="flex-column align-center">
                        <h2>Sign in</h2>
                    </div>
                    <a-form-item name="email" :rules="[
                        {
                            required: true,
                            message: 'Required',
                            trigger: ['blur', 'change']
                        }
                    ]">
                        <a-input class="input" placeHolder="Email">

                        </a-input>
                    </a-form-item>
                    <a-form-item name="password" :rules="[
                        {
                            required: true,
                            message: 'Required',
                            trigger: ['blur', 'change']
                        }
                    ]">
                        <a-input-password class="input" placeHolder="Password">

                        </a-input-password>
                    </a-form-item>
                    <a-button 
                      style="width: 100%;"
                      class="main-color text-second-color mb-20 login-buton"
                      @click="handleLogin"
                      >
                        Sign in
                    </a-button>
                    <a-button style="width: 100%;" class="main-color text-second-color login-buton flex align-center"
                        @click="handleLoginWithGoogle">
                        Sign in with google
                        <GoogleIcon class="ml-10" />
                    </a-button>
                    <div class="flex space-between mt-10">
                        <span class="link-color pointer">
                            Forgot password
                        </span>

                        <san class="link-color pointer" @click="handleRouteToSignUp">
                            Sign up
                        </san>
                    </div>
                </a-form>
            </div>
        </div>
    </page-layout>
</template>

<style scoped>
@import '../../assets/styles/common.css';
@import '../../assets/styles/color.css';

.form-login {
    width: 400px;
    background-color: #fff;
    margin: 0 auto;
}

.form {
    padding: 50px 30px;
}
</style>