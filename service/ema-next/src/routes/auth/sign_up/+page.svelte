<script lang="ts">
  import { StringInput, PasswordInput } from '$lib/comp';
  import AuthForm from '../AuthForm.svelte';

  export let data;
  export let form;

  const title = '注册用户';
  const description =
    '请使用<span class="mx-1">telegram</span>的<span class="mx-1">ID</span>或者用户名作为账户的用户名。';
  $: username = data?.username || form?.username;
  $: focusOnMount = typeof username !== 'undefined';
  $: invited = data.invited;
</script>

{#if invited}
  <AuthForm {title} {description} hasError={typeof form?.errors !== 'undefined'}>
    <StringInput field="username" label="用户名" value={username} error={form?.errors?.username} />
    <PasswordInput {focusOnMount} field="password" label="密码" error={form?.errors?.password} />
    <PasswordInput field="password_ensure" label="确认密码" error={form?.errors?.passwordEnsure} />
  </AuthForm>
{:else}
  <div class="bg-overlay py-8 px-6 -mx-6 mid:mx-0 flex flex-col gap-y-4">
    <div class="flex flex-col gap-y-2">
      <p class="text-xl font-serif font-bold leading-normal text-love">需要通过邀请才能注册</p>
      <p class="text-subtle">请通过分享的链接重新进入网站。</p>
    </div>
  </div>
{/if}
