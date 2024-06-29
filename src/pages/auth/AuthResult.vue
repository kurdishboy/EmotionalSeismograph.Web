<template>
  <q-page class="row items-center justify-evenly">
    <div class="text-h6">
      {{ $t('general.ui.successfullyLoggedIn') }}
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useSecurityStore } from 'src/stores/security-store';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const securityStore = useSecurityStore();

onMounted(() => {
  const tokens = JSON.parse(route.query.tokens?.toString() ?? '');
  securityStore.updateSigninInformation(tokens);
  setTimeout(() => {
    router.push({ name: 'index' });
  }, 2000);
});
</script>
