<template>
  <v-row class="mx-0">
    <v-col cols="8" class="pt-3 pr-md-5">
      <v-row class="mx-0">
        <v-col cols="6" class="pa-0 d-flex flex-column justify-start">
          <v-text-field
            label="Tìm nhanh theo tên nội quy"
            v-model="searchRegulationQuery"
            solo
            hide-details
            class="text-muted size-sub-2 light-text-field font-nunito"
            clearable
            rounded
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="pa-0 d-flex flex-column pl-10">
          <div class="d-flex">
            <v-text-field
              label="Nội quy khác"
              v-model="newRule"
              solo
              hide-details
              class="text-muted size-sub-2 light-text-field font-nunito"
              style="border-top-right-radius: 0px; border-bottom-right-radius: 0px"
            ></v-text-field>
            <v-btn
              class="btn-success btn-sm font-nunito white--text"
              @click="addNewRules()"
              style="
                border-top-left-radius: 0px !important;
                border-bottom-left-radius: 0px !important;
              "
              >Bổ sung</v-btn
            >
          </div>
          <span class="size-caption red--text font-nunito" v-show="isDuplicate"
            >Nội quy đã tồn tại</span
          >
        </v-col>
        <v-col cols="12" class="pa-0 d-flex flex-column justify-start">
          <v-card class="overflow-y-auto mt-4 px-4" max-height="260" min-height="260" outlined>
            <v-row class="ma-0">
              <v-col
                cols="4"
                v-for="item in newSystemRegulation"
                :key="item"
                class="pa-0 pl-1 ma-0 d-flex align-center"
              >
                <v-checkbox
                  v-model="newRulesSelectes"
                  :label="item"
                  :value="item"
                  class="filter font-nunito py-3 checkbox-small ma-0"
                  color="#727cf5"
                  hide-details
                  @click="selectCheckBox()"
                ></v-checkbox>
              </v-col>
              <v-col
                cols="4"
                v-for="item in systemRegulation"
                :key="item.regulationId"
                class="pa-0 pl-1 ma-0 d-flex align-center"
              >
                <v-checkbox
                  v-model="selected"
                  :label="item.regulationName"
                  :value="item.regulationId"
                  class="filter font-nunito py-3 checkbox-small ma-0"
                  color="#727cf5"
                  hide-details
                  @click="selectCheckBox()"
                ></v-checkbox>
              </v-col>

              <span
                v-if="allRules.length === 0 && newRulesDisplay.length === 0"
                class="d-flex flex-column align-center ma-auto font-nunito text-primary mt-10"
              >
                <span>Nếu phòng trọ của bạn có nội quy không có sẵn trong danh sách gợi ý.</span>
                <span
                  >Hãy điền nội quy khác và ấn nút
                  <span style="color: #0acf97 !important">"Bổ sung"</span> để thêm nội quy
                  mới.</span
                >
              </span>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="4" class="pt-3">
      <v-card class="overflow-y-auto px-4" max-height="315" min-height="315" outlined>
        <v-row class="ma-0">
          <v-col cols="12" class="d-flex justify-center align-center">
            <span class="font-nunito text-primary size-1rem">Nội quy khu trọ của bạn</span>
          </v-col>
          <v-row class="ma-0">
            <v-col
              cols="12"
              v-for="item in newSelectedRegulation"
              :key="item"
              class="pa-0 pl-1 ma-0 d-flex align-center"
            >
              <v-checkbox
                v-model="newRulesSelectes"
                :label="item"
                :value="item"
                class="filter font-nunito py-3 checkbox-small ma-0"
                color="#727cf5"
                hide-details
                @click="selectCheckBox()"
              ></v-checkbox>
            </v-col>
            <v-col
              cols="12"
              v-for="item in selectedRegulation"
              :key="item.regulationId"
              class="pa-0 pl-1 ma-0 d-flex align-center"
            >
              <v-checkbox
                v-model="selected"
                :label="item.regulationName"
                :value="item.regulationId"
                class="filter font-nunito py-3 checkbox-small ma-0"
                color="#727cf5"
                hide-details
                @click="selectCheckBox()"
              ></v-checkbox>
            </v-col>
            <span
              v-if="selectedRegulation.length === 0 && newSelectedRegulation.length === 0"
              class="d-flex flex-column align-center ma-auto font-nunito text-primary mt-16 size-sub-3"
            >
              <span
                style="
                  color: #0acf97 !important;
                  box-shadow: 0 2px 6px 0 rgba(10, 207, 151, 0.5) !important;
                "
                class="pa-2"
                >Bạn chưa chọn nội quy nào!</span
              >
            </span>
          </v-row>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'RegulationManagement',
  data: () => ({
    selected: [],
    recommendList: [],
    values: '',
    searchRegulationQuery: '',
    newRule: '',
    newRules: [],
    newRulesSelectes: [],
  }),
  components: {},
  computed: {
    allRules() {
      let regulations = this.$store.state.renter.common.rules.data;
      regulations.sort();
      if (this.searchRegulationQuery && this.searchRegulationQuery.trim() !== '') {
        regulations = regulations.filter((item2) => {
          const res =
            item2.regulationName
              .toLowerCase()
              .indexOf(this.searchRegulationQuery.trim().toLowerCase()) !== -1;
          return res;
        });
      }
      return [...regulations];
    },
    systemRegulation() {
      return this.allRules.filter((item) => !this.selected.includes(item.regulationId));
    },
    selectedRegulation() {
      return this.allRules.filter((item) => this.selected.includes(item.regulationId));
    },
    newRulesDisplay() {
      let regulations = this.newRules;
      if (this.searchRegulationQuery && this.searchRegulationQuery.trim() !== '') {
        regulations = regulations.filter((item2) => {
          const res =
            item2.toLowerCase().indexOf(this.searchRegulationQuery.trim().toLowerCase()) !== -1;
          return res;
        });
      }
      return [...regulations];
    },
    newSystemRegulation() {
      return this.newRulesDisplay.filter((item) => !this.newRulesSelectes.includes(item));
    },
    newSelectedRegulation() {
      return this.newRulesDisplay.filter(
        (item) => this.newRulesSelectes.includes(item), // eslint-disable-line
      ); // eslint-disable-line
    },
    newGroup() {
      return this.$store.state.vendor.group.newGroup;
    },
    isDuplicate() {
      let dupplicateExistRules = false;
      let dupplicateNewRules = false;
      if (this.allRules.length > 0) {
        dupplicateExistRules =
          this.allRules.filter(
            (rule) =>
              rule.regulationName.trim().toLowerCase() === this.newRule.trim().toLowerCase(), // eslint-disable-line
          ).length > 0;
      }
      if (this.newRules.length > 0) {
        dupplicateNewRules =
          this.newRules.filter(
            (rule) => rule.trim().toLowerCase() === this.newRule.trim().toLowerCase(),
          ).length > 0;
      }
      return dupplicateExistRules || dupplicateNewRules;
    },
  },
  methods: {
    ...mapActions({
      getAllRules: 'renter/common/getAllRules',
      setNewGroupValue: 'vendor/group/setNewGroupValue',
    }),
    selectCheckBox() {
      this.newGroup.regulation = this.selected;
      this.newGroup.newRegulations = this.newRulesSelectes;
      this.setNewGroupValue(this.newGroup);
    },
    addNewRules() {
      if (this.newRules && !this.isDuplicate) {
        this.newRules.unshift(this.newRule);
        this.newRulesSelectes.push(this.newRule);
        this.newRule = '';
      }
    },
  },
  created() {
    this.selected = this.newGroup.regulation;
  },
};
</script>

<style>
.dropzone {
  border: 2px dashed #dee2e6;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  min-height: 150px;
  padding: 20px;
}
.checkbox-small .theme--light.v-label {
  color: #6c757d !important;
  font-size: 0.875rem !important;
  font-family: 'Nunito', sans-serif !important;
}
</style>
