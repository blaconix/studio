<script setup>
definePageMeta({
  layout: '',
})

const providers = [{
  label: 'Google',
  icon: 'i-simple-icons-google',
  onClick: () => {
    openInPopup('/_admin/auth/google')
  },
}, {
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  onClick: () => {
    openInPopup('/_admin/auth/github')
  },
}]

const { loggedIn, user, openInPopup } = useUserSession()

watch(loggedIn, (newVal) => {
  if (newVal) {
    navigateTo('/')
  }
}, { immediate: true })
</script>

<template>
  <div class="flex items-center justify-center mt-10">
    <h1 v-if="loggedIn">
      Welcome {{ user?.name }}!
    </h1>
    <UCard
      v-else
      class="w-full max-w-md"
    >
      <UAuthForm
        title="Login on Nuxt Studio"
        icon="i-lucide-user"
        :providers="providers"
      />
    </UCard>
  </div>
</template>
