<script>
  import { onMount } from 'svelte';
  import Switch from './Switch.svelte';

  let cookies = {};
  let isDebugMode = false;

  const sendToContents = (message, callback) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab.status === 'complete') {
        chrome.tabs.sendMessage(activeTab.id, { message }, callback);
      } else {
        setTimeout(() => {
          // ロード中の場合はリトライ
          sendToContents(message, callback);
        }, 100);
      }
    })
  }

  const handleDebugModeToggle = () => {
    sendToContents('toggleDebugMode', (response) => {
      isDebugMode = !!response;
      sendToContents('getCookies', (response) => {
        cookies = response;
        cookies = cookies;
      });
    })
  }

  onMount(() => {
    sendToContents('isDebugMode', (response) => {
      isDebugMode = !!response;
    });
    sendToContents('getCookies', (response) => {
      cookies = response;
    });
  });
</script>

<div class="container mx-auto text-center mx-4 my-4 space-y-2">
  <div class="relative">
    <h2 class="text-xl font-semibold sm:text-2xl sm:leading-7 sm:text-black md:text-3xl">Debug Info</h2>
    <p class="text-sm font-medium sm:mb-1 sm:text-gray-500">All Debug Cookies</p>
    <div class="text-justify py-6 px-6">
      <ul class="list-disc">
        {#each Object.entries(cookies) as [key, value]}
          <li>
            <span>{key}</span>
            <span class="px-4">
              {value}
            </span>
          </li>
        {/each}
      </ul>
    </div>
    <Switch
      bind:checked="{isDebugMode}"
      id="debug"
      text="Debug Mode"
      on:change={handleDebugModeToggle}
    />
  </div>
</div>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
