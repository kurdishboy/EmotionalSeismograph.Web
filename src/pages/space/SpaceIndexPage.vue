<template>
  <div class="q-mt-lg">
    <div class="text-center text-h6 text-bold">
      {{ $route.query.spaceName }}
    </div>
    <div class="row q-pa-md" v-if="latestUsersEmotions.length > 0">
      <div
        v-for="(item, index) in latestUsersEmotions"
        :key="`space_user_${index}`"
        class="col-lg-3 col-md-4 col-sm-12 col-12 q-pa-sm"
      >
        <div class="space-user q-pa-md">
          <div class="text-center">
            {{ convertUtcToJalali(item.emotions[0].regdate) }}
          </div>
          <div class="row justify-between items-center">
            <div>
              <q-img
                :src="item.userPic"
                height="40px"
                width="40px"
                img-class="user-space-image"
              />
              <span class="text-bold q-ml-md">{{ item.userName }}</span>
            </div>
            <div class="text-h2 q-ma-none q-pa-none">
              {{ getEmotionObject(item.emotions[0].emotion) }}
            </div>
          </div>
          <div v-if="item.emotions[0].status" class="q-pa-sm">
            {{ item.emotions[0].status }}
          </div>
          <q-separator />
          <q-btn
            flat
            :label="
              item.showHistory
                ? $t('general.ui.notShowHistory')
                : $t('general.ui.showHistory')
            "
            class="full-width q-my-sm"
            size="sm"
            @click="item.showHistory = !item.showHistory"
          />
          <div v-if="item.showHistory">
            <q-scroll-area style="height: 200px; max-width: 100%">
              <div
                v-for="(emotion, ind) in item.emotions"
                :key="`history_${index}_${ind}`"
                class="row emotion-history q-pa-xs items-center"
              >
                <div class="col-1 text-h6">
                  {{ getEmotionObject(emotion.emotion) }}
                </div>
                <div class="col-11 text-left q-px-sm">{{ emotion.status }}</div>
                <div class="text-center col-12 text-caption">
                  {{ convertUtcToJalali(emotion.regdate) }}
                </div>
              </div>
            </q-scroll-area>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userApis } from 'src/apis/user.apis';
import { ExtendedSpaceEmotion } from 'src/models/emotion.models';
import { convertUtcToJalali } from 'src/services/dateTime.services';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const latestUsersEmotions = ref<ExtendedSpaceEmotion[]>([]);

onMounted(async () => {
  latestUsersEmotions.value = await userApis.getSpaceUsersTopTenEmotions(
    Number(route.params.id.toString())
  );
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getEmotionObject(json: any) {
  return json.native;
}
</script>

<style lang="scss" scoped>
.space-user {
  border: 1px $primary dashed;
  border-radius: 10px;
}

.emotion-history {
  border-bottom: 1px #dfdfdf dashed;
}
</style>
