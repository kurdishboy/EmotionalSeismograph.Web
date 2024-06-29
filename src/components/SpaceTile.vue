<template>
  <div class="space-tile-container q-pa-sm col-lg-3 col-md-4 col-sm-12 col-12">
    <div class="space-tile row q-pa-md" v-if="model">
      <q-input
        :label="$t('general.name')"
        :filled="props.editable"
        class="col-12"
        v-model="model.name"
        :readonly="!props.editable"
      />
      <q-input
        :label="$t('general.description')"
        :filled="props.editable"
        class="col-12 q-mt-sm"
        v-model="model.description"
        :readonly="!props.editable"
      />

      <div class="q-mt-md">
        <q-btn
          v-if="!model.joined"
          color="positive"
          :label="$t('general.join')"
          @click="joinSpace"
          :loading="joinSpaceLoading"
        />
        <q-btn
          class="q-mx-sm"
          color="primary"
          :label="$t('general.see')"
          @click="
            $router.push({
              name: 'space-index',
              params: { id: model.id },
              query: { spaceName: model.name },
            })
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Notify } from 'quasar';
import { userApis } from 'src/apis/user.apis';
import { t } from 'src/boot/i18n';
import { ExtendedSpace } from 'src/models/space.models';
import { ref } from 'vue';

const model = defineModel<ExtendedSpace>();
const props = defineProps<{ editable?: boolean }>();

const joinSpaceLoading = ref(false);

async function joinSpace() {
  if (model.value) {
    joinSpaceLoading.value = true;
    await userApis
      .joinSpace(model.value.id)
      .then(() => {
        Notify.create({
          type: 'my-notif',
          icon: 'check',
          message: t('modules.spaces.ui.joinedSuccessfuly'),
          color: 'primary',
        });
      })
      .finally(() => (joinSpaceLoading.value = false));
  }
}
</script>

<style lang="scss" scoped>
.space-tile {
  border: 2px solid $primary;
  border-radius: 10px;
}
</style>
