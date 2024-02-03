import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      apiUrl: `https://ec-course-api.hexschool.io/v2`,
      apiPath: 'santu',
      products: [],
      tempProduct: {
        imageUrl: [],
      },
      isNew: false,
    };
  },
  methods: {
    // 驗證登入
    checkAdmin() {
      axios
        .post(`${this.apiUrl}/api/user/check`)
        .then(() => {
          this.getData();
        })
        .catch((error) => {
          alert(error.data.message);
          window.location = 'index.html';
        });
    },
    getData() {
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products`) // 有分頁
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    editData() {
      // 新增
      let api = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let method = 'post';

      // 修改
      if (!this.isNew) {
        api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        method = 'put';
      }
      axios[method](api, { data: this.tempProduct })
        .then((res) => {
          this.getData();
          productModal.hide();
          this.tempProduct = {};
          alert(res.data.message);
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    deleteData() {
      axios
        .delete(
          `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
        )
        .then((res) => {
          alert('刪除成功');
          this.getData();
          delProductModal.hide();
        })
        .catch((error) => {
          alert(error.response);
        });
    },
    openModal(isNew, product) {
      if (isNew === 'new') {
        this.isNew = true;
        this.tempProduct = {
          imageUrl: [],
        };
        productModal.show();
      } else if (isNew === 'edit') {
        this.isNew = false;
        this.tempProduct = { ...product };
        productModal.show();
        if(!Array.isArray(this.tempProduct.imageUrl)){
          this.tempProduct.imageUrl = []
        }
      } else if (isNew === 'delete') {
        this.tempProduct = { ...product }
        delProductModal.show();
      }
    },
  },
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(
      // 須與瀏覽器中的key一致
      /(?:(?:^|.*;\s*)week3Token\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin();

    productModal = new bootstrap.Modal(
      document.getElementById('productModal'),
      {
        keyboard: false,
      }
    );

    delProductModal = new bootstrap.Modal(
      document.getElementById('delProductModal'),
      {
        keyboard: false,
      }
    );
  },
}).mount('#app');
