<script setup lang="ts">
import router from '@/router';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { onMounted } from 'vue';
const auth = getAuth();
onMounted(async () => {
    auth.onIdTokenChanged((user: any) => {
        // console.log("🚀 ~ file: Login.vue:7 ~ auth.onIdTokenChanged ~ user:", user)
    })
})

const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(getAuth(), provider);
    // console.log("🚀 ~ file: Login.vue:14 ~ handleLogin ~ res:", res);
    if(res?.user?.uid) {
        await router.push("/home");
    }
}
</script>

<template>
    <div>
        <a-button type="primary" @click="handleLogin">
            Login
        </a-button> 
    </div>
</template>

<style scoped></style>