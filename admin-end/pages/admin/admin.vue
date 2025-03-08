<template>
  <view class="container">
    <!-- 管理功能选项栏 -->
    <view class="sidebar">
      <scroll-view scroll-y="true" style="height: 100vh;">
        <uni-collapse accordion>
          <uni-collapse-item v-for="(item, index) in functionList" :key="index" :title="item.name" class="collapse-item">
            <view
              v-for="(subItem, subIndex) in item.page"
              :key="subIndex"
              @click="menu_change(subItem)"
              :class="['content', menu_id === subItem.id ? 'choose_detail' : 'detail']"
            >
              {{ subItem.name }}
            </view>
          </uni-collapse-item>
        </uni-collapse>
      </scroll-view>
    </view>
    <!-- 管理功能选项栏end -->

    <!-- 管理具体界面 -->
    <scroll-view class="main-content" scroll-y="true">
      <component :is="currentComponent" :initialData="userData" />
    </scroll-view>
    <!-- 管理具体界面end -->
  </view>
</template>
<script>
import personAdmin from '@/components/person_admin/person_admin.vue'
import bookAdmin from '@/components/bookAdmin/bookAdmin.vue'
import BookUpload from '@/components/BookUpload/BookUpload.vue'
import advertisementAdmin from '@/components/advertisement-admin/advertisement-admin.vue'
import dashboard from '@/components/dashboard/dashboard.vue'

export default {
  components: {
    personAdmin,
    bookAdmin,
    BookUpload,
    advertisementAdmin,
    dashboard,
  },
  data() {
    return {
      menu_id: 0,
      name: '人员管理',
      functionList: [
        {
          name: '人员管理',
          page: [{ name: '用户管理', id: 0 }],
        },
        {
          name: '书籍管理',
          page: [
            { name: '书籍列表', id: 1 },
            { name: '上传书籍', id: 2 },
          ],
        },
        {
          name: '广告管理',
          page: [{ name: '广告设置', id: 3 }],
        },
        {
          name: '大屏看板',
          page: [{ name: '数据分析', id: 4 }],
        },
      ],
      userData: [],
      currentComponent: 'personAdmin', // 默认组件
    };
  },
  onLoad() {
    this.loadUserList();
  },
  methods: {
    async loadUserList() {
      try {
        const response = await this.$store.dispatch('fetchData', {
          url: this.$store.state.BaseUrl + '/admin/users',
          method: 'GET',
        });
        this.userData = response.users;
      } catch (error) {
        console.error('Error fetching data:', error);
        uni.showToast({ title: '加载失败，请重试', icon: 'none' });
      }
    },
    menu_change(item) {
      this.menu_id = item.id;
      this.name = item.name;

      const componentMap = {
        0: 'personAdmin',
        1: 'bookAdmin',
        2: 'BookUpload',
        3: 'advertisementAdmin',
        4: 'dashboard',
      };

      this.currentComponent = componentMap[item.id] || 'personAdmin';
    },
  },
};
</script>
<style lang="scss">
$primary-color: #1890ff;
$hover-color: #46a6ff;
$sidebar-bg: black;
$main-bg: #f6f8f9;

.container {
  display: flex;
}

.sidebar {
  display: flex;
  flex-direction: column;
  background-color: $sidebar-bg;
  .collapse-item {
    color: white;
    background: $sidebar-bg;
    text-align: center;

    .content {
      cursor: pointer;
      border-bottom: 1px solid white;
      font-size: 14px;
      padding: 10px;

      &.choose_detail {
        background-color: $primary-color;
      }

      &:hover {
        background-color: $hover-color;
      }
    }
  }
}

.main-content {
  background-color: $main-bg;
  flex: 1;
  height: 100vh;
}
</style>