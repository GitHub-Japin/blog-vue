<template>
  <div>
    <ServerInfo></ServerInfo>
    <div>
      <div id="category-chart" :float="left"></div>
      <div class="echarts-container" ref="chart"></div>
      <div id="user-chart" :float="left"></div>
      <div class="user-echarts-container" ref="userChart"></div>
    </div>
  </div>
</template>

<script>
import ServerInfo from '../../components/server/ServerInfo'
export default {
  name: "EchartsInfo",
  components: {ServerInfo},
  data() {
    return {
      echartsData: [], // 存储后端返回的数据
      echartsUData: [], // 存储后端返回的数据
    };
  },
  mounted() {
    this.getCategoryData()
    this.getData();
    this.getUserData()
    this.getUData()
  },
  methods: {
    async getCategoryData() {
      try {
        const response = await this.$axios.get('/echarts/categoryEcharts')
        const data = response.data.data
        console.log(data)
        // 处理后端返回的数据
        const categoryNames = data.map(item => item.categoryName)
        const counts = data.map(item => item.count)

        // 使用 ECharts 渲染图表
        const chartContainer = document.getElementById('category-chart')
        const chart = this.$echarts.init(chartContainer)

        const option = {
          title: {
            text: '分类统计'
          },
          xAxis: {
            type: 'category',
            data: categoryNames
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '数量',
              type: 'bar',
              data: counts
            }
          ]
        }
        chart.setOption(option)
      } catch (error) {
        console.error(error)
        // this.$message.error('请求出错了：' + error)
      }
    },
    async getData() {
      this.$axios.get("/echarts/categoryEcharts")
        .then(res => {
          this.echartsData = res.data.data;
          this.drawChart();
        })
        .catch(error => {
          // console.log(error);
        });
    },
    drawChart() {
      const chartDom = this.$refs.chart; // 获取chart容器的DOM元素
      const myChart = this.$echarts.init(chartDom); // 初始化echarts实例

      const option = {
        series: [
          {
            name: 'Echarts',
            type: 'pie',
            radius: '55%', // 控制饼图大小
            roseType: 'angle', // 使用南丁格尔玫瑰图模式
            data: this.echartsData.map(item => {
              return {
                value: item.count,
                name: item.categoryName
              };
            }),
          }
        ]
      };
      myChart.setOption(option); // 设置图表配置项并渲染图表
    },

    async getUserData() {
      try {
        const response = await this.$axios.get('/echarts/userEcharts')
        const data = response.data.data
        console.log(data)
        // 处理后端返回的数据
        const userNames = data.map(item => item.userName)
        const counts = data.map(item => item.count)

        // 使用 ECharts 渲染图表
        const chartContainer = document.getElementById('user-chart')
        const chart = this.$echarts.init(chartContainer)

        const option = {
          title: {
            text: '发博数量统计'
          },
          xAxis: {
            type: '',
            data: userNames
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '数量',
              type: 'bar',
              data: counts
            }
          ]
        }
        chart.setOption(option)
      } catch (error) {
        console.error(error)
        // this.$message.error('请求出错了：' + error)
      }
    },
    async getUData() {
      this.$axios.get("/echarts/userEcharts")
        .then(res => {
          this.echartsUData = res.data.data;
          this.drawUChart();
        })
        .catch(error => {
          // console.log(error);
        });
    },
    drawUChart() {
      const chartDom = this.$refs.userChart; // 获取chart容器的DOM元素
      const myChart = this.$echarts.init(chartDom); // 初始化echarts实例

      const option = {
        series: [
          {
            name: 'userCharts',
            type: 'pie',
            radius: '55%', // 控制饼图大小
            roseType: 'angle', // 使用南丁格尔玫瑰图模式
            data: this.echartsUData.map(item => {
              return {
                value: item.count,
                name: item.userName
              };
            }),
          }
        ]
      };
      myChart.setOption(option); // 设置图表配置项并渲染图表
    },
  },
}
</script>

<style>
#category-chart {
  float: left;
  width: 400px;
  height: 400px;
}
#user-chart {
  float: left;
  width: 400px;
  height: 400px;
}
.echarts-container {
  float: right;
  width: 400px;
  height: 400px;
}
.user-echarts-container {
  float: right;
  width: 400px;
  height: 400px;
}
</style>
