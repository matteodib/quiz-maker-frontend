<script>
    import { page } from "$app/stores";
  import {
    Header,
    SideNav,
    SideNavItems,
    SideNavLink,
    SkipToContent,
    Content,
  } from "carbon-components-svelte";
    import { Help, Home, IbmWatsonKnowledgeStudio, TagGroup } from "carbon-icons-svelte";
    import Logo from "./Logo.svelte";
    import { base } from "$app/paths";

  let isSideNavOpen = false;
</script>


<Header bind:isSideNavOpen>
  <svelte:fragment slot="company">
      <Logo />
  </svelte:fragment>
  <svelte:fragment slot="skip-to-content">
    <SkipToContent />
  </svelte:fragment>
</Header>

<SideNav bind:isOpen={isSideNavOpen} rail={true}>
  <SideNavItems>
    <SideNavLink icon={Home} text="Home" href={base+"/"} isSelected={$page.url.pathname === "/"} />
    <SideNavLink icon={IbmWatsonKnowledgeStudio} text="Quizzes" href={base+"/quizzes"} isSelected={$page.url.pathname === "/quizzes"} />
    <SideNavLink icon={Help} text="Questions" href={base+"/questions"} isSelected={$page.url.pathname === "/questions"}/>
    <SideNavLink icon={TagGroup} text="Categories" href={base+"/categories"} isSelected={$page.url.pathname === "/categories"}/>
  </SideNavItems>
</SideNav>

<Content>
  <slot>

  </slot>
</Content>

<style>

  :global(.bx--header) {
    background-color: rgb(0 51 102) !important
  }
  :global(.bx--side-nav__navigation) {
    background-color: rgb(0 102 153) !important;
    color: #fff
  }
  :global(a.bx--side-nav__link[aria-current=page], a.bx--side-nav__link--current) {
    background-color: rgba(25, 117, 163, 1) !important;
   
  }
  :global(.bx--side-nav__icon>svg) {
    fill: #fff !important
  }
  :global(a.bx--side-nav__link[aria-current=page]::before, a.bx--side-nav__link--current::before) {
    background-color: #fff !important
  }
  :global(a.bx--side-nav__link>.bx--side-nav__link-text, .bx--side-nav a.bx--header__menu-item .bx--text-truncate-end) {
    color: #fff !important
  }
  :global(.bx--side-nav__item:not(.bx--side-nav__item--active)>.bx--side-nav__link:hover) {
    background-color: rgba(25, 117, 163, 1) !important;
  }
  :global(a.bx--side-nav__link[aria-current=page] .bx--side-nav__link-text, a.bx--side-nav__link--current .bx--side-nav__link-text) {
    font-weight: bold;
  }
</style>