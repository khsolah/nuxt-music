import Vue from 'vue'
import Observer from '~/utilities/lazy-loading'

const observer = Observer.getInstance()

Vue.directive('lazy', {
  bind(el, binding) {
    el.setAttribute('data-src', binding.value)
    observer.observe(el)
  },
  unbind(el) {
    observer.unobserve(el)
  }
})
