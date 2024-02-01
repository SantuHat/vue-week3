import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

let productModal = null;
let delProductModal = null;

createApp({
  data() {
    return {
      apiUrl: `https://ec-course-api.hexschool.io/v2`,
      apiPath: "santu",
      products: [],
      tempProduct: {
        imageUrl: [
          "https://images.unsplash.com/photo-1706545512961-dde803e08f5e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ],
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
          window.location = "index.html";
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
    postData() {
      axios
        .post(`${this.apiUrl}/api/${this.apiPath}/admin/product`, {
          data: this.tempProduct,
        })
        .then((res) => {
          productModal.hide();
          this.tempProduct = {};
          this.getData();
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
    editData() {
      axios.put(
        `${this.apiUrl}/api/${this.apiPath}/admin/products/${this.tempProduct.id}`
      );
    },
    deleteData() {
      axios
        .delete(
          `${this.apiUrl}/api/${this.apiPath}/admin/products/${this.products.id}`
        )
        .then((res) => {
          alert("刪除成功");
        })
        .catch((error) => {
          alert(error.response);
        });
    },
    openModal(isNew) {
      if (isNew === "new") {
        this.isNew = true;
        productModal.show();
      } else if (isNew === "edit") {
        this.isNew = false;
        productModal.show();
      } else if (isNew === "delete") {
        delProductModal.show();
      }
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

    productModal = new bootstrap.Modal(
      document.getElementById("productModal"),
      {
        keyboard: false,
      }
    );

    delProductModal = new bootstrap.Modal(
      document.getElementById("delProductModal"),
      {
        keyboard: false,
      }
    );
  },
}).mount("#app");
