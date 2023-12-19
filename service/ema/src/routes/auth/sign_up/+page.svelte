<script lang="ts">
  import { StringInput, PasswordInput } from '$lib/comp';
  import type { AuthLayoutData } from '../+layout.server';
  import type { AuthActionReturn } from '../+page.server';
  import AuthForm from '../AuthForm.svelte';

  export let data: AuthLayoutData;
  export let form: AuthActionReturn;

  const title = '注册用户';
  const description = '请使用telegram的ID或者用户名作为账户的用户名';
  $: username = data?.username || form?.username;
  $: focusOnMount = typeof username !== 'undefined';
</script>

<AuthForm {title} {description} hasError={typeof form?.errors !== 'undefined'}>
  <StringInput field="username" label="用户名" value={username} error={form?.errors?.username} />
  <PasswordInput {focusOnMount} field="password" label="密码" error={form?.errors?.password} />
  <PasswordInput field="password_ensure" label="确认密码" error={form?.errors?.passwordEnsure} />
</AuthForm>
