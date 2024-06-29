<template>
  <q-page v-if="securityStore.isLoggedIn" class="row q-pa-md">
    <q-card bordered class="full-width">
      <q-card-section class="row justify-between">
        <div class="text-h6 text-bold text-primary">
          {{ $t('general.ui.yourSpaces') }}
        </div>
        <q-btn
          color="primary"
          :label="$t('general.create')"
          @click="newSpaceDialog = true"
        />
      </q-card-section>
      <q-separator inset />
      <q-card-section class="q-pt-md row" v-if="allSpaces">
        <space-tile
          v-for="(item, index) in userSpaces"
          :key="`user_space_${index}`"
          v-model:model-value="userSpaces[index]"
          editable
        />
      </q-card-section>
    </q-card>
    <q-card bordered class="full-width q-mt-md">
      <q-card-section>
        <div class="text-h6 text-bold text-primary">
          {{ $t('general.ui.spacesList') }}
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section class="q-pt-md row" v-if="allSpaces">
        <space-tile
          v-for="(item, index) in allSpaces"
          :key="`user_space_${index}`"
          v-model:model-value="allSpaces[index]"
        />
      </q-card-section>
    </q-card>
  </q-page>
  <div class="q-pt-xl row justify-center items-center" v-else>
    <q-btn
      color="primary"
      size="lg"
      :icon-right="'mdi-google'"
      :label="$t('modules.auth.ui.signinWithGoogle')"
      @click="redirectToGoogleAuth"
    />
  </div>
  <q-dialog v-model="newSpaceDialog">
    <q-card style="width: 300px">
      <q-form>
        <q-card-section>
          <div class="text-h6">
            {{ $t('actions.newX', { x: $t('modules.spaces.title') }) }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            :rules="[requiredValidator]"
            :label="$t('general.name')"
            filled
            v-model="newSpaceName"
          />
          <q-input
            :label="$t('general.description')"
            filled
            class="q-mt-sm"
            v-model="newSpaceDescription"
          />
        </q-card-section>

        <q-card-actions class="q-pa-md">
          <q-btn
            color="primary"
            :label="$t('general.add')"
            @click="createSpace"
            :loading="createLoading"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { userApis } from 'src/apis/user.apis';
import { t } from 'src/boot/i18n';
import SpaceTile from 'src/components/SpaceTile.vue';
import { ExtendedSpace } from 'src/models/space.models';
import { requiredValidator } from 'src/services/validation.services';
import { useAppSettingsStore } from 'src/stores/app-settings-store';
import { useSecurityStore } from 'src/stores/security-store';
import { computed, onMounted, ref } from 'vue';

const securityStore = useSecurityStore();
const newSpaceDialog = ref(false);
const allSpaces = ref<ExtendedSpace[]>([]);
const newSpaceName = ref<string>('');
const newSpaceDescription = ref<string>();
const createLoading = ref(false);

const userSpaces = computed(() => {
  return allSpaces.value.filter(
    (x) => x.ownerUserId == securityStore.authenticatedUser?.id
  );
});

onMounted(async () => {
  allSpaces.value = await userApis.getAllSpaces();
});

function redirectToGoogleAuth() {
  const appSettingStore = useAppSettingsStore();
  window.location.href = `${appSettingStore.appSettings.backendUrl}/auth/login?returnUrl=${window.location.origin}/auth/result`;
}

async function createSpace() {
  createLoading.value = true;
  await userApis
    .createSpace({
      id: 0,
      ownerUserId: 0,
      name: newSpaceName.value,
      description: newSpaceDescription.value ?? '',
    })
    .then(async () => {
      Notify.create({
        type: 'my-notif',
        icon: 'check',
        message: t('actions.XAddedSuccessfully', {
          x: t('modules.spaces.title'),
        }),
        color: 'primary',
      });
      newSpaceDialog.value = false;
      allSpaces.value = await userApis.getAllSpaces();
    })
    .finally(() => (createLoading.value = false));
}
</script>
