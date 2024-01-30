new Vue({
  el: '#app',
  data: {
    items: [],
    newItemName: ''
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fetch('http://localhost:3000/items')
        .then(response => response.json())
        .then(data => {
          this.items = data;
        })
        .catch(error => console.error('Veri çekme hatası:', error));
    },
    handleDragStart(index) {
      event.dataTransfer.setData('text/plain', index);
    },
    handleDragOver(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    },
    handleDrop(yeniKonum) {
      const draggedIndex = event.dataTransfer.getData('text/plain');
      const temp = this.items[yeniKonum];
      this.$set(this.items, yeniKonum, this.items[draggedIndex]);
      this.$set(this.items, draggedIndex, temp);
    },
    
    orderUpdate() {
    
      const updatedItems = this.items.map((item, index) => ({ ...item, order: index + 1 }));

      fetch('http://localhost:3000/items/updateOrder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: updatedItems })
      })
        .then(response => response.json())
        .then(data => {
          console.log(data.message);
        })
        .catch(error => console.error(':', error));
    }
  },
  watch: {
    items: {
      handler(newItems) {
         this.orderUpdate();
      },
      deep: true
    }
  }
});