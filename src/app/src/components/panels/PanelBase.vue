<script setup lang="ts">
defineProps<{
  title?: string
}>()

const open = defineModel<boolean>()

function onBeforeEnter(el: Element) {
  const element = el as HTMLElement
  element.style.transform = 'translateX(-100%)'
  element.style.opacity = '0'
}

function onEnter(el: Element, done: () => void) {
  const element = el as HTMLElement

  element.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out'

  // Small delay for the browser to render the initial state (else transition is not applied on enter)
  setTimeout(() => {
    element.style.transform = 'translateX(0)'
    element.style.opacity = '1'
  }, 10)

  setTimeout(done, 300)
}

function onLeave(el: Element, done: () => void) {
  const element = el as HTMLElement

  element.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out'
  element.style.transform = 'translateX(-100%)'
  element.style.opacity = '0'

  setTimeout(done, 300)
}
</script>

<template>
  <Transition
    name="slide"
    :css="false"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @leave="onLeave"
  >
    <div
      v-if="open"
      class="fixed w-112 top-[var(--toolbar-height)] bottom-0 left-0 h-full overflow-y-auto border-r border-gray-200 bg-white"
    >
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex-1">
          <slot name="header">
            <h2
              v-if="title"
              class="text-lg font-semibold text-gray-900"
            >
              {{ title }}
            </h2>
          </slot>
        </div>
        <UButton
          icon="i-lucide-x"
          variant="ghost"
          size="xl"
          @click="open = false"
        />
      </div>

      <div class="flex-1">
        <slot />
      </div>
    </div>
  </Transition>
</template>
