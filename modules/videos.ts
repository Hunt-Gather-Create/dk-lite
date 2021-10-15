function getPrefersReducedMotion() {
  const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: no-preference)')
  const prefersReducedMotion = !motionMediaQuery.matches
  return prefersReducedMotion
}

const Videos = () => {
  Array
    .from(document.querySelectorAll('[dk-background-video]'))
    .forEach((videoEl) => {
      const videos = Array.from(videoEl.getElementsByTagName('video'))
      videos.forEach((video) => {
        const playPauseToggle = document.createElement('button')
        playPauseToggle.setAttribute('aria-label', 'Play video')
        playPauseToggle.setAttribute('type', 'button')
        playPauseToggle.setAttribute('style', 'width: 46px; height: 46px;background: #00000040; z-index: 1; display: flex; align-items: center; justify-content: center; position: absolute; left: 0; bottom: 0;')
        playPauseToggle.style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='46' height='46' viewBox='0 0 46 46' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 12H18C17.4477 12 17 12.4477 17 13V33C17 33.5523 17.4477 34 18 34H20C20.5523 34 21 33.5523 21 33V13C21 12.4477 20.5523 12 20 12Z' fill='white'/%3E%3Cpath d='M28 12H26C25.4477 12 25 12.4477 25 13V33C25 33.5523 25.4477 34 26 34H28C28.5523 34 29 33.5523 29 33V13C29 12.4477 28.5523 12 28 12Z' fill='white'/%3E%3C/svg%3E%0A")`
        playPauseToggle.addEventListener('click', function() {
          video.paused ? playVideo() : pauseVideo()
        })
        video.parentElement.appendChild(playPauseToggle)

        video.addEventListener('suspend', function() {
          playVideo()
          pauseVideo()
          video.removeAttribute('controls')
        })


        function playVideo() {
          video.play()
          playPauseToggle.setAttribute('aria-label', 'Pause video')
          playPauseToggle.style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='46' height='46' viewBox='0 0 46 46' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 12H18C17.4477 12 17 12.4477 17 13V33C17 33.5523 17.4477 34 18 34H20C20.5523 34 21 33.5523 21 33V13C21 12.4477 20.5523 12 20 12Z' fill='white'/%3E%3Cpath d='M28 12H26C25.4477 12 25 12.4477 25 13V33C25 33.5523 25.4477 34 26 34H28C28.5523 34 29 33.5523 29 33V13C29 12.4477 28.5523 12 28 12Z' fill='white'/%3E%3C/svg%3E%0A")`
        }

        function pauseVideo() {
          video.pause()
          playPauseToggle.setAttribute('aria-label', 'Play video')
          playPauseToggle.style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='46' height='46' viewBox='0 0 46 46' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30.214 20.9778C31.1509 21.7764 31.1509 23.2236 30.214 24.0222L19.5473 33.1132C18.2489 34.2198 16.25 33.2971 16.25 31.591L16.25 13.409C16.25 11.7029 18.2489 10.7802 19.5473 11.8868L30.214 20.9778Z' fill='white'/%3E%3C/svg%3E%0A")`
        }

        if( getPrefersReducedMotion() ) {
          pauseVideo()
        }
      })
    })
}

export default Videos