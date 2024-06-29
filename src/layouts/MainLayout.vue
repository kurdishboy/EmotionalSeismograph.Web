<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar clas>
        <q-toolbar-title>{{ $t('app.title') }}</q-toolbar-title>
        <div v-if="securityStore.isLoggedIn">
          <q-btn
            flat
            round
            dense
            icon="mdi-logout"
            @click="securityStore.signout()"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div
        v-if="securityStore.isLoggedIn"
        class="q-pt-md q-px-md emotion-container"
      >
        <q-card bordered class="full-width emotion-card row justify-center">
          <div class="q-mt-md text-h6 text-bold">
            {{ $t('general.ui.yourStatus') }}
          </div>
          <div class="col-12 row justify-center">
            <div class="col-12 row justify-center q-pt-none">
              <q-icon size="xl" v-if="!selectedEmoji" name="mdi-help" />
              <div v-else style="font-size: 60px">
                {{ selectedEmoji.native }}
              </div>
            </div>
            <div class="col-12 row justify-center q-pt-none">
              <q-btn
                :label="$t('general.ui.selectEmoji')"
                size="md"
                color="primary"
                class="emotion-pickker-toggler"
                @click="showEmojiPicker = true"
              />
            </div>
          </div>
          <div class="col-md-3 col-sm-12 col-12 q-py-md">
            <q-input
              v-model="statusText"
              filled
              type="textarea"
              rows="3"
              :label="$t('general.ui.enterYourFeelingsHere')"
            >
              <template #append>
                <q-btn
                  round
                  dense
                  flat
                  icon="mdi-check"
                  @click="setStatus"
                  :loading="newEmotionLodaing"
                />
              </template>
            </q-input>
          </div>

          <Picker
            v-show="showEmojiPicker"
            class="q-mt-md emoji-picker"
            :data="emojiIndex"
            @select="convertEmoji"
          />
        </q-card>
      </div>

      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useSecurityStore } from 'src/stores/security-store';
import { onMounted, ref } from 'vue';
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src';
import data from 'emoji-mart-vue-fast/data/all.json';
import 'emoji-mart-vue-fast/css/emoji-mart.css';
import { userApis } from 'src/apis/user.apis';
import { Notify } from 'quasar';
import { t } from 'src/boot/i18n';

const securityStore = useSecurityStore();
const statusText = ref('');
const selectedEmoji = ref();
let emojiIndex = new EmojiIndex(data);
const showEmojiPicker = ref(false);
const newEmotionLodaing = ref(false);

onMounted(async () => {
  if (securityStore.isLoggedIn) {
    securityStore.updateAuthenticatedUser();

    selectedEmoji.value =
      securityStore.authenticatedUser?.latestEmotion?.emotion ?? undefined;
    statusText.value =
      securityStore.authenticatedUser?.latestEmotion?.status ?? '';
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function convertEmoji(emoji: any) {
  showEmojiPicker.value = false;
  selectedEmoji.value = emoji;
  await submitStatus();
}

async function setStatus() {
  await submitStatus();
}

async function submitStatus() {
  newEmotionLodaing.value = true;
  if (selectedEmoji.value) {
    await userApis
      .createEmotion({
        emotion: JSON.stringify(selectedEmoji.value),
        id: 0,
        regdate: '',
        status: statusText.value ?? '',
        userId: 0,
      })
      .then(() => {
        Notify.create({
          type: 'my-notif',
          icon: 'check',
          message: t('general.ui.emotionSavedSuccessfuly'),
          color: 'primary',
        });
      })
      .finally(() => (newEmotionLodaing.value = false));
  }
}
</script>

<style lang="scss" scoped>
.emotion-container {
  position: relative;

  .emotion-pickker-toggler {
    height: 30px;
  }

  .emotion-card {
    z-index: 99000;
    position: relative;
  }

  .emoji-picker {
    position: absolute;
    top: 75px;
  }
}
</style>
