<template>
  <v-card height="500px">
    <div style="font-size: 20px; fontweight: bold" class="pt-3 pl-2 pb-6">
      Thống kê: lượt xem phòng
    </div>
    <div id="chart" class="d-flex justify-center pt-10" style="max-height: 500px">
      <apexcharts type="donut" width="520" :options="chartOptions" :series="series"></apexcharts>
    </div>
    <v-card-text style="color: #818286" class="d-flex justify-end">Xem thêm >></v-card-text>
  </v-card>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';

export default {
  name: 'ChartOverview',
  components: {
    apexcharts: VueApexCharts,
  },
  data() {
    return {
      series: [41, 17, 15],
      chartOptions: {
        chart: {
          width: 300,
          type: 'donut',
        },
        dataLabels: {
          enabled: true,
        },
        labels: ['Chỉ xem phòng', 'Đặt lịch xem phòng', 'Hủy lịch xem phòng'],
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                },
                value: {
                  show: true,
                },
                total: {
                  show: true,
                  label: 'Lượt xem',
                  color: 'Black',
                },
              },
            },
          },
        },
        fill: {
          type: 'gradient',
        },
        legend: {
          formatter(val) {
            return `${val}`;
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      },
    };
  },
};
</script>
