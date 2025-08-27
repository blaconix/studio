import { watch } from 'vue'
import { defineNuxtPlugin, getAppManifest, useUserSession } from '#imports'
import type { NuxtApp } from 'nuxt/app'


export default defineNuxtPlugin(async (nuxtApp) => {
  const { user } = useUserSession()

  let mounted = false
  watch(user, async (newUser) => {
    if (newUser?.contentUser) {
      await mountPreviewUIIfLoggedIn(nuxtApp as NuxtApp, newUser)
      mounted = true
    } else if (mounted) {
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    }
  }, { immediate: true })

  
})

async function mountPreviewUIIfLoggedIn(nuxtApp: NuxtApp, user: any) {
  // Disable prerendering for preview
  const manifest = await getAppManifest()
  manifest.prerendered = []

  // preview/admin login logic
  if (typeof window === 'undefined') {
    nuxtApp.hook('app:mounted', async () => {
      await import('../utils/mountPreviewUI').then(({ mountPreviewUI }) => {
        mountPreviewUI()
      })
    })
  } else {
    await import('../utils/mountPreviewUI').then(({ mountPreviewUI }) => {
      mountPreviewUI()
    })
  }
}