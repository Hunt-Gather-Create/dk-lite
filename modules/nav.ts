import DKDialog from './dk_dialog'
import { convertTag } from '../utils/helpers'
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock'

class DKNav {
  element: HTMLElement
  dkDialog: DKDialog
  _menu: DKNav['menu']
  _mediaQuery: DKNav['mediaQuery']
  _navToggle: DKNav['navToggle']
  _id: string
  _scrollableTarget: DKNav['scrollableTarget']

  constructor(element: HTMLElement) {
    this.element = element
    this.dkDialog = new DKDialog({
      element,
      focusTrapQuery: '[dk-nav]',
    })
    this.menu = element.querySelector(`#${element.getAttribute('dk-nav')}`)
    this._id = this.element.getAttribute('dk-nav') || this.element.id

    this._scrollableTarget = this.element.querySelector('[dk-nav-scrollable-target]')

    this.dkDialog.on('create', this.toggleCreation)
    this.dkDialog.on('create', this.menuCreation)
    this.dkDialog.on('create', this.handleClosers)

    this.dkDialog.on('show', this.handleShow)

    this.dkDialog.on('hide', this.handleHide)

    this.dkDialog.create()
  }

  toggleCreation = (_event: Event) => {
    convertTag(this.element.querySelector('[dk-nav-toggle]'), 'button')
    this.navToggle?.setAttribute('type', 'button')
    this.navToggle?.addEventListener('click', this.toggle)
  }

  toggle = (event: Event) => {
    if (this.shown) {
      this.hide(event)
    } else {
      this.show(event)
    }
  }

  menuCreation = (_event: Event) => {
    if (this.mobile) {
      this.menu?.setAttribute('aria-hidden', 'true')
    }

    let timeoutFunctionId
    window.addEventListener('resize', (event) => {
      clearTimeout(timeoutFunctionId)
      timeoutFunctionId = setTimeout(() => {
        // if not mobile and shown, hide, then remove aria hidden
        if (!this.mobile && this.shown) {
          this.hide(event)
          this.menu?.removeAttribute('aria-hidden')
        }
        // if not mobile, generally, make sure aria-hidden is gone
        if (!this.mobile) {
          this.menu?.removeAttribute('aria-hidden')
        }
        // if mobile and not shown, make sure aria-hidden is true
        if (this.mobile && !this.shown) this.menu?.setAttribute('aria-hidden', 'true')
      }, 350)
    })
  }

  handleClosers = () => {
    Array.from(document.querySelectorAll('[dk-nav-hide]'))
      .concat(Array.from(document.querySelectorAll(`[dk-nav-hide="${this._id}"]`)))
      .forEach((closer) => {
        closer.setAttribute('aria-label', 'Close menu')
        closer.addEventListener('click', this.dkDialog.hide)
      })
  }

  handleShow = (_event: Event) => {
    this.element.classList.add('open')
    this.menu?.removeAttribute('aria-hidden')
    this.navToggle?.setAttribute('aria-expanded', 'true')
    this.navToggle?.setAttribute('aria-label', 'Close menu')
    // document.body.setAttribute('style', 'overflow: hidden;')
    //disableBodyScroll(this.element)
    this._scrollableTarget ? disableBodyScroll(this._scrollableTarget) : disableBodyScroll(this.element)  // allow for different body-scroll-lock targetElement
    document.addEventListener('click', this.closeOnOutsideClick, true)

    // Find all potential anchor links in the nav links list
    const anchors = Array.from(this.menu?.querySelectorAll('[href^="#"]:not([href="#"]):not([href*="' + location.hostname + '"])')).concat(Array.from(this.menu?.querySelectorAll('[href^="/#"]')))
    // Find all the elements on the page with an id
    const elementsWithIds = Array.from(document.querySelectorAll('*[id]'))
    // Build array containing those ids with a # in front of each
    const ids = []
    elementsWithIds.forEach( (elementWithId) => {
      ids.push(`#${elementWithId.id}`)
    })
    // For any anchor links in nav that exist on this page, close nav on click
    anchors.forEach( (anchor) => {
      if(ids.includes(anchor.hash)) {
        anchor.addEventListener('click', this.hide.bind(this))
      }
    })
  }

  handleHide = (_event: Event) => {
    this.element.classList.remove('open')
    this.menu?.setAttribute('aria-hidden', 'true')
    this.navToggle?.setAttribute('aria-expanded', 'false')
    this.navToggle?.setAttribute('aria-label', 'Open menu')
    // document.body.removeAttribute('style')
    //enableBodyScroll(this.element)
    this._scrollableTarget ? enableBodyScroll(this._scrollableTarget) : enableBodyScroll(this.element) // allow for different body-scroll-lock targetElement
    document.removeEventListener('click', this.closeOnOutsideClick, true)
  }

  show(event: Event) {
    this.dkDialog.show(event)
  }

  hide(event: Event) {
    this.dkDialog.hide(event)
  }

  closeOnOutsideClick = (event: MouseEvent) => {
    let isClickInside = event.target instanceof HTMLElement ? this.dkDialog.$el.contains(event.target) : null
    if (!isClickInside) {
      this.dkDialog.hide(event)
    }
  }

  get mobile() {
    if (this.element.hasAttribute('dk-nav-mobile-always')) return true
    return !this.mediaQuery?.matches
  }

  get mediaQuery(): MediaQueryList | null {
    if (this._mediaQuery) return this._mediaQuery

    let navBreakpoint = this.element.getAttribute('dk-nav-breakpoint')
    if (navBreakpoint === null) navBreakpoint = '991'
    const navBreakpointForMediaQuery = parseInt(navBreakpoint) + 1

    this._mediaQuery = window.matchMedia(`(min-width: ${navBreakpointForMediaQuery}px)`)
    return this._mediaQuery
  }

  get shown() {
    return this.dkDialog.shown
  }

  get menu(): HTMLElement | null {
    return this._menu
  }

  set menu(menu) {
    this._menu = menu
  }

  get navToggle(): HTMLElement | null {
    if (this._navToggle) return this._navToggle
    this._navToggle = this.element.querySelector('[dk-nav-toggle]')
    return this._navToggle
  }

  get scrollableTarget(): HTMLElement | null {
    if (this._scrollableTarget) return this._scrollableTarget
    this._scrollableTarget = this.element.querySelector('[dk-nav-scrollable-target]')
    return this._scrollableTarget
  }
}

function Nav() {
  Array.from(document.querySelectorAll('[dk-nav]')).forEach( (element) => {
    new DKNav(element as HTMLElement)
  })
}

export default Nav
