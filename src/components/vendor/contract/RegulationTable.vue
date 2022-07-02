<template>
  <v-data-table dense :headers="headersR" hide-default-footer :items="rules" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title><div v-if="check === 1">Nội quy</div></v-toolbar-title>
      </v-toolbar>
    </template>
  </v-data-table>
</template>
<script>
export default {
  name: 'RegulationTable',
  props: ['rules', 'check'],
  data: () => ({
    // data rules
    dialogR: false,
    dialogDeleteR: false,
    headersR: [
      {
        text: 'Số thứ tự',
        align: 'start',
        sortable: false,
        value: 'regulationId',
      },
      { text: 'Nội dung', value: 'regulationName', sortable: false },
    ],
    editedIndexR: -1,
    editedItemR: {
      no: 0,
      ruleName: '',
      note: '',
    },
    defaultItemR: {
      no: 0,
      ruleName: '',
      note: '',
    },
  }),
  computed: {
    items() {
      return this.rules.map((item) => ({ name: item.regulationName, no: item.regulationId }));
    },
  },
};
</script>
