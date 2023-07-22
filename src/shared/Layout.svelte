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
    <SideNavLink icon={Help} text="Questions" href="/questions" isSelected={$page.url.pathname === "/questions"}/>
    <SideNavLink icon={TagGroup} text="Categories" href="/categories" isSelected={$page.url.pathname === "/categories"}/>
  </SideNavItems>
</SideNav>

<Content>
  <slot>

  </slot>
</Content>
