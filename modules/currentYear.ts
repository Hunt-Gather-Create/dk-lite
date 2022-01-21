const CurrentYear = () => {
  Array.from(document.querySelectorAll<HTMLElement>('.year')).forEach((year) => {
    year.innerText = new Date().getFullYear().toString()
  })
}

export default CurrentYear
