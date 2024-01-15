<script lang="ts">
  import { StringInput, PasswordInput } from '$lib/comp';
  import type { AuthLayoutData } from '../+layout.server';
  import type { AuthActionReturn } from '../+page.server';
  import AuthForm from '../AuthForm.svelte';

  export let data: AuthLayoutData;
  export let form: AuthActionReturn;

  const title = '设置密码';
  const description = '欢迎回来！请设置密码以便登录。';

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
      <p class="text-xl font-serif font-bold leading-normal text-love">需要邀请设置密码</p>
      <p class="text-subtle">请通过分享的链接重新进入网站。</p>
    </div>
  </div>
{/if}
