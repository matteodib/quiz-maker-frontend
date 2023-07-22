<script>
    import { page } from "$app/stores";
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
    import { Home, IbmWatsonKnowledgeStudio } from "carbon-icons-svelte";
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
    <SideNavLink icon={Home} text="Home" href="/" isSelected={$page.url.pathname === "/"} />
    <SideNavLink icon={IbmWatsonKnowledgeStudio} text="Quizzes" href="/quizzes" isSelected={$page.url.pathname === "/quizzes"} />
    <SideNavLink icon={Fade} text="Questions" href="/questions" isSelected={$page.url.pathname === "/questions"}/>
    <SideNavLink icon={Fade} text="" href="/" />
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
