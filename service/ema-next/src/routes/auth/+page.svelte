<script lang="ts">
  import { StringInput } from '$lib/comp';
  import AuthForm from './AuthForm.svelte';

  export let form;
  $: hasError = typeof form?.errors !== 'undefined';
</script>

<AuthForm {hasError}>
  <slot name="title">确认用户名</slot>
  <slot name="description"
    >请使用<span class="mx-1">telegram</span>的<span class="mx-1">ID</span
    >或者用户名作为账户的用户名。往年参与过投票的朋友，可以输入用户名新设置密码,此前的数据将自动绑定至此账户。</slot
  >
  <StringInput field="username" label="用户名" value={form?.username} error={form?.errors?.username} />
</AuthForm>
