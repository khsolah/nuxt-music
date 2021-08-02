export default class Observer {
  private static instance: IntersectionObserver
  private constructor() {
    /* eslint-disable no-new */
    Observer.instance = new IntersectionObserver(this.callback, this.options)
  }

  static getInstance() {
    if (!Observer.instance) new Observer()

    return Observer.instance
  }

  private callback: IntersectionObserverCallback = (entries, observer) => {
    Array.prototype.forEach.call(
      entries,
      ({ isIntersecting, target }: IntersectionObserverEntry) => {
        if (!isIntersecting) return

        observer.unobserve(target)
        const dataSrc = target.getAttribute('data-src') || ''

        target.setAttribute(
          'style',
          `${
            target.getAttribute('style') || ''
          }background-image: url(${dataSrc});background-position: center;background-repeat: no-repeat;`
        )
      }
    )
  }

  private options: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: [0]
  }
}
