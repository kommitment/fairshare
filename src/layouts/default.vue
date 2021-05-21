<template lang="pug">
  div
    b-navbar(toggleable="lg" type="dark" variant="info")
      b-navbar-brand FairShare

      b-navbar-toggle(target="nav-collapse")

      b-collapse(id="nav-collapse" is-nav)
        b-navbar-nav
          b-nav-item(to="/" :active="$route.name=='index'") Home
          b-nav-item(to="demo" :active="$route.name=='demo'") Demo

        b-navbar-nav.ml-auto
          b-nav-item(href="https://github.com/kommitment/fairshare") GitHub

    b-container(fluid).mt-4
      b-row
        b-col
          nuxt
</template>
