 const app = Vue.createApp({
     data() {
         return {
             items: [],
             product_type: [],
             category: [],
             selected_brand: null,
             selected_product_type: null,
             brands: [],
             url: "https://makeup-api.herokuapp.com/api/v1/products.json",
             selected_item: '',
             results: '',
             APIresults: [],
             filters: {},
             define_filters: {
                 'category': [],
                 'product_type': [],
                 'brand': []
             }
         }
     },
     methods: {
         //reads through filters object and sends to update_results()
         update_results() {
             this.selected_item = '';
             var obj = this.filters;
             Object.getOwnPropertyNames(obj).forEach(key => {
                 this.results = this.results.filter(e => e[key] === obj[key]);
             });
         },

         //updates the filters when a change in selection is detected.  Then updates search results.
         update_filters(event) {
             if (event.target.value !== '') {
                 this.filters[event.target.id] = event.target.value;
             } else {
                 delete this.filters[event.target.id];
             }
             this.results = this.APIresults;
             this.update_results();
         },
         //displays selected product on hover over product list
         selected_product(rindex) {
             this.selected_item = this.results[rindex];
         },
         populate_dropdowns(results) {
             var results = results;
             this.define_filters.forEach(function (dval, dindex) {
                 // var define_value = dval;
                 results.forEach(function (index) {
                     if (dval[dindex].includes(results[index][dval]) === false) {
                         dval[dindex].push(results[index][dval]);
                     }
                     console.log(dval[index]);
                 })
                 this.define_filters[dindex] = dval;

             })
         }
     },
     computed: {},
     mounted() {
         //   load all data from API into APIresults.  This is the only call to retrieve data
         var APIresults = null;
         //uncomment below to use local saved API results if remote is down.
         //this.url = 'products.json'
         axios.get(this.url).then(response => {
             APIresults = response.data;
             var brands = this.brands;
             var product_type = this.product_type;
             var category = this.category;
             //  parse through APIresults to extract all brands and product_type
             APIresults.forEach(function (val, index) {
                 //load brands into array
                 if (brands.includes(APIresults[index].brand) === false) {
                     brands.push(APIresults[index].brand);
                 }
                 //load product type into array
                 if (product_type.includes(APIresults[index].product_type) === false) {
                     product_type.push(APIresults[index].product_type);
                 }
                 //load categories into array
                 if (category.includes(APIresults[index].category) === false && APIresults[index].category !== '') {
                     category.push(APIresults[index].category);
                 }
             })
             //  sort each array alphabetically
             //  for use in select statements
             this.brands = brands.sort();
             this.product_type = product_type.sort();
             this.category = category.sort();
             this.results = APIresults; //displays all products
             this.APIresults = APIresults;
             //  this.populate_dropdowns(this.results);
         })
     }
 })
