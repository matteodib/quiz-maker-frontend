<script>
  import {
    Header,
    SideNav,
    SideNavItems,
    SideNavMenu,
    SideNavMenuItem,
    SideNavLink,
    SideNavDivider,
    SkipToContent,
    Content,
  } from "carbon-components-svelte";
    import { IbmWatsonKnowledgeStudio } from "carbon-icons-svelte";
  import Fade from "carbon-icons-svelte/lib/Fade.svelte";

  let isSideNavOpen = false;
</script>

<Header company="Matteo DIB" platformName="QuizMaker" bind:isSideNavOpen>
  <svelte:fragment slot="skip-to-content">
    <SkipToContent />
  </svelte:fragment>
</Header>

<SideNav bind:isOpen={isSideNavOpen} rail={true}>
  <SideNavItems>
    <SideNavLink icon={IbmWatsonKnowledgeStudio} text="Tutti i quiz" href="/home" isSelected />
    <SideNavLink icon={Fade} text="Crea un quiz" href="/" />
    <SideNavLink icon={Fade} text="Link 3" href="/" />
    <SideNavMenu icon={Fade} text="Menu">
      <SideNavMenuItem href="/" text="Link 1" />
      <SideNavMenuItem href="/" text="Link 2" />
      <SideNavMenuItem href="/" text="Link 3" />
    </SideNavMenu>
    <SideNavDivider />
    <SideNavLink icon={Fade} text="Link 4" href="/" />
  </SideNavItems>
</SideNav>

<Content>
  <slot>

  </slot>
</Content>
