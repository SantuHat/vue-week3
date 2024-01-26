import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

createApp({
  data() {
    return {
      apiUrl: `https://ec-course-api.hexschool.io/v2`,
      apiPath: "santu",
      products: [],
      tempProduct: {},
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
          window.location = "index.html";
        });
    },
    getData() {
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((error) => {
          alert(error.response.data.message);
        });
    },
    editData() {
      axios.put(
        `${this.apiUrl}/api/${this.apiPath}/admin/products/${this.tempProduct.id}`
      );
    },
  },
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(
      // 須與瀏覽器中的key一致
      /(?:(?:^|.*;\s*)week3Token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin();
  },
}).mount("#app");
